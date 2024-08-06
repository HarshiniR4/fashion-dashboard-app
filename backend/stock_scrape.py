import os
import time
import pandas as pd
import yfinance as yf
import psycopg2
from psycopg2 import OperationalError
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
from dotenv import load_dotenv
import numpy as np  # Import numpy for type conversion

# Load environment variables from .env file
load_dotenv()

# Database connection details
DB_NAME = os.getenv('POSTGRES_DB')
DB_USER = os.getenv('POSTGRES_USER')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DB_HOST = os.getenv('POSTGRES_HOST')
DB_PORT = os.getenv('POSTGRES_PORT', 5432)  # Default to 5432 if not set

# Connection string
conn_string = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Retry mechanism to wait for the database to be ready
max_retries = 10
retry_count = 0
engine = create_engine(conn_string)

while retry_count < max_retries:
    try:
        conn = psycopg2.connect(conn_string)
        print("Connected to the database.")
        break
    except OperationalError:
        retry_count += 1
        print(f"Database connection failed. Retrying ({retry_count}/{max_retries})...")
        time.sleep(5)

if conn is None:
    print("Failed to connect to the database after multiple retries.")
    exit(1)

# Create a cursor object
cursor = conn.cursor()

def insert_data(cursor, stock_data, stock_forecast, company_id, event_impact_df):
    for record in stock_data:
        cursor.execute(
            "INSERT INTO stock_data (company_id, date, close_price) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
            (company_id, record['date'], record['close_price'])
        )
    for record in stock_forecast:
        cursor.execute(
            "INSERT INTO stock_forecast (company_id, forecast_date, forecast_price) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
            (company_id, record['forecast_date'], float(record['forecast_price']))  # Convert to float
        )
    for _, record in event_impact_df.iterrows():
        cursor.execute(
            "INSERT INTO event_impact (company_id, event_date, event, pre_event_price, post_event_price, impact) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
            (company_id, record['date'], record['event'], record['pre_event_price'], record['post_event_price'], record['impact'])
        )
    conn.commit()

def get_or_insert_company(cursor, stock_symbol, company_name):
    cursor.execute("SELECT id FROM stock_companies WHERE stock_symbol = %s", (stock_symbol,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        cursor.execute(
            "INSERT INTO stock_companies (stock_symbol, company_name) VALUES (%s, %s) RETURNING id",
            (stock_symbol, company_name)
        )
        conn.commit()
        return cursor.fetchone()[0]

def analyze_event_impact(stock_data, events_df):
    impacts = []
    stock_data['date'] = pd.to_datetime(stock_data['date']).dt.tz_localize(None)
    events_df['event_date'] = pd.to_datetime(events_df['event_date']).dt.tz_localize(None)
    for _, event in events_df.iterrows():
        event_date = event['event_date']
        pre_event = stock_data[stock_data['date'] < event_date].tail(1)
        post_event = stock_data[stock_data['date'] > event_date].head(1)
        
        if not pre_event.empty and not post_event.empty:
            impact = {
                'event': event['description'],
                'date': event_date,
                'pre_event_price': pre_event['close_price'].values[0],
                'post_event_price': post_event['close_price'].values[0],
                'impact': post_event['close_price'].values[0] - pre_event['close_price'].values[0]
            }
            impacts.append(impact)
    
    return pd.DataFrame(impacts)

def fetch_events_from_db():
    query = "SELECT ed.event_date, en.description, ed.id as event_date_id, en.id as event_name_id FROM event_dates ed JOIN event_names en ON ed.event_id = en.id WHERE event_date < CURRENT_DATE"
    events_df = pd.read_sql(query, engine)
    return events_df

def insert_repeating_events(cursor, event_name_id, event_date_id, event_date, stock_id, stock_price):
    try:
        cursor.execute(
            "INSERT INTO repeating_events (event_name_id, event_date_id, event_date, stock_id, stock_price) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
            (event_name_id, event_date_id, event_date, stock_id, stock_price)
        )
        conn.commit()
        print(f"Successfully inserted repeating event for {event_date}")
    except Exception as e:
        print(f"Error inserting repeating event for {event_date}: {e}")

# Fetch past fashion events from the database
events_df = fetch_events_from_db()

# List of fashion stocks
fashion_stocks = [
    ('LVMUY', 'Louis Vuitton'),
    ('PPRUY', 'Kering (owns brands like Gucci)'),
    ('NKE', 'Nike'),
    ('HESAY', 'Hermès'),
    ('BURBY', 'Burberry'),
    ('PRDSY', 'Prada'),
    ('RL', 'Ralph Lauren'),
    ('CPRI', 'Capri Holdings (Michael Kors, Versace, Jimmy Choo)'),
    ('TPR', 'Tapestry (Coach, Kate Spade, Stuart Weitzman)')
]

for stock_symbol, company_name in fashion_stocks:
    company_id = get_or_insert_company(cursor, stock_symbol, company_name)

    # Scrape historical stock data
    stock = yf.Ticker(stock_symbol)
    df = stock.history(period="5y")  # Get 5 years of historical data

    if not df.empty:
        df.reset_index(inplace=True)
        df = df.rename(columns={'Date': 'date', 'Close': 'close_price'})
        df = df.dropna(subset=['close_price'])  # Drop rows with NaN close_price
        stock_data = df[['date', 'close_price']].to_dict(orient='records') 

        # Analyze the impact of past fashion events on stock prices
        event_impact_df = analyze_event_impact(df, events_df)
        print(f"Event impact analysis for {stock_symbol} completed.")

        # Generate forecast data using ARIMA from statsmodels
        model = ARIMA(df['close_price'], order=(1, 1, 1))
        model_fit = model.fit()
        forecast_steps = 30  # Forecast for the next 30 days
        forecast = model_fit.forecast(steps=forecast_steps).values  # Ensure forecast is a numpy array

        # Ensure forecast index is correctly aligned
        last_date = df['date'].iloc[-1]
        forecast_index = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=forecast_steps, freq='B')

        print("Debug: Last date in historical data:", last_date)
        print("Debug: Forecast shape:", forecast.shape)
        print("Debug: Forecast index shape:", forecast_index.shape)
        print("Debug: Forecast index:", forecast_index)

        # Additional Debugging: Check forecast values and types
        for i in range(len(forecast)):
            print(f"Debug: Forecast value {i}: {forecast[i]}, Type: {type(forecast[i])}")
            print(f"Debug: Forecast index {i}: {forecast_index[i]}, Type: {type(forecast_index[i])}")

        # Check if forecast and forecast_index have the same length
        if len(forecast) == len(forecast_index):
            stock_forecast = [{'forecast_date': forecast_index[i], 'forecast_price': float(forecast[i])} for i in range(len(forecast))]
            print("Debug: stock_forecast:", stock_forecast)
            # Insert data into the database
            insert_data(cursor, stock_data, stock_forecast, company_id, event_impact_df)
        else:
            print(f"Error: Forecast length {len(forecast)} does not match index length {len(forecast_index)} for {stock_symbol}")

        # Insert data into repeating_events table
        for event in events_df.itertuples():
            for stock in df.itertuples():
                if stock.date == event.event_date:
                    print(f"Inserting into repeating_events for event {event.description} on date {event.event_date} for stock {stock_symbol} with price {stock.close_price}")
                    insert_repeating_events(cursor, event.event_name_id, event.event_date_id, event.event_date, company_id, stock.close_price)

print("Stock data, forecast data, and event impact data have been populated successfully.")

# Close the cursor and connection
cursor.close()
conn.close()

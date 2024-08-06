import os
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from dotenv import load_dotenv
import matplotlib.pyplot as plt

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

# Connect to the database
engine = create_engine(conn_string)
conn = psycopg2.connect(conn_string)
cursor = conn.cursor()

# Fetch repeated events from the fashion calendar
query_events = """
    SELECT e.description, d.event_date
    FROM event_names e
    JOIN event_dates d ON e.id = d.event_id
"""
events_df = pd.read_sql(query_events, engine)

# Identify repeating events and extract different dates
repeating_events = events_df.groupby('description')['event_date'].apply(list).reset_index()

# Print the results
print("Repeating Events and Dates:")
for index, row in repeating_events.iterrows():
    print(f"Event: {row['description']}")
    for date in row['event_date']:
        print(f"  Date: {date}")

# Fetch stock prices for events
def fetch_stock_prices(event_name):
    query = """
    SELECT re.event_date, sc.stock_symbol, re.stock_price, ei.impact
    FROM repeating_events re
    JOIN stock_companies sc ON re.stock_id = sc.id
    JOIN event_impact ei ON re.event_name_id = ei.event AND re.event_date = ei.event_date
    WHERE ei.event = %s
    """
    prices_df = pd.read_sql(query, engine, params=(event_name,))
    return prices_df

# Plot stock prices for an event
def plot_stock_prices(event_name, stock_prices):
    fig, ax = plt.subplots(figsize=(14, 6))
    
    for stock in stock_prices['stock_symbol'].unique():
        stock_df = stock_prices[stock_prices['stock_symbol'] == stock]
        ax.plot(stock_df['event_date'], stock_df['stock_price'], label=stock)
    
    ax.set_title(f'Impact of {event_name} on Stocks')
    ax.set_xlabel('Date')
    ax.set_ylabel('Stock Price (USD)')
    ax.legend()
    plt.show()

# Close the cursor and connection
cursor.close()
conn.close()

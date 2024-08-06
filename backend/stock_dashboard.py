import os
import time
import pandas as pd
import psycopg2
from psycopg2 import OperationalError
from sqlalchemy import create_engine
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection details
DB_NAME = os.getenv('POSTGRES_DB')
DB_USER = os.getenv('POSTGRES_USER')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DB_HOST = os.getenv('POSTGRES_HOST')
DB_PORT = os.getenv('POSTGRES_PORT', 5432)  # Default to 5432 if not set

# Connection string
conn_string = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# Retry mechanism to wait for the database to be ready
max_retries = 10
retry_count = 0
conn = None

while retry_count < max_retries:
    try:
        conn = psycopg2.connect(conn_string)
        print("stock_dashboard: Connected to the database.")
        break
    except OperationalError:
        retry_count += 1
        print(f"Database connection failed. Retrying ({retry_count}/{max_retries})...")
        time.sleep(5)

if conn is None:
    print("Failed to connect to the database after multiple retries.")
    exit(1)

# Use SQLAlchemy engine for pandas
engine = create_engine(conn_string)

@app.route('/api/stock-tickers', methods=['GET'])
def get_stock_tickers():
    query = "SELECT stock_symbol, company_name FROM stock_companies;"
    df = pd.read_sql(query, engine)
    print("Stock Tickers:", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/stock-data/<ticker>', methods=['GET'])
def get_stock_data(ticker):
    query = f"""
    SELECT date, close_price
    FROM stock_data
    JOIN stock_companies ON stock_data.company_id = stock_companies.id
    WHERE stock_companies.stock_symbol = '{ticker}'
    ORDER BY date;
    """
    df = pd.read_sql(query, engine)
    print("Stock Data for", ticker, ":", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/event-names', methods=['GET'])
def get_event_names():
    query = "SELECT id, description FROM event_names ORDER BY description;"
    df = pd.read_sql(query, engine)
    print("Event Names:", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/event-impacts/<event_id>', methods=['GET'])
def get_event_impacts(event_id):
    query = f"""
    SELECT sc.stock_symbol, ei.impact, ei.event_date, ei.post_event_price
    FROM event_impact ei
    JOIN event_dates ed ON ei.event_date = ed.event_date
    JOIN stock_companies sc ON ei.company_id = sc.id
    WHERE ed.event_id = {event_id}
    ORDER BY ei.event_date;
    """
    df = pd.read_sql(query, engine)
    print("Event Impacts for Event ID", event_id, ":", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/stock-forecast/<ticker>', methods=['GET'])
def get_stock_forecast(ticker):
    query = f"""
    SELECT forecast_date, forecast_price
    FROM stock_forecast
    JOIN stock_companies ON stock_forecast.company_id = stock_companies.id
    WHERE stock_companies.stock_symbol = '{ticker}'
    ORDER BY forecast_date
    LIMIT 15;
    """
    df = pd.read_sql(query, engine)
    print("Stock Forecast for", ticker, ":", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/event-impact-graph/<event_id>', methods=['GET'])
def get_event_impact_graph(event_id):
    query = f"""
    SELECT sc.stock_symbol, ei.impact, ei.event_date, ei.post_event_price
    FROM event_impact ei
    JOIN event_dates ed ON ei.event_date = ed.event_date
    JOIN stock_companies sc ON ei.company_id = sc.id
    WHERE ed.event_id = {event_id}
    ORDER BY ei.event_date;
    """
    df = pd.read_sql(query, engine)
    print("Event Impact Graph for Event ID", event_id, ":", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/event-sentiment-scores/<event_id>', methods=['GET'])
def get_event_sentiment_scores(event_id):
    query = f"""
    SELECT re.event_date, sc.stock_symbol, ei.impact, re.stock_price AS sentiment_score
    FROM repeating_events re
    JOIN stock_companies sc ON re.stock_id = sc.id
    JOIN event_impact ei ON re.event_name_id::text = ei.event::text AND re.event_date = ei.event_date
    WHERE ei.event::text = '{event_id}'
    ORDER BY re.event_date;
    """
    df = pd.read_sql(query, engine)
    print("Event Sentiment Scores for Event ID", event_id, ":", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/event-average-impact-graph/<event_id>', methods=['GET'])
def get_event_average_impact_graph(event_id):
    query = f"""
    SELECT sc.stock_symbol, ei.event_date, AVG(ei.impact) as average_impact
    FROM event_impact ei
    JOIN event_dates ed ON ei.event_date = ed.event_date
    JOIN stock_companies sc ON ei.company_id = sc.id
    WHERE ed.event_id = {event_id}
    GROUP BY sc.stock_symbol, ei.event_date
    ORDER BY ei.event_date;
    """
    df = pd.read_sql(query, engine)
    print("Event Average Impact Graph for Event ID", event_id, ":", df.to_dict(orient='records'))  # Debugging statement
    return jsonify(df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

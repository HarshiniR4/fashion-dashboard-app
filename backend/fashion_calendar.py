import os
import time
import pandas as pd
import psycopg2
from selenium.webdriver.common.by import By
from psycopg2 import OperationalError
from sqlalchemy import create_engine
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from datetime import datetime
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection details
DB_NAME = os.getenv('POSTGRES_DB')
DB_USER = os.getenv('POSTGRES_USER')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DB_HOST = os.getenv('POSTGRES_HOST')
DB_PORT = os.getenv('POSTGRES_PORT', 5432)  # Default to 5432 if not set

# Connection string
conn_string = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# Create the SQLAlchemy engine
engine = create_engine(conn_string)

# Retry mechanism to wait for the database to be ready
max_retries = 10
retry_count = 0
conn = None

while retry_count < max_retries:
    try:
        conn = psycopg2.connect(conn_string)
        print("fashion_calendar: Connected to the database.")
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

# Function to fetch events using Selenium
def fetch_events(url):
    # Setting up the Selenium WebDriver
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    driver.get(url)
    time.sleep(3)  # Wait for the page to load

    events = []
    event_elements = driver.find_elements(By.CLASS_NAME, 'p-important-dates__year__grid__item')
    for event in event_elements:
        date = event.find_element(By.CLASS_NAME, 'image-link__meta').text.strip()
        description = event.find_element(By.CLASS_NAME, 'image-link__title').get_attribute('innerText').strip()
        # Remove specific years from the description
        description_no_year = ' '.join([word for word in description.split() if not word.isdigit() and not word.startswith(('20', '19'))])
        events.append((date, description_no_year))

    driver.quit()
    return events

# Function to parse dates
def parse_date(date_str):
    if '-' in date_str:
        start_date = date_str.split('-')[0].strip()
        end_date = date_str.split('-')[-1].strip()
        if ',' in start_date:
            return datetime.strptime(start_date, '%b %d, %Y')
        else:
            year = end_date.split(',')[-1].strip()
            start_date = f"{start_date}, {year}"
            return datetime.strptime(start_date, '%b %d, %Y')
    else:
        return datetime.strptime(date_str, '%b %d, %Y')

# Function to store events in the database
def store_events(events):
    for date, description in events:
        # Insert or get event_id from event_names table
        cursor.execute("INSERT INTO event_names (description) VALUES (%s) ON CONFLICT (description) DO NOTHING RETURNING id", (description,))
        result = cursor.fetchone()
        if result is None:
            cursor.execute("SELECT id FROM event_names WHERE description = %s", (description,))
            event_id = cursor.fetchone()[0]
        else:
            event_id = result[0]

        # Insert the event date with the event_id into event_dates table
        event_date = parse_date(date)
        cursor.execute("INSERT INTO event_dates (event_id, event_date) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING id", (event_id, event_date))
        event_date_id = cursor.fetchone()[0]

        # Fetch stock prices for the event date and insert into repeating_events
        cursor.execute("SELECT id, stock_symbol FROM stock_companies")
        stocks = cursor.fetchall()
        for stock in stocks:
            stock_id, stock_symbol = stock
            cursor.execute("SELECT close_price FROM stock_data WHERE company_id = %s AND date = %s", (stock_id, event_date))
            stock_price_result = cursor.fetchone()
            if stock_price_result:
                stock_price = stock_price_result[0]
                cursor.execute(
                    "INSERT INTO repeating_events (event_name_id, event_date_id, event_date, stock_id, stock_price) VALUES (%s, %s, %s, %s, %s)",
                    (event_id, event_date_id, event_date, stock_id, stock_price)
                )

    conn.commit()

# URLs for scraping
upcoming_url = "https://cfda.com/fashion-calendar/important-dates/upcoming"

# Generate URLs for the last 5 years including 2024
years = [2024, 2023, 2022, 2021, 2020]
past_urls = [f"https://cfda.com/fashion-calendar/past-seasons/{year}" for year in years]

# Fetch upcoming events
upcoming_events = fetch_events(upcoming_url)

# Fetch past events for the last 5 years
past_events = []
for url in past_urls:
    past_events.extend(fetch_events(url))

print("Past events")
for event in past_events:
    print(event)

# Combine events
all_events = upcoming_events + past_events

# Store events in the database
store_events(all_events)

print("Events have been stored in the database.")

# Example to read from the database and print
print(pd.read_sql('SELECT * FROM event_names', engine))
print(pd.read_sql('SELECT * FROM event_dates', engine))
print(pd.read_sql('SELECT * FROM repeating_events', engine))

# Close the database connection
conn.close()

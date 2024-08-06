#!/bin/sh
set -e

echo "Running fashion_calendar.py..."
python fashion_calendar.py || { echo 'fashion_calendar.py failed'; exit 1; }

echo "Running stock_scrape.py..."
python stock_scrape.py || { echo 'stock_scrape.py failed'; exit 1; }

echo "Running analyze_event_stock_impact.py..."
python analyze_event_stock_impact.py || { echo 'analyze_event_stock_impact.py failed'; exit 1; }

echo "Running stock_dashboard.py..."
python stock_dashboard.py || { echo 'stock_dashboard.py failed'; exit 1; }

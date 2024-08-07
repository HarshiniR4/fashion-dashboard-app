# Fashion Investment Dashboard Website

![Fashion Investment Dashboard](https://github.com/HarshiniR4/fashion-dashboard-app/blob/main/Fashion_Project_Screenshot.png)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
The Fashion Investment Dashboard is a comprehensive web application that helps users make informed investment decisions in the fashion industry. It combines financial data, stock analysis, and upcoming events to provide users with a holistic view of market trends and investment opportunities. This project enabled me to combine interesting aspects of fashion and finance as a means to learn key concepts of web development. 

## Features
- **Stock Analysis**: View historical and forecasted price analysis of selected stocks.
- **Event Analysis**: Analyze the impact of upcoming fashion events on stock prices.
- **Investment Recommendations**: Get curated investment opportunities with detailed performance metrics.
- **Fashion Brands Integration**: See associated fashion brands for selected stocks.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used
- **Frontend**:
  - React.js
  - Material-UI
  - Plotly.js

- **Backend**:
  - Python
  - Flask
  - Pandas
  - PostgreSQL

- **Others**:
  - Docker
  - Docker Compose

## Setup
### Prerequisites
- Docker
- Docker Compose

### Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/HarshiniR4/fashion-dashboard-app.git
    cd fashion-dashboard-app
    ```

2. **Set up environment variables**:
   - Create a `.env` file in the root directory of the project and add the necessary environment variables:
     ```env
     FLASK_APP=app
     FLASK_ENV=development
     DATABASE_URL=postgresql://username:password@db:5432/your_database
     ```

3. **Start the Backend of the application**:
    ```bash
    cd backend
    pip install requirements.txt
    ./run_all.sh
    ```
    **Note**: You can create a virtual environment for the backend to install necessary libraries form the requirements.txt and then proceed with running the script.
4. **Start the Frontend of the application**:
    ```bash
    cd frontend
    npm run build
    npm start
    ```
5. **Access the application**:
   - The application will be running at `http://localhost:3000`
   - The Flask API will be running at `http://localhost:5000`

## Usage
### Frontend
- Navigate to the homepage to view the main dashboard.
- Use the navigation buttons to access different sections such as Stock Analysis, Event Analysis, and Invest.
- Hover over stock tickers to view associated fashion brands and detailed metrics.

### Backend
- Access API endpoints for stock tickers, stock data, stock forecasts, and fashion brands.

## Endpoints
### Stock Tickers
- **GET /api/stock-tickers**
  - Fetch a list of available stock tickers.

### Stock Data
- **GET /api/stock-data/{ticker}**
  - Fetch historical stock data for the specified ticker.

### Stock Forecast
- **GET /api/stock-forecast/{ticker}**
  - Fetch forecasted stock data for the specified ticker.

### Fashion Brands
- **GET /api/fashion-brands/{ticker}**
  - Fetch associated fashion brands for the specified ticker.

### Upcoming Events
- **GET /api/upcoming-events**
  - Fetch a list of upcoming fashion events.

## Folder Structure
```
fashion-dashboard-app/
├── app/
│   ├── analyze_event_stock_data.py
│   ├── entrypoint.sh
│   ├── fashion_calendar.py
│   ├── requirements.txt
│   ├── stock_dashboard.py
│   ├── stock_scrape.py
├── postgres_setup/
│   ├── init.sql
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.js
│   │   │   ├── EventAnalysis.js
│   │   │   ├── Home.js
│   │   │   ├── Invest.js
│   │   │   ├── Layout.js
│   │   │   ├── StockAnalysis.js
│   │   │   └── images/
│   │   │       ├── burberry.jpg
│   │   │       ├── chanel.jpg
│   │   │       ├── ...
├── .gitignore
```

## Backend Files and Functionalities
### app/analyze_event_stock_data.py
- Analyzes the impact of past fashion events on stock prices.
- Fetches stock data, sentiment data, and event impact data from the database.
- Calculates historical performance metrics, sentiment forecast trend, and average event impact.
- Generates investment recommendations based on these analyses.

### app/fashion_calendar.py
- Uses Selenium to scrape upcoming and past fashion event data from a website.
- Parses and stores event data in the database, associating events with relevant stock prices.

### app/stock_dashboard.py
- Main Flask application providing API endpoints for various functionalities.
- Endpoints include fetching stock tickers, stock data, stock forecasts, event impacts, upcoming events, and fashion brands.
- Also includes an endpoint for generating recommended stocks based on performance analysis.

### app/stock_scrape.py
- Uses yfinance to fetch historical stock data for fashion-related stocks.
- Stores fetched stock data and forecasted stock data in the database.
- Analyzes the impact of past fashion events on stock prices and stores this data in the database.

### postgres_setup/init.sql
- SQL script for setting up and initializing the PostgreSQL database.
- Defines the schema for tables including stock companies, stock data, stock forecasts, event impact, repeating events, event dates, event names, and fashion brands.
- Inserts initial sample data into the database.

### Stock Forecast Methods
The stock forecast methods utilize the ARIMA model to predict future stock prices based on historical data. The key steps include:
- **Fetching Historical Data**: Using the yfinance library to retrieve historical stock prices.
- **Generating Forecasts**: Applying the ARIMA model to generate forecasts for future stock prices.
- **Storing Forecasts**: Saving the forecasted data in the PostgreSQL database for later use.

### Event Impact Calculation
The event impact calculation involves analyzing how specific fashion events affect stock prices. The key steps include:
- **Fetching Event Data**: Retrieving event dates and descriptions from the CFDA website.
- **Analyzing Stock Prices**: Comparing stock prices before and after each event to measure the impact.
- **Calculating Impact Metrics**: Computing metrics such as average impact, positive/negative impacts, and generating visual graphs.

### Recommended Stock Prediction
The recommended stock prediction identifies stocks with strong performance metrics for investment. The key steps include:
- **Analyzing Performance Metrics**: Evaluating stocks based on average return, volatility, cumulative return, sentiment trend, and event impact.
- **Filtering Stocks**: Selecting stocks that meet the criteria for investment, such as positive average return and lower volatility.
- **Generating Recommendations**: Providing a list of recommended stocks with detailed performance metrics.

## Contributing
Contributions are welcome! Please create a new branch for each feature or bug fix and submit a pull request for review.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries, please contact:
- **Name**: Harshini Raju
- **LinkedIn**: [Harshini Raju](https://www.linkedin.com/in/harshini-raju-8083181a0/)
- **GitHub**: [HarshiniR4](https://github.com/HarshiniR4)

## Project Demo
For a visual overview of the Fashion Investment Dashboard, please watch the [project demo video](https://github.com/HarshiniR4/fashion-dashboard-app/blob/main/Fashion%20Stocks%20Project%20Video.mp4).

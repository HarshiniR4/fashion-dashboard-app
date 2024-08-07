# Fashion Stocks Dashboard

![Fashion Stocks Dashboard](https://github.com/HarshiniR4/fashion-dashboard-app/blob/main/Fashion_Project_Screenshot.png)

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
The Fashion Stocks Dashboard is a comprehensive web application that helps users make informed investment decisions in the fashion industry. It combines financial data, stock analysis, and upcoming events to provide users with a holistic view of the market trends and investment opportunities.

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

3. **Start the application using Docker Compose**:
    ```bash
    docker-compose up --build
    ```

4. **Access the application**:
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
│   ├── cache/
│   ├── analyze_event_stock_data.py
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── fashion_calendar.py
│   ├── requirements.txt
│   ├── stock_dashboard.py
│   ├── stock_scrape.py
├── postgres_setup/
│   ├── init.sql
├── venv/
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
├── .env
├── .gitignore
├── docker-compose.yml
```

## Contributing
Contributions are welcome! Please create a new branch for each feature or bug fix and submit a pull request for review.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries, please contact:
- **Name**: Your Name
- **LinkedIn **: [Harshini Raju](https://www.linkedin.com/in/harshini-raju-8083181a0/)
- **GitHub**: [HarshiniR4](https://github.com/HarshiniR4)

## Project Demo
For a visual overview of the Fashion Stocks Dashboard, please watch the [project demo video](https://github.com/HarshiniR4/fashion-dashboard-app/blob/main/Fashion%20Stocks%20Project%20Video.mp4).

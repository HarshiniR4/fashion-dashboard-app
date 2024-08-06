import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { useHistory } from 'react-router-dom';
import { Container, Typography, Button, MenuItem, Select, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import Layout from './Layout';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: '#f7e6e9', // Light pink background
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  minHeight: '100vh',
  borderLeft: '5px solid #000', // Black metallic border
  borderRight: '5px solid #000', // Black metallic border
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: '10px',
  color: '#333',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
}));

const PlotContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
  width: '100%',
  height: '100%',
}));

const StockAnalysis = () => {
  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:5000/api/stock-tickers')
      .then(response => {
        setTickers(response.data);
      })
      .catch(error => {
        console.error('Error fetching tickers:', error);
      });
  }, []);

  const handleTickerChange = (e) => {
    const ticker = e.target.value;
    setSelectedTicker(ticker);
    axios.get(`http://localhost:5000/api/stock-data/${ticker}`)
      .then(response => {
        console.log('Stock Data:', response.data); // Debugging: Check stock data
        setStockData(response.data.map(d => {
          const date = new Date(d.date);
          if (isNaN(date.getTime())) {
            console.error('Invalid date in stock data:', d.date);
            return null;
          }
          return {
            date,
            close_price: d.close_price
          };
        }).filter(d => d !== null));
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
      });

    axios.get(`http://localhost:5000/api/stock-forecast/${ticker}`)
      .then(response => {
        console.log('Forecast Data:', response.data); // Debugging: Check forecast data
        if (Array.isArray(response.data)) {
          setForecastData(response.data.map(d => {
            const date = new Date(d.forecast_date);
            if (isNaN(date.getTime())) {
              console.error('Invalid date in forecast data:', d.forecast_date);
              return null;
            }
            return {
              forecast_date: date,
              forecast_price: d.forecast_price
            };
          }).filter(d => d !== null));
        } else {
          console.error('Unexpected response format for forecast data:', response.data);
          setForecastData([]);
        }
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Layout>
      <StyledContainer>
        <StyledButton onClick={() => history.goBack()}>Back</StyledButton>
        <StyledTypography variant="h2">Stock Investing Guide</StyledTypography>
        <StyledTypography variant="h5" gutterBottom>
          Select a stock ticker to view detailed historical and forecasted price analysis to help you invest smartly and safely.
        </StyledTypography>
        <Select value={selectedTicker} onChange={handleTickerChange} fullWidth>
          <MenuItem value="" disabled>Select a stock ticker</MenuItem>
          {tickers.map(ticker => (
            <MenuItem key={ticker.stock_symbol} value={ticker.stock_symbol}>{ticker.company_name} ({ticker.stock_symbol})</MenuItem>
          ))}
        </Select>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {stockData && (
              <PlotContainer>
                <Plot
                  data={[
                    {
                      x: stockData.map(d => formatDate(d.date)),
                      y: stockData.map(d => d.close_price),
                      type: 'scatter',
                      mode: 'lines+markers',
                      marker: { color: 'blue' },
                      name: 'Historical Prices',
                    },
                  ]}
                  layout={{
                    title: `Stock Prices for ${selectedTicker}`,
                    xaxis: { title: 'Date', tickfont: { family: 'Raleway, sans-serif' } },
                    yaxis: { title: 'Close Price', tickfont: { family: 'Raleway, sans-serif' } },
                    font: { family: 'Playfair Display, serif', size: 12 },
                    plot_bgcolor: '#fff',
                    paper_bgcolor: '#fff',
                    hovermode: 'closest',
                    margin: { t: 50, l: 50, r: 50, b: 50 },
                    height: 400, // Increased height
                    autosize: true,
                  }}
                  config={{ responsive: true }}
                  style={{ width: '100%', height: '100%' }}
                />
              </PlotContainer>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {forecastData.length > 0 && (
              <PlotContainer>
                <Plot
                  data={[
                    {
                      x: forecastData.map(d => formatDate(d.forecast_date)),
                      y: forecastData.map(d => d.forecast_price),
                      type: 'scatter',
                      mode: 'lines+markers',
                      marker: { color: 'red' },
                      name: 'Forecasted Prices',
                    },
                  ]}
                  layout={{
                    title: `Forecasted Prices for ${selectedTicker}`,
                    xaxis: { title: 'Forecast Date', tickfont: { family: 'Raleway, sans-serif' } },
                    yaxis: { title: 'Forecast Price', tickfont: { family: 'Raleway, sans-serif' } },
                    font: { family: 'Playfair Display, serif', size: 12 },
                    plot_bgcolor: '#fff',
                    paper_bgcolor: '#fff',
                    hovermode: 'closest',
                    margin: { t: 50, l: 50, r: 50, b: 50 },
                    height: 400, // Increased height
                    autosize: true,
                  }}
                  config={{ responsive: true }}
                  style={{ width: '100%', height: '100%' }}
                />
              </PlotContainer>
            )}
          </Grid>
        </Grid>
      </StyledContainer>
    </Layout>
  );
};

export default StockAnalysis;

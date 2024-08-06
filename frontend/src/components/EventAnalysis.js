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
}));

const EventAnalysis = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventImpactData, setEventImpactData] = useState([]);
  const [eventSentimentScores, setEventSentimentScores] = useState([]);
  const [eventAverageImpact, setEventAverageImpact] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:5000/api/event-names')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);

    axios.get(`http://localhost:5000/api/event-impacts/${eventId}`)
      .then(response => {
        setEventImpactData(response.data);
      })
      .catch(error => {
        console.error('Error fetching event impact data:', error);
      });

    axios.get(`http://localhost:5000/api/event-sentiment-scores/${eventId}`)
      .then(response => {
        setEventSentimentScores(response.data);
      })
      .catch(error => {
        console.error('Error fetching event sentiment scores:', error);
      });

    axios.get(`http://localhost:5000/api/event-average-impact-graph/${eventId}`)
      .then(response => {
        setEventAverageImpact(response.data);
      })
      .catch(error => {
        console.error('Error fetching event average impact data:', error);
      });
  };

  const getImpactGraphData = () => {
    const data = [];
    const groupedData = eventImpactData.reduce((acc, current) => {
      (acc[current.stock_symbol] = acc[current.stock_symbol] || []).push(current);
      return acc;
    }, {});

    for (const stockSymbol in groupedData) {
      const stockData = groupedData[stockSymbol];
      data.push({
        x: stockData.map(d => d.event_date),
        y: stockData.map(d => d.impact),
        type: 'scatter',
        mode: 'lines+markers',
        name: stockSymbol
      });
    }
    return data;
  };

  const getSentimentGraphData = () => {
    const data = [];
    const groupedData = eventSentimentScores.reduce((acc, current) => {
      (acc[current.stock_symbol] = acc[current.stock_symbol] || []).push(current);
      return acc;
    }, {});

    for (const stockSymbol in groupedData) {
      const stockData = groupedData[stockSymbol];
      data.push({
        x: stockData.map(d => d.event_date),
        y: stockData.map(d => d.sentiment_score),
        type: 'scatter',
        mode: 'lines+markers',
        name: stockSymbol
      });
    }
    return data;
  };

  const getAverageImpactGraphData = () => {
    const data = [];
    const groupedData = eventAverageImpact.reduce((acc, current) => {
      const key = `${current.event_date} - ${current.stock_symbol}`;
      (acc[key] = acc[key] || []).push(current);
      return acc;
    }, {});

    for (const key in groupedData) {
      const stockData = groupedData[key];
      data.push({
        x: stockData.map(d => d.event_date),
        y: stockData.map(d => d.average_impact),
        type: 'bar',
        name: stockData[0].stock_symbol
      });
    }
    return data;
  };

  return (
    <Layout>
      <StyledContainer>
        <StyledButton onClick={() => history.goBack()}>Back</StyledButton>
        <StyledTypography variant="h2">Fashion Events & Stock Prices</StyledTypography>
        <StyledTypography variant="h5" gutterBottom>
          Select an event to view its impact on major fashion brands and plan your investments better!
        </StyledTypography>
        <Select value={selectedEvent} onChange={handleEventChange} fullWidth>
          <MenuItem value="" disabled>Select an event</MenuItem>
          {events.map(event => (
            <MenuItem key={event.id} value={event.id}>{event.description}</MenuItem>
          ))}
        </Select>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {eventImpactData.length > 0 && (
              <PlotContainer>
                <Plot
                  data={getImpactGraphData()}
                  layout={{
                    title: `Event Impact Scores for ${events.find(event => event.id === selectedEvent)?.description}`,
                    xaxis: { title: 'Event Date', tickfont: { family: 'Raleway, sans-serif' } },
                    yaxis: { title: 'Impact', tickfont: { family: 'Raleway, sans-serif' } },
                    font: { family: 'Playfair Display, serif', size: 12 },
                    plot_bgcolor: '#fff',
                    paper_bgcolor: '#fff',
                    hovermode: 'closest',
                    margin: { t: 30, l: 50, r: 20, b: 50 },
                    autosize: true,
                  }}
                  config={{ responsive: true }}
                  style={{ width: '75%', height: '75%' }}
                />
              </PlotContainer>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {eventSentimentScores.length > 0 && (
              <PlotContainer>
                <Plot
                  data={getSentimentGraphData()}
                  layout={{
                    title: `Event Sentiment Scores for ${events.find(event => event.id === selectedEvent)?.description}`,
                    xaxis: { title: 'Event Date', tickfont: { family: 'Raleway, sans-serif' } },
                    yaxis: { title: 'Sentiment Score', tickfont: { family: 'Raleway, sans-serif' } },
                    font: { family: 'Playfair Display, serif', size: 12 },
                    plot_bgcolor: '#fff',
                    paper_bgcolor: '#fff',
                    hovermode: 'closest',
                    margin: { t: 30, l: 50, r: 20, b: 50 },
                    autosize: true,
                  }}
                  config={{ responsive: true }}
                  style={{ width: '75%', height: '75%' }}
                />
              </PlotContainer>
            )}
          </Grid>
          <Grid item xs={12}>
            {eventAverageImpact.length > 0 && (
              <PlotContainer>
                <Plot
                  data={getAverageImpactGraphData()}
                  layout={{
                    title: `Event Average Impact for ${events.find(event => event.id === selectedEvent)?.description}`,
                    xaxis: { title: 'Event Date', tickfont: { family: 'Raleway, sans-serif' } },
                    yaxis: { title: 'Average Impact', tickfont: { family: 'Raleway, sans-serif' } },
                    font: { family: 'Playfair Display, serif', size: 12 },
                    plot_bgcolor: '#fff',
                    paper_bgcolor: '#fff',
                    hovermode: 'closest',
                    margin: { t: 30, l: 50, r: 20, b: 50 },
                    autosize: true,
                  }}
                  config={{ responsive: true }}
                  style={{ width: '75%', height: '75%' }}
                />
              </PlotContainer>
            )}
          </Grid>
        </Grid>
      </StyledContainer>
    </Layout>
  );
};

export default EventAnalysis;

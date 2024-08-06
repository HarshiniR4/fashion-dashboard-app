import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useHistory } from 'react-router-dom';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  backgroundColor: '#333', // Darker color for the box
  color: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const BrandList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#444',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const BrandCard = styled(Card)(({ theme }) => ({
  maxWidth: 200,
  margin: theme.spacing(2),
  backgroundColor: '#555',
}));

const BrandMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
}));

const BrandName = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: 'Playfair Display',
  fontWeight: 700,
  color: '#fff',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
  marginBottom: theme.spacing(2),
}));

const Invest = () => {
  const [investmentOptions, setInvestmentOptions] = useState([]);
  const [hoveredStock, setHoveredStock] = useState(null);
  const [brands, setBrands] = useState({});
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:5000/api/recommended-stocks')
      .then(response => {
        setInvestmentOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching investment options:', error);
      });
  }, []);

  const handleMouseEnter = (stockSymbol) => {
    setHoveredStock(stockSymbol);
    if (!brands[stockSymbol]) {
      axios.get(`http://localhost:5000/api/fashion-brands/${stockSymbol}`)
        .then(response => {
          setBrands(prevBrands => ({
            ...prevBrands,
            [stockSymbol]: response.data,
          }));
        })
        .catch(error => {
          console.error(`Error fetching brands for ${stockSymbol}:`, error);
        });
    }
  };

  const handleMouseLeave = () => {
    setHoveredStock(null);
  };

  const formatNumber = (number) => {
    return (number !== undefined && !isNaN(number)) ? number.toFixed(2) : 'N/A';
  };

  return (
    <Layout>
      <StyledContainer>
        <StyledButton onClick={() => history.goBack()}>Back</StyledButton>
        <StyledTypography variant="h2">Invest</StyledTypography>
        <StyledTypography variant="h5" gutterBottom>
          Discover Investment Opportunities in the Fashion Industry
        </StyledTypography>
        <Typography variant="body1" paragraph>
          Explore various investment opportunities in the fashion industry. Understand the market trends, analyze stock performances, and make informed decisions to grow your investments.
        </Typography>
        <StyledTypography variant="h4">Best Investment Options</StyledTypography>
        <List>
          {investmentOptions.map((option, index) => (
            <StyledPaper
              key={index}
              onMouseEnter={() => handleMouseEnter(option.ticker)}
              onMouseLeave={handleMouseLeave}
            >
              <ListItem>
                <ListItemText
                  primary={`${option.ticker}`}
                  secondary={
                    <Box>
                      <Typography>Average Return: {formatNumber(option.avg_return * 100)}%</Typography>
                      <Typography>Volatility: {formatNumber(option.volatility)}</Typography>
                      <Typography>Cumulative Return: {formatNumber(option.cumulative_return * 100)}%</Typography>
                      <Typography>Sentiment Trend: {formatNumber(option.sentiment_trend)}</Typography>
                      <Typography>Average Event Impact: {formatNumber(option.avg_event_impact)}</Typography>
                    </Box>
                  }
                  primaryTypographyProps={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}
                  secondaryTypographyProps={{ fontFamily: 'Raleway', fontSize: '1rem', color: '#ccc' }}
                />
              </ListItem>
              {hoveredStock === option.ticker && brands[option.ticker] && (
                <BrandList>
                  <Typography variant="h6" gutterBottom>Brands:</Typography>
                  <Grid container spacing={2} justifyContent="center">
                    {brands[option.ticker].map((brand, brandIndex) => {
                      const imageName = `${process.env.PUBLIC_URL}/images/${brand.brand_name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
                      console.log('Image URL:', imageName); // Console log to check the image URL
                      return (
                        <Grid item key={brandIndex}>
                          <BrandCard>
                            <BrandMedia
                              image={imageName} // Assuming you have images named based on brand names
                              title={brand.brand_name}
                            />
                            <CardContent>
                              <BrandName variant="h6">{brand.brand_name}</BrandName>
                            </CardContent>
                          </BrandCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                </BrandList>
              )}
            </StyledPaper>
          ))}
        </List>
      </StyledContainer>
    </Layout>
  );
};

export default Invest;

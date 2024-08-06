import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, Button, CardContent, CardMedia, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Layout from './Layout';

// Paths to images in the public directory
const LVImage = process.env.PUBLIC_URL + '/images/LV.jpg';
const ChanelImage = process.env.PUBLIC_URL + '/images/chanel.jpg';
const ValentinoImage = process.env.PUBLIC_URL + '/images/valentino.jpg';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: '#f7e6e9', // Light pink background
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  minHeight: '100vh',
  borderLeft: '5px solid #000', // Black metallic border
  borderRight: '5px solid #000', // Black metallic border
}));

const Collage = styled('div')({
  position: 'relative',
  height: '70vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  '&:hover img': {
    transform: 'scale(1.05)',
    transition: 'transform 0.5s ease',
  },
});

const CollageImage = styled('img')({
  width: '33.33%',
  height: '100%',
  objectFit: 'cover',
});

const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  background: 'rgba(0, 0, 0, 0.5)',
  textAlign: 'center',
  padding: '20px',
  boxSizing: 'border-box',
  animation: 'fadeIn 2s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#fff',
  marginBottom: '10px',
}));

const EventCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#fff',
  position: 'relative',
  maxWidth: 150, // Reduced the size of the event cards
  margin: '0 auto',
  '&:hover img': {
    transform: 'scale(1.05)',
    transition: 'transform 0.5s ease',
  },
}));

const EventCardMedia = styled(CardMedia)({
  height: 200, // Reduced the height of the event cards
  objectFit: 'cover',
});

const EventOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
  padding: '20px',
  textAlign: 'center',
  boxSizing: 'border-box',
});

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/upcoming-events')
      .then(response => {
        setUpcomingEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching upcoming events:', error);
      });
  }, []);

  return (
    <Layout>
      <StyledContainer>
        <Collage>
          <CollageImage src={ChanelImage} alt="Chanel" />
          <CollageImage src={LVImage} alt="Louis Vuitton" />
          <CollageImage src={ValentinoImage} alt="Valentino" />
          <Overlay>
            <StyledTypography variant="h1">
              Fashion & Finance
            </StyledTypography>
            <StyledTypography variant="h3">
              Invest Smart & Earn Fashionably
            </StyledTypography>
          </Overlay>
        </Collage>
        <ButtonContainer>
          <Link to="/stock-analysis" style={{ textDecoration: 'none' }}>
            <StyledButton variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
              Stock Analysis
            </StyledButton>
          </Link>
          <Link to="/event-analysis" style={{ textDecoration: 'none' }}>
            <StyledButton variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
              Event Analysis
            </StyledButton>
          </Link>
          <Link to="/invest" style={{ textDecoration: 'none' }}>
            <StyledButton variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
              Invest
            </StyledButton>
          </Link>
        </ButtonContainer>

        {/* Upcoming Events Section */}
        <StyledTypography variant="h4" gutterBottom style={{ color: '#000' }}>
          Upcoming Events
        </StyledTypography>
        <Grid container spacing={4}>
          {upcomingEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <EventCard>
                <EventCardMedia
                  image={`${process.env.PUBLIC_URL}/images/${event.event_name.replace(/\s+/g, '_').toLowerCase()}.jpg`} // Assuming you have images named based on event names
                  title={event.event_name}
                />
                <EventOverlay>
                  <Typography variant="h5">{event.event_name}</Typography>
                  <Typography variant="subtitle1">{new Date(event.event_date).toLocaleDateString()}</Typography>
                </EventOverlay>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      </StyledContainer>
    </Layout>
  );
};

export default Home;

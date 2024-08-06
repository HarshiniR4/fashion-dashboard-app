import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/system';

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
  
const About = () => {
  const history = useHistory();

  return (
    <StyledContainer>
      <StyledButton onClick={() => history.goBack()}>Back</StyledButton>
      <StyledTypography variant="h2">About Us</StyledTypography>
      <StyledTypography variant="h5" gutterBottom>
        Welcome to our Fashion Magazine and Investment Guide!
      </StyledTypography>
      <Typography variant="body1">
        Our mission is to bridge the gap between fashion and finance. We provide detailed analysis of fashion brands and events to help you make informed investment decisions. Our team of experts curates content to ensure you stay updated with the latest trends in the fashion industry while also understanding their financial impacts.
      </Typography>
    </StyledContainer>
  );
};

export default About;

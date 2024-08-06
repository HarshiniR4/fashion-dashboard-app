import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Home from './components/Home';
import StockAnalysis from './components/StockAnalysis';
import EventAnalysis from './components/EventAnalysis';
import About from './components/About';
import Invest from './components/Invest';
const theme = createTheme({
  palette: {
    background: {
      default: '#f7e6e9', // Light pink background
    },
    primary: {
      main: '#000', // Black
    },
    secondary: {
      main: '#f7e6e9', // Soft pastel pink
    },
  },
  typography: {
    fontFamily: 'Raleway, Arial',
    h1: {
      fontFamily: 'Playfair Display, serif',
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/stock-analysis" component={StockAnalysis} />
          <Route path="/event-analysis" component={EventAnalysis} />
          <Route path="/about" component={About} />
          <Route path="/invest" component={Invest} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)({
  background: '#000',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const drawerWidth = 250;

const DrawerContainer = styled(Box)({
  width: drawerWidth,
  backgroundColor: '#000',
  height: '100%',
  color: '#fff',
});

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerItems = (
    <DrawerContainer
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/about">
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button component={Link} to="/stock-analysis">
          <ListItemText primary="Stock Analysis" />
        </ListItem>
        <ListItem button component={Link} to="/event-analysis">
          <ListItemText primary="Event Analysis" />
        </ListItem>
        <ListItem button component={Link} to="/invest">
          <ListItemText primary="Invest" />
        </ListItem>
      </List>
    </DrawerContainer>
  );

  return (
    <div>
      <StyledAppBar position="static">
        <StyledToolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ fontFamily: 'Playfair Display' }}>
            Fashion & Finance
          </Typography>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </StyledToolbar>
      </StyledAppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerItems}
      </Drawer>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Hidden,
  Paper,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from './context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Budget Management
        </Typography>

        <Hidden smDown>
          {isAuthenticated && (
            <Button color="inherit" component={Link} to="/families">
              Families
            </Button>
          )}

          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}

          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Hidden>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Typography variant="h6" component="div" sx={{ textAlign: 'center', paddingY: '2rem', flexGrow: 1 }}>
            Budget Management
          </Typography>
          <Divider />
          <Paper sx={{ width: '50vw', minWidth: 250, height: '100%' }}>
            <List>
              {isAuthenticated && (
                <>
                  <ListItem button component={Link} to="/families">
                    <ListItemText primary="Families" />
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <ListItem button component={Link} to="/login">
                    <ListItemText primary="Login" />
                  </ListItem>
                  <Divider />
                  <ListItem button component={Link} to="/register">
                    <ListItemText primary="Register" />
                  </ListItem>
                </>
              )}
            </List>

            <Divider />

            <Box sx={{ marginRight: 2 }}>
              <IconButton
                sx={{ position: 'absolute', top: 0, right: 0 }}
                onClick={toggleDrawer(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Paper>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

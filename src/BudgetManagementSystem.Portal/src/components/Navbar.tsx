import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider, Hidden, Paper, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { UserRole } from './models/constants';
import { useAuth } from './context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
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

        <Box style={{ flexGrow: 1 }}>
          <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Budget Management
          </Typography>
        </Box>

        <Hidden smDown>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && userRole === 'Owner' && (
              <>
                <Button color="inherit" component={Link} to="/families">
                  Families
                </Button>
                {/* Add other links accessible to users */}
              </>
            )}

            {isAuthenticated && userRole === 'Admin' && (
              <Button color="inherit" component={Link} to="/users">
                Users
              </Button>
              // You can add more admin-specific links if needed
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
          </Box>
        </Hidden>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: "'Poppins', sans-serif", paddingY: '2rem' }} component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Budget Management
          </Typography>
          <Divider />
          <Paper sx={{ width: '50vw', minWidth: 250, height: '100%' }}>
            <List>
              {isAuthenticated && userRole === 'Admin' &&(
                <>
                  <ListItem button component={Link} to="/users">
                    <ListItemText primary="Users" />
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              )}

              {isAuthenticated && userRole === 'Owner' &&(
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

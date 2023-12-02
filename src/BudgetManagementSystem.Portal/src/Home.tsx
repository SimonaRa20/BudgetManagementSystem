import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import BudgetImage from './Budget.svg';

const Home = () => {
  return (
    <Box sx={{ marginTop: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={BudgetImage}
            alt="Budget Management"
            style={{ maxWidth: '75%', maxHeight: '75%', borderRadius: 8, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Budget Management
          </Typography>
          <Typography variant="body1" paragraph>
            Manage your finances with ease using our Budget Management website. Track expenses, set budgets, and achieve your financial goals.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;

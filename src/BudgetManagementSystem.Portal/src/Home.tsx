import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import BudgetImage from './Budget.jpg';

const Home = () => {
  return (
    <Box sx={{ marginTop: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img
            src={BudgetImage}
            alt="Budget Management"
            style={{ width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

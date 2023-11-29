import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import { UserResponse } from '../models/auth';
const Users: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const expectedRole = 'Admin'; // Set the expected role here

  const getUsersEndpoint = `${API_BASE_URL}/api/Users`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (isAuthenticated && userRole === expectedRole) {
          const token = localStorage.getItem('token');
          const response = await axios.get<UserResponse[]>(getUsersEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUsers(response.data);
        } else {
          console.warn("You don't have permissions to view users.");
        }
      } catch (error: any) {
        console.error('Failed to fetch users:', error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [isAuthenticated, getUsersEndpoint, userRole, expectedRole]);

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
        {isAuthenticated && userRole === expectedRole ? (
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card style={{ marginBottom: '16px' }}>
                  <CardContent>
                    <Typography variant="h5">
                      {user.username}
                    </Typography>
                    <Typography color="textSecondary">
                      Email: {user.email}
                    </Typography>
                    <Typography color="textSecondary">
                      Name: {user.name} {user.surname}
                    </Typography>
                    {/* Add additional user details as needed */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      {/* Add additional actions as needed */}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6">
            {isAuthenticated
              ? "You don't have permissions."
              : 'Please login to view users.'}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Users;
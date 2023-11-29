import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
          <>
            <Typography variant="h4" gutterBottom>
              Users
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>Name</TableCell>
                    <TableCell>Surname</TableCell>
                    <TableCell>Email</TableCell>
                    
                    {/* Add additional headers for more user details */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.surname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      {/* Add additional cells for more user details */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
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

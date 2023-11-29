import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import { UserResponse } from '../models/auth';
import DeleteUserModal from './DeleteUserModal';

const Users: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const expectedRole = 'Admin';

  const getUsersEndpoint = `${API_BASE_URL}/api/Users`;

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

  useEffect(() => {
    fetchUsers();
  }, [isAuthenticated, getUsersEndpoint, userRole, expectedRole]);

  const handleOpenDeleteModal = (userId: number) => {
    setDeleteUserId(userId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteUserId(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteSuccess = async () => {
    try {
      await fetchUsers();
    } catch (error: any) {
      console.error('Failed to fetch users:', error.response?.data || error.message);
    }
  };

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
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.surname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDeleteModal(user.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <DeleteUserModal
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              userId={deleteUserId}
              onDeleteSuccess={handleDeleteSuccess}
            />
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

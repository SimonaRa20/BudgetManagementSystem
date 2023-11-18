import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Family } from './interfaces';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL } from '../apiConfig';

const Families: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newFamilyTitle, setNewFamilyTitle] = useState('');

  const getFamiliesEndpoint = `${API_BASE_URL}/api/Families`;

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Family[]>(getFamiliesEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFamilies(response.data);
      } catch (error: any) {
        console.error(
          'Failed to fetch families:',
          (error.response?.data as string) || error.message
        );
      }
    };

    if (isAuthenticated) {
      fetchFamilies();
    }
  }, [isAuthenticated]);

  const handleDetailsClick = (familyId: number) => {
    navigate(`/family/${familyId}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewFamilyTitle('');
  };

  const handleCreateFamily = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/Families`,
        { title: newFamilyTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdFamily = response.data;

      // Update the local state with the new family
      setFamilies((prevFamilies) => [...prevFamilies, createdFamily]);

      handleCloseModal();
    } catch (error: any) {
      console.error(
        'Failed to create family:',
        (error.response?.data as string) || error.message
      );
    }
  };

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
      {isAuthenticated ? (
        <>
        <Box style={{display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',}}>
        <Typography component="h1" variant="h5">Families</Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '16px' }}
            onClick={handleOpenModal}
          >
            Add Family
          </Button>
        </Box>
          
          <Grid container spacing={3}>
            {families.map((family) => (
              <Grid item xs={12} sm={6} md={4} key={family.id}>
                <Card style={{ marginBottom: '16px' }}>
                  <CardContent>
                    <Typography variant="h5">{family.title}</Typography>
                    <Typography color="textSecondary">
                      Members: {family.membersCount}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailsClick(family.id)}
                    >
                      Detailed info
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Add Family Modal */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Create New Family</DialogTitle>
            <DialogContent>
              <TextField
                label="Family Title"
                variant="outlined"
                fullWidth
                value={newFamilyTitle}
                onChange={(e) => setNewFamilyTitle(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button onClick={handleCreateFamily} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="h6">
          Please login to view families.
        </Typography>
      )}
      </Box>
    </Container>
  );
};

export default Families;

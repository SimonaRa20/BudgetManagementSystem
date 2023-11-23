import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Family } from '../interfaces';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import CreateFamilyModal from './CreateFamilyModal';
import DeleteFamilyModal from './DeleteFamilyModal';

const Families: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteFamilyId, setDeleteFamilyId] = useState<number | null>(null);

  const getFamiliesEndpoint = `${API_BASE_URL}/api/Families`;

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          const response = await axios.get<Family[]>(getFamiliesEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setFamilies(response.data);
        }
      } catch (error: any) {
        console.error('Failed to fetch families:', error.response?.data || error.message);
      }
    };

    fetchFamilies();
  }, [isAuthenticated, getFamiliesEndpoint]);

  const handleDetailsClick = (familyId: number) => {
    navigate(`/family/${familyId}`);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleCreateFamilySuccess = (createdFamily: Family) => {
    setFamilies((prevFamilies) => [...prevFamilies, createdFamily]);
  };

  const handleOpenDeleteDialog = (familyId: number) => {
    setDeleteFamilyId(familyId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteFamilyId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteFamily = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/Families/${deleteFamilyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFamilies((prevFamilies) =>
        prevFamilies.filter((family) => family.id !== deleteFamilyId)
      );

      setDeleteFamilyId(null);
    } catch (error: any) {
      console.error('Failed to delete family:', error.response?.data || error.message);
    }
  };

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
        {isAuthenticated ? (
          <>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                Families
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '16px' }}
                onClick={handleOpenCreateModal}
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Add Family
              </Button>
            </Box>

            <Grid container spacing={3}>
              {families.map((family) => (
                <Grid item xs={12} sm={6} md={4} key={family.id}>
                  <Card style={{ marginBottom: '16px' }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        {family.title}
                      </Typography>
                      <Typography color="textSecondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        Members: {family.membersCount}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDetailsClick(family.id)}
                          sx={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Detailed info
                        </Button>
                        {family.membersCount === 1 && (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenDeleteDialog(family.id)}
                            sx={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <CreateFamilyModal
              open={openCreateModal}
              onClose={handleCloseCreateModal}
              onSuccess={handleCreateFamilySuccess}
            />

            <DeleteFamilyModal
              open={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              onDelete={handleDeleteFamily}
            />
          </>
        ) : (
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Please login to view families.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Families;

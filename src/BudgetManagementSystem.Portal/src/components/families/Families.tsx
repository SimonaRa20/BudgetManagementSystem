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
import UpdateFamilyModal from './UpdateFamilyModal';

const Families: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteFamilyId, setDeleteFamilyId] = useState<number | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateFamilyId, setUpdateFamilyId] = useState<number | null>(null);

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

  const handleOpenUpdateModal = (familyId: number) => {
    setUpdateFamilyId(familyId);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateFamilyId(null);
    setOpenUpdateModal(false);
  };

  const handleUpdateFamily = async (updatedFamily: Family) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/Families/${updatedFamily.id}`,
        updatedFamily,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFamilies((prevFamilies) =>
        prevFamilies.map((family) =>
          family.id === updatedFamily.id ? { ...family, title: updatedFamily.title } : family
        )
      );
      setOpenUpdateModal(false);
    } catch (error: any) {
      console.error('Failed to update family:', error.response?.data || error.message);
    }
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
              <Typography component="h1" variant="h5">
                Families
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '16px' }}
                onClick={handleOpenCreateModal}
              >
                Add Family
              </Button>
            </Box>

            <Grid container spacing={3}>
              {families.map((family) => (
                <Grid item xs={12} sm={6} md={4} key={family.id}>
                  <Card style={{ marginBottom: '16px' }}>
                    <CardContent>
                      <Typography variant="h5">
                        {family.title}
                      </Typography>
                      <Typography color="textSecondary">
                        Members: {family.membersCount}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDetailsClick(family.id)}
                        >
                          Detailed info
                        </Button>
                        {family.membersCount === 1 && (
                          <>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => handleOpenUpdateModal(family.id)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(family.id)}
                            >
                              Delete
                            </Button>
                          </>

                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <UpdateFamilyModal
              open={openUpdateModal}
              onClose={handleCloseUpdateModal}
              onUpdate={handleUpdateFamily}
              familyId={updateFamilyId}
            />
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
          <Typography variant="h6">
            Please login to view families.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Families;

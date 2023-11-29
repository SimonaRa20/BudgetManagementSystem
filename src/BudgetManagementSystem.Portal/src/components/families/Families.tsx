import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Card, CardContent, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateFamilyModal from './CreateFamilyModal';
import DeleteFamilyModal from './DeleteFamilyModal';
import UpdateFamilyModal from './UpdateFamilyModal';
import { FamilyResponse } from '../models/family';
import { API_BASE_URL } from '../../apiConfig';

const Families: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [families, setFamilies] = useState<FamilyResponse[]>([]);
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
          const response = await axios.get<FamilyResponse[]>(getFamiliesEndpoint, {
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

  const handleCreateFamilySuccess = (createdFamily: FamilyResponse) => {
    const family: FamilyResponse = {
      id: createdFamily.id,
      title: createdFamily.title,
      membersCount: createdFamily.membersCount,
    };
  
    setFamilies((prevFamilies) => [...prevFamilies, family]);
  };

  const handleOpenUpdateModal = (familyId: number) => {
    setUpdateFamilyId(familyId);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateFamilyId(null);
    setOpenUpdateModal(false);
  };

  const handleOpenDeleteDialog = (familyId: number) => {
    setDeleteFamilyId(familyId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteFamilyId(null);
    setOpenDeleteDialog(false);
  };

  const handleUpdateSuccess = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<FamilyResponse[]>(getFamiliesEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setFamilies(response.data);
    } catch (error: any) {
      console.error('Failed to fetch families:', error.response?.data || error.message);
    }
  };

  const expectedRole = 'Owner';

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
        {isAuthenticated && userRole === expectedRole ? (
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
                              color="primary"
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
              familyId={updateFamilyId}
              onUpdateSuccess={handleUpdateSuccess}
            />
            <CreateFamilyModal
              open={openCreateModal}
              onClose={handleCloseCreateModal}
              onSuccess={handleCreateFamilySuccess}
            />

            <DeleteFamilyModal
              open={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              familyId={deleteFamilyId}
            />
          </>
        ) : (
          <Typography variant="h6">
            {isAuthenticated
              ? "You don't have permissions."
              : 'Please login to view families.'}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Families;

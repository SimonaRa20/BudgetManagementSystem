import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MemberDetailsModal from './MemberDetailsModal';
import DeleteMemberModal from './DeleteMemberModal';
import { FamilyMemberResponse } from '../models/family-member';
import { FamilyByIdResponse } from '../models/family';
import { API_BASE_URL } from '../../apiConfig';
import { useAuth } from './../context/AuthContext';
import UpdateMemberTypeModal from './UpdateMemberTypeModal';
import AddMemberModal from './AddMemberModal';

interface FamilyDetailsProps {
}

const FamilyDetails: React.FC<FamilyDetailsProps> = ({ }) => {
  const { familyId } = useParams();
  const [family, setFamily] = useState<FamilyByIdResponse | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberResponse | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  const getFamilyEndpoint = `${API_BASE_URL}/api/Families/${familyId}`;

  const fetchFamilyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<FamilyByIdResponse>(getFamilyEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFamily(response.data);
    } catch (error: any) {
      console.error(
        'Failed to fetch family details:',
        (error.response?.data as string) || error.message
      );
    }
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, [familyId, getFamilyEndpoint]);

  const handleOpenMemberModal = (member: FamilyMemberResponse) => {
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };

  const handleCloseMemberModal = () => {
    setSelectedMember(null);
    setIsMemberModalOpen(false);
  };

  const handleOpenUpdateModal = (member: FamilyMemberResponse) => {
    setSelectedMember(member);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedMember(null);
    setIsUpdateModalOpen(false);
  };

  const handleOpenAddMemberModal = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };

  const handleOpenDeleteModal = (member: FamilyMemberResponse) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedMember(null);
    setIsDeleteModalOpen(false);
  };

  const onDeleteMember = async () => {
    try {
      setFamily((prevFamily: FamilyByIdResponse | null) => {
        if (!prevFamily) {
          return prevFamily;
        }

        const filteredMembers = prevFamily.members?.filter(
          (member) => member.familyMemberId !== selectedMember?.familyMemberId
        );

        return {
          ...prevFamily,
          members: filteredMembers,
        };
      });

      // Navigation logic
      if (family && family.members.length === 1) {
        navigate('/families');
      } else {
        navigate(`/family/${family?.id}`);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const expectedRole = 'Owner';

  if (!isAuthenticated) {
    return (
      <Container>
        <Box style={{ marginTop: '2rem' }}>
          <Typography variant="h6">Please login to view family details.</Typography>
        </Box>
      </Container>
    );
  }

  if (!family) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Box style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h1" variant="h5">
          {family.title}
        </Typography>
        {userRole === expectedRole && (
          <Button variant="contained" color="primary" onClick={handleOpenAddMemberModal}>
            Add New Member
          </Button>
        )}
      </Box>
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h6">Members:</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name & Surname</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {family.members.map((member: FamilyMemberResponse) => (
                  <TableRow key={member.familyMemberId}>
                    <TableCell>{`${member.name} ${member.surname}`}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent={'flex-end'} gap={1} marginLeft="auto">
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => navigate(`/family/${familyId}/member/${member.familyMemberId}/expenses`)}
                        >
                          Check expenses
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => navigate(`/family/${familyId}/member/${member.familyMemberId}/incomes`)}
                        >
                          Check incomes
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenMemberModal(member)}
                        >
                          View Details
                        </Button>
                        {userRole === expectedRole && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenUpdateModal(member)}
                            >
                              Update Type
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenDeleteModal(member)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={handleCloseAddMemberModal}
        familyId={familyId ? parseInt(familyId, 10) : 0}
        onMemberAdded={fetchFamilyDetails}
      />
      <MemberDetailsModal
        member={selectedMember}
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
      />
      <UpdateMemberTypeModal
        member={selectedMember}
        isOpen={isUpdateModalOpen}
        onUpdate={fetchFamilyDetails}
        onClose={handleCloseUpdateModal}
      />
      <DeleteMemberModal
        member={selectedMember}
        isOpen={isDeleteModalOpen}
        onDelete={onDeleteMember}
        onClose={handleCloseDeleteModal}
      />
    </Container>
  );
};

export default FamilyDetails;

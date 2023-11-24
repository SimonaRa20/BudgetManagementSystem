// FamilyDetails.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import MemberDetailsModal from './MemberDetailsModal';
import DeleteMemberModal from './DeleteMemberModal';
import { FamilyMemberResponse } from '../models/family-member';
import { FamilyByIdResponse } from '../models/family';
import { API_BASE_URL } from '../../apiConfig';
import { Container } from '@mui/system';
import { useAuth } from './../context/AuthContext';

const FamilyDetails: React.FC = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState<FamilyByIdResponse | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberResponse | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Get the history object

  const getFamilyEndpoint = `${API_BASE_URL}/api/Families/${familyId}`;

  useEffect(() => {
    const fetchFamilyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<FamilyByIdResponse>(getFamilyEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setFamily(response.data);
      } catch (error: any) {
        console.error(
          'Failed to fetch family details:',
          (error.response?.data as string) || error.message
        );
      }
    };

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

  const handleOpenDeleteModal = (member: FamilyMemberResponse) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedMember(null);
    setIsDeleteModalOpen(false);
  };

  const onDeleteMember = () => {
    // Check if the family has no members left
    if (family && family.members.length === 1) {
      // Redirect to the families page
      navigate('/families');
    }
  };

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
      <Box style={{ marginTop: '2rem' }}>
        <Typography component="h1" variant="h5">
          {family.title}
        </Typography>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6">Members:</Typography>
            {family.members.map((member: FamilyMemberResponse) => (
              <Box key={member.familyMemberId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{`${member.name} ${member.surname}`}</Typography>
                <Box style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="contained" color="secondary" onClick={() => handleOpenMemberModal(member)}>
                    View Details
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleOpenDeleteModal(member)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      <MemberDetailsModal
        member={selectedMember}
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
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

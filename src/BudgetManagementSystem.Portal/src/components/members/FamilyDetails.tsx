// FamilyDetails.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';
import MemberDetailsModal from './MemberDetailsModal';
import DeleteMemberModal from './DeleteMemberModal';
import { FamilyMemberResponse } from '../models/family-member';
import { FamilyByIdResponse } from '../models/family';
import { API_BASE_URL } from '../../apiConfig';
import { useAuth } from './../context/AuthContext';
import UpdateMemberTypeModal from './UpdateMemberTypeModal';
import AddMemberModal from './AddMemberModal';

interface FamilyDetailsProps {
  // Add any additional props here
}

const FamilyDetails: React.FC<FamilyDetailsProps> = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState<FamilyByIdResponse | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberResponse | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
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
      console.log(response.data);
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

  const handleAddMember = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/Families/${familyId}/FamilyMembers`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Update the member list locally
      fetchFamilyDetails();
      // Close the modal
      handleCloseAddMemberModal();
    } catch (error: any) {
      console.error('Failed to add a new member to the family:', error.message);
    }
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
    if (family && family.members.length === 1) {
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
        <Button variant="contained" color="primary" onClick={handleOpenAddMemberModal}>
          Add New Member
        </Button>
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenUpdateModal(member)}
                  >
                    Update Type
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

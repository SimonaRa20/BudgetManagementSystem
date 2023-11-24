import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Modal, Button } from '@mui/material';
import { FamilyMemberResponse } from './models/family-member';
import { FamilyByIdResponse } from './models/family';
import { getMemberTypeText } from './models/constants';
import { API_BASE_URL } from '../apiConfig';
import { Container } from '@mui/system';
import { useAuth } from './context/AuthContext';

interface MemberModalProps {
  member: FamilyMemberResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, isOpen, onClose }) => {
  if (!member) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6">{`${member.name} ${member.surname}`}</Typography>
        <Typography>{`Username: ${member.userName}`}</Typography>
        <Typography>{`Email: ${member.email}`}</Typography>
        <Typography>{`Type: ${getMemberTypeText(member.type)}`}</Typography>
        <Button onClick={onClose} sx={{ marginTop: '1rem' }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const FamilyDetails: React.FC = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState<FamilyByIdResponse | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberResponse | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

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
        console.log(response.data)
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

  if (!isAuthenticated) {
    return (
      <Container>
        <Box style={{ marginTop: '2rem' }}>
          <Typography variant="h6">
            Please login to view family details.
          </Typography>
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
            {family.members.map((member:FamilyMemberResponse) => (
              <Box key={member.familyMemberId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>
                  {`${member.name} ${member.surname}`}
                </Typography>
                <Button
                  onClick={() => handleOpenMemberModal(member)}
                >
                  View Details
                </Button>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      <MemberModal
        member={selectedMember}
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
      />
    </Container>
  );
};

export default FamilyDetails;

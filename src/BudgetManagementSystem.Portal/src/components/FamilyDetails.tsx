import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Modal,
  Button,
} from '@mui/material';
import { Family, FamilyMember } from './interfaces';
import { API_BASE_URL } from '../apiConfig';
import { Container } from '@mui/system';
import { useAuth } from './context/AuthContext';

interface MemberModalProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, isOpen, onClose }) => {
  if (!member) {
    return null; // Return null if member is not available
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6">{`${member.name} ${member.surname}`}</Typography>
        <Typography>{`Username: ${member.userName}`}</Typography>
        <Typography>{`Email: ${member.email}`}</Typography>
        <Button onClick={onClose} sx={{ marginTop: '1rem' }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const FamilyDetails: React.FC = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState<Family | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const getFamilyEndpoint = `${API_BASE_URL}/api/Families/${familyId}`;

  useEffect(() => {
    const fetchFamilyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Family>(getFamilyEndpoint, {
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

    fetchFamilyDetails();
  }, [familyId, getFamilyEndpoint]);

  const handleOpenMemberModal = (member: FamilyMember) => {
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
        <Typography component="h1" variant="h5" sx={{ fontFamily: "'Poppins', sans-serif" }}>
          {family.title}
        </Typography>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>Members:</Typography>
            {family.members.map((member) => (
              <div key={member.familyMemberId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  {`${member.name} ${member.surname}`}
                </Typography>
                <Button
                  onClick={() => handleOpenMemberModal(member)}
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View Details
                </Button>
              </div>
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

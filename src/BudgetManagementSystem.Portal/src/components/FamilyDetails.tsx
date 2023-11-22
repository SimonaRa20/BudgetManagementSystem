import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Family } from './interfaces';
import { API_BASE_URL } from '../apiConfig';
import { Container } from '@mui/system';
import { useAuth } from './context/AuthContext';

const FamilyDetails: React.FC = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState<Family | null>(null);
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
        <Typography component="h1" variant="h5" sx={{fontFamily: "'Poppins', sans-serif"}}>
          {family.title}
        </Typography>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6" sx={{fontFamily: "'Poppins', sans-serif"}}>Members:</Typography>
            {family.members.map((member) => (
              <div key={member.familyMemberId}>
                <Typography sx={{fontFamily: "'Poppins', sans-serif"}}>{`Name: ${member.name} ${member.surname}`}</Typography>
                <Typography sx={{fontFamily: "'Poppins', sans-serif"}}>{`Username: ${member.userName}`}</Typography>
                <Typography sx={{fontFamily: "'Poppins', sans-serif"}}>{`Email: ${member.email}`}</Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default FamilyDetails;

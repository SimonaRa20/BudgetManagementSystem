import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Family } from './interfaces';
import { API_BASE_URL } from '../apiConfig';
import { Container } from '@mui/system';

const FamilyDetails: React.FC = () => {
    const { familyId } = useParams();
    const [family, setFamily] = useState<Family | null>(null);

    console.log(familyId)
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

        console.log(response)

          setFamily(response.data);
        } catch (error: any) {
          console.error(
            'Failed to fetch family details:',
            (error.response?.data as string) || error.message
          );
        }
      };
  
      fetchFamilyDetails();
    }, [familyId]);

  if (!family) {
    return <div>Loading...</div>; // You can show a loading indicator while fetching data
  }

  return (
    <Container>
    <Box style={{ marginTop: '2rem' }}>
      <Typography component="h1" variant="h5">{family.title}</Typography>
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h6">Members:</Typography>
          {family.members.map((member) => (
            <div key={member.familyMemberId}>
              <Typography>{`Name: ${member.name} ${member.surname}`}</Typography>
              <Typography>{`Username: ${member.userName}`}</Typography>
              <Typography>{`Email: ${member.email}`}</Typography>
            </div>
          ))}
        </CardContent>
      </Card>
    </Box>
    </Container>
  );
};

export default FamilyDetails;

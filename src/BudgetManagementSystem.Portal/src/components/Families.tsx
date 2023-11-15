// src/components/Families.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import { Family } from './interfaces';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL } from '../apiConfig';

const Families: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const getFamiliesEndpoint = `${API_BASE_URL}/api/Families`;
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await axios.get<Family[]>(getFamiliesEndpoint, {
          // Add headers with authentication token if needed
        });

        setFamilies(response.data);
      } catch (error:any) {
        console.error('Failed to fetch families:', (error.response?.data as string) || error.message);
      }
    };

    if (isAuthenticated) {
      fetchFamilies();
    }
  }, [isAuthenticated]);

  return (
    <Container>
      {isAuthenticated ? (
        <>
          <Typography variant="h2">Families</Typography>
          <List>
            {families.map((family) => (
              <ListItem key={family.id}>
                <ListItemText primary={`${family.title} - Members: ${family.membersCount}`} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography variant="h6">Please login to view families.</Typography>
      )}
    </Container>
  );
};

export default Families;

import React, { useState } from 'react';
import { Box, Button, TextField, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserRegisterRequest } from '../models/auth'; 
import { API_BASE_URL } from '../../apiConfig';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const registerEndpoint = `${API_BASE_URL}/api/Auth/Register`;

  const handleRegister = async () => {
    try {
      await axios.post<UserRegisterRequest>(registerEndpoint, {
        name,
        surname,
        username,
        email,
        password,
      });

      navigate('/login');
    } catch (error: any) {
      setError((error.response?.data as string) || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box 
        style={{ marginTop: '2rem' }}
        sx={{
          textAlign: 'center',
          '@media (max-width: 768px)': {
            textAlign: 'left',
          },
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontFamily: "'Poppins', sans-serif" }}>
          Register
        </Typography>
        <form>
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="surname"
            label="Surname"
            name="surname"
            autoComplete="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleRegister}
            sx={{ fontFamily: "'Poppins', sans-serif", transition: 'background-color 0.3s ease-in-out' }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

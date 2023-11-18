import React, { useState } from 'react';
import { Box,Button, TextField, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from './interfaces';
import { API_BASE_URL } from '../apiConfig';

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
      const response = await axios.post<User>(registerEndpoint, {
        name,
        surname,
        username,
        email,
        password,
      });

      console.log(response.data);
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', (error.response?.data as string) || error.message);
      setError((error.response?.data as string) || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box style={{ marginTop: '2rem' }}>
        <Typography component="h1" variant="h5">
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
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleRegister}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

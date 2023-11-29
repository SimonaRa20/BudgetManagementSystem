import React, { useState } from 'react';
import { Box, Button, TextField, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import { UserLoginRequest, UserLoginResponse } from '../models/auth';
import { UserRole } from '../models/constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const loginEndpoint = `${API_BASE_URL}/api/Auth/Login`;

  const handleLogin = async () => {
    try {
      const loginRequest: UserLoginRequest = {
        email,
        password,
      };

      const response = await axios.post<UserLoginResponse>(loginEndpoint, loginRequest);

      const { id, username, role, token, refreshtoken } = response.data;

      localStorage.setItem('userId', id.toString());
      localStorage.setItem('userName', username);
      localStorage.setItem('userRole', role);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshtoken', refreshtoken);

      const userRole: UserRole = role as UserRole;
      login(userRole);
      if (userRole === 'Owner') {
        navigate('/families');
      } else if (userRole === 'Admin') {
        navigate('/users');
      } else {
        // Handle other roles as needed
      }
      
    } catch (error: any) {
      setError((error.response?.data as string) || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box style={{ marginTop: '2rem' }}>
        <Typography component="h1" variant="h5" sx={{ fontFamily: "'Poppins', sans-serif" }}>
          Login
        </Typography>
        {error && (
          <Typography color="error" sx={{ marginTop: '0.5rem', fontFamily: "'Poppins', sans-serif" }}>
            {error}
          </Typography>
        )}
        <form>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;

import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from './interfaces';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL } from '../apiConfig';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const loginEndpoint = `${API_BASE_URL}/api/Auth/Login`;

  const handleLogin = async () => {
    try {
      const response = await axios.post<User>(loginEndpoint, {
        email,
        password,
      });

      const { id, userName, userRole, userToken, refreshToken } = response.data;

      localStorage.setItem('userId', id.toString());
      localStorage.setItem('userName', userName);
      localStorage.setItem('role', userRole);
      localStorage.setItem('token', userToken);
      localStorage.setItem('refreshtoken', refreshToken);

      login();
      navigate('/families');
      
    } catch (error: any) {
      console.error('Login failed:', (error.response?.data as string) || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
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
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;

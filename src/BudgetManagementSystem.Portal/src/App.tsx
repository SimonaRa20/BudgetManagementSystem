import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Families from './components/families/Families';
import FamilyDetails from './components/members/FamilyDetails';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Home from './Home';
import MemberBudget from './components/budget/MemberBudget';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/families" element={<Families />} />
              <Route path="/family/:familyId" element={<FamilyDetails />} />
              <Route path="/family/:familyId/member/:memberId" element={<MemberBudget />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Families from './components/Families';
import FamilyDetails from './components/FamilyDetails';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/families" element={<Families />} />
            <Route path="/family/:familyId" element={<FamilyDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

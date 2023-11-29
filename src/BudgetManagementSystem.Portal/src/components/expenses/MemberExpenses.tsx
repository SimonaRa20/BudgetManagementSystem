// MemberExpenses.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Container, Button } from '@mui/material';
import { ExpenseResponse } from '../models/expense';
import { API_BASE_URL } from '../../apiConfig';
import ExpenseDetailsModal from './ExpenseDetailsModal';

interface MemberExpensesProps {
  // Add any additional props if needed
}

const MemberExpenses: React.FC<MemberExpensesProps> = () => {
  const { familyId, memberId } = useParams();
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getExpensesEndpoint = `${API_BASE_URL}/api/Families/${familyId}/Members/${memberId}/Expenses`;

  const fetchMemberExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ExpenseResponse[]>(getExpensesEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(response.data);
    } catch (error: any) {
      console.error('Failed to fetch member expenses:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMemberExpenses();
  }, [familyId, memberId, getExpensesEndpoint]);

  const handleViewDetails = (expense: ExpenseResponse) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
        <Box>
        <Typography component="h1" variant="h5">
          Member Expenses
        </Typography>

        </Box>
        
        
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6">Expenses:</Typography>
            {expenses.map((expense: ExpenseResponse) => (
              <Box
                key={expense.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {/* Display expense details here */}
                <Typography>{`${expense.title} - ${expense.amount}`}</Typography>
                {/* Add other expense details as needed */}
                <Button onClick={() => handleViewDetails(expense)}>View Details</Button>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
      <ExpenseDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        expense={selectedExpense}
      />
    </Container>
  );
};

export default MemberExpenses;

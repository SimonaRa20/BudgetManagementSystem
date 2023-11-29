import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Card, Box, CardContent, Button, Typography } from '@mui/material';
import { ExpenseResponse } from '../models/expense';
import { API_BASE_URL } from '../../apiConfig';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import { getCategoryTitle } from '../models/constants';

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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense: ExpenseResponse) => (
                    <TableRow key={expense.id}>
                      <TableCell align="center">{expense.title}</TableCell>
                      <TableCell align="center">{expense.amount}</TableCell>
                      <TableCell align="center">{getCategoryTitle(expense.category)}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleViewDetails(expense)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Card, Box, CardContent, Button, Typography } from '@mui/material';
import { ExpenseResponse } from '../../models/expense';
import { API_BASE_URL } from '../../../apiConfig';
import ExpenseDetailsModal from './../expenses/ExpenseDetailsModal';
import ExpenseDeleteModal from './../expenses/ExpenseDeleteModal';
import { getExpensesCategoryTitle } from '../../models/constants';
import CreateExpenseModal from './../expenses/CreateExpenseModal';
import UpdateExpenseModal from './../expenses/UpdateExpenseModal';

interface MemberExpensesProps { }

const MemberExpenses: React.FC<MemberExpensesProps> = () => {
  const { familyId, memberId } = useParams();
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseResponse | null>(null);
  const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const getExpensesEndpoint = `${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/${memberId}/Expenses`;

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
    // eslint-disable-next-line
  }, [familyId, memberId, getExpensesEndpoint]);

  const handleViewDetails = (expense: ExpenseResponse) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (expense: ExpenseResponse) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setExpenseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleOpenCreateExpenseModal = () => {
    setIsCreateExpenseModalOpen(true);
  };

  const handleCloseCreateExpenseModal = () => {
    setIsCreateExpenseModalOpen(false);
  };

  const handleExpenseCreated = () => {
    fetchMemberExpenses();
  };

  const handleOpenUpdateExpenseModal = (expense: ExpenseResponse) => {
    setSelectedExpense(expense);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateExpenseModal = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
        <Box style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography component="h1" variant="h5">
              Member Expenses
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary" onClick={handleOpenCreateExpenseModal}>
              Create New Expense
            </Button>
          </Box>
        </Box>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6">Expenses:</Typography>
            {expenses.length > 0 ? (
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
                        <TableCell align="center">{getExpensesCategoryTitle(expense.category)}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleViewDetails(expense)}
                            >
                              View Details
                            </Button>
                            <Box marginLeft={1}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenUpdateExpenseModal(expense)}
                            >
                              Update
                            </Button>
                            </Box>
                            <Box marginLeft={1}>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(expense)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1">No expenses available.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      <CreateExpenseModal
        isOpen={isCreateExpenseModalOpen}
        onClose={handleCloseCreateExpenseModal}
        onExpenseCreated={handleExpenseCreated}
        familyId={familyId || ''}
        memberId={memberId || ''}
      />
      <ExpenseDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        expense={selectedExpense} />
      <ExpenseDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        expenseId={expenseToDelete?.id || 0}
        expenseTitle={expenseToDelete?.title || ''}
        familyId={familyId ? parseInt(familyId, 10) : 0}
        memberId={memberId ? parseInt(memberId, 10) : 0}
        onDeleteSuccess={fetchMemberExpenses}
      />
      <UpdateExpenseModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateExpenseModal}
        onUpdateSuccess={fetchMemberExpenses}
        expenseId={selectedExpense?.id || 0}
        familyId={familyId || ''}
        memberId={memberId || ''}
      />
    </Container>
  );
};

export default MemberExpenses;

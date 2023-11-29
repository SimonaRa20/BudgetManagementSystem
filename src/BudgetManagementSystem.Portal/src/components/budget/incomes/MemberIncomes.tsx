import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Card, Box, CardContent, Button, Typography } from '@mui/material';
import { IncomeResponse } from '../../models/income';
import { API_BASE_URL } from '../../../apiConfig';
import IncomeDetailsModal from './../incomes/IncomeDetailsModal';
import IncomeDeleteModal from './IncomeDeleteModal';
import { getIncomesCategoryTitle } from '../../models/constants';
import UpdateIncomeModal from './../incomes/UpdateIncomeModal';
import CreateIncomeModal from './CreateIncomeModal';

interface MemberIncomesProps { }

const MemberIncomes: React.FC<MemberIncomesProps> = () => {
  const { familyId, memberId } = useParams();
  const [incomes, setIncomes] = useState<IncomeResponse[]>([]);
  const [selectedIncome, setSelectedIncome] = useState<IncomeResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<IncomeResponse | null>(null);
  const [isCreateIncomeModalOpen, setIsCreateIncomeModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const getIncomesEndpoint = `${API_BASE_URL}/api/Families/${familyId}/Members/${memberId}/Incomes`;

  const fetchMemberIncomes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<IncomeResponse[]>(getIncomesEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncomes(response.data);
    } catch (error: any) {
      console.error('Failed to fetch member expenses:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMemberIncomes();
  }, [familyId, memberId, getIncomesEndpoint]);

  const handleViewDetails = (income: IncomeResponse) => {
    setSelectedIncome(income);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (income: IncomeResponse) => {
    setIncomeToDelete(income);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIncomeToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleOpenCreateIncomeModal = () => {
    setIsCreateIncomeModalOpen(true);
  };

  const handleCloseCreateIncomeModal = () => {
    setIsCreateIncomeModalOpen(false);
  };

  const handleIncomeCreated = () => {
    fetchMemberIncomes();
  };

  const handleOpenUpdateIncomeModal = (income: IncomeResponse) => {
    setSelectedIncome(income);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateIncomeModal = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <Container>
      <Box style={{ marginTop: '2rem' }}>
        <Box style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography component="h1" variant="h5">
              Member Incomes
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary" onClick={handleOpenCreateIncomeModal}>
              Create New Income
            </Button>
          </Box>
        </Box>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6">Incomes:</Typography>
            {incomes.length > 0 ? (
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
                    {incomes.map((income: IncomeResponse) => (
                      <TableRow key={income.id}>
                        <TableCell align="center">{income.title}</TableCell>
                        <TableCell align="center">{income.amount}</TableCell>
                        <TableCell align="center">{getIncomesCategoryTitle(income.category)}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleViewDetails(income)}
                            >
                              View Details
                            </Button>
                            <Box marginLeft={1}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenUpdateIncomeModal(income)}
                            >
                              Update
                            </Button>
                            </Box>
                            <Box marginLeft={1}>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(income)}
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
      <CreateIncomeModal
        isOpen={isCreateIncomeModalOpen}
        onClose={handleCloseCreateIncomeModal}
        onIncomeCreated={handleIncomeCreated}
        familyId={familyId || ''}
        memberId={memberId || ''}
      />
      <IncomeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        income={selectedIncome} />
      <IncomeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        incomeId={incomeToDelete?.id || 0}
        incomeTitle={incomeToDelete?.title || ''}
        familyId={familyId ? parseInt(familyId, 10) : 0}
        memberId={memberId ? parseInt(memberId, 10) : 0}
        onDeleteSuccess={fetchMemberIncomes}
      />
      <UpdateIncomeModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateIncomeModal}
        onUpdateSuccess={fetchMemberIncomes}
        incomeId={selectedIncome?.id || 0}
        familyId={familyId || ''}
        memberId={memberId || ''}
      />
    </Container>
  );
};

export default MemberIncomes;

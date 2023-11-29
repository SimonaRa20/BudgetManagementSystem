// ExpenseDetailsModal.tsx
import React from 'react';
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ExpenseResponse } from '../models/expense';
import { getCategoryTitle } from '../models/constants';

interface ExpenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseResponse | null;
}

const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({ isOpen, onClose, expense }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, // Adjust the width as needed
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" id="modal-modal-title">
          Expense Details
        </Typography>
        {expense && (
          <TableContainer component={Paper} sx={{ marginTop: '2rem'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{getCategoryTitle(expense.category)}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{new Date(expense.time).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExpenseDetailsModal;

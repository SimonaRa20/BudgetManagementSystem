import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { ExpenseResponse } from '../../models/expense';
import { getExpensesCategoryTitle } from '../../models/constants';

interface ExpenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseResponse | null;
}

const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({ isOpen, onClose, expense }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Expense Details</DialogTitle>
      <DialogContent>
        {expense && (
          <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
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
                  <TableCell>{getExpensesCategoryTitle(expense.category)}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{new Date(expense.time).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={onClose} sx={{marginRight: '0.5rem', marginBottom: '0.5rem'}}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseDetailsModal;

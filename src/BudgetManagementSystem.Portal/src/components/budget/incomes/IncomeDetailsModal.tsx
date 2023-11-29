import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead,  TableRow, Paper, Box } from '@mui/material';
import { IncomeResponse } from '../../models/income';
import { getIncomesCategoryTitle } from '../../models/constants';

interface IncomeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  income: IncomeResponse | null;
}

const IncomeDetailsModal: React.FC<IncomeDetailsModalProps> = ({ isOpen, onClose, income }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Income Details</DialogTitle>
      <DialogContent>
        {income && (
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
                  <TableCell>{income.title}</TableCell>
                  <TableCell>{getIncomesCategoryTitle(income.category)}</TableCell>
                  <TableCell>{income.amount}</TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell>{new Date(income.time).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
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

export default IncomeDetailsModal;

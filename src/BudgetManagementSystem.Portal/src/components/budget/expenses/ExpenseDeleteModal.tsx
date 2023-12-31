import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../../../apiConfig';

interface ExpenseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: number;
  expenseTitle: string;
  familyId: number;
  memberId: number;
  onDeleteSuccess: () => void;
}

const ExpenseDeleteModal: React.FC<ExpenseDeleteModalProps> = ({
  isOpen,
  onClose,
  expenseId,
  expenseTitle,
  familyId,
  memberId,
  onDeleteSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/${memberId}/Expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleteSuccess();
    } catch (error: any) {
      console.error('Failed to delete expense:', error.response?.data || error.message);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Expense</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{`Are you sure you want to delete the expense "${expenseTitle}"?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleConfirmDelete();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseDeleteModal;

import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { API_BASE_URL } from '../../apiConfig';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  onDeleteSuccess: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ open, onClose, userId, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!userId) {
      return;
    }

    try {
      setIsDeleting(true);

      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/Users?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onDeleteSuccess();
    } catch (error: any) {
      console.error('Failed to delete user:', error.response?.data || error.message);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="primary" autoFocus disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;

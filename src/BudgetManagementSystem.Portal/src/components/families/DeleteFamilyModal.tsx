import React from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { API_BASE_URL } from '../../apiConfig';

interface DeleteFamilyModalProps {
  open: boolean;
  onClose: () => void;
  familyId: number | null;
}

const DeleteFamilyModal: React.FC<DeleteFamilyModalProps> = ({ open, onClose, familyId }) => {
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/Families/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onClose();
    } catch (error: any) {
      console.error('Failed to delete family:', error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this family? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button  variant="contained"
            color="error" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFamilyModal;

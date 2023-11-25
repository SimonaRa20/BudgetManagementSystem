import React from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FamilyMemberResponse } from '../models/family-member';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';

interface DeleteMemberModalProps {
  member: FamilyMemberResponse | null;
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ member, isOpen, onDelete, onClose }) => {
  if (!member) {
    return null;
  }

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (member) {
        await axios.delete(`${API_BASE_URL}/api/Families/${member.familyId}/FamilyMembers/${member.familyMemberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onDelete();
      }
    } catch (error: any) {
      console.error('Failed to delete member:', error.response?.data || error.message);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
     <DialogTitle>Delete Member</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{`Are you sure you want to delete ${member.name} ${member.surname}?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMemberModal;

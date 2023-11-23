import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { API_BASE_URL } from '../../apiConfig';

interface UpdateFamilyModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedFamily: any) => void;
  familyId: number | null;
}

const UpdateFamilyModal: React.FC<UpdateFamilyModalProps> = ({ open, onClose, onUpdate, familyId }) => {
  const [updatedFamilyTitle, setUpdatedFamilyTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  useEffect(() => {
    const fetchFamilyTitle = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/Families/${familyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpdatedFamilyTitle(response.data.title);
      } catch (error: any) {
        console.error('Failed to fetch family title:', error.response?.data || error.message);
      }
    };

    if (open && familyId) {
      fetchFamilyTitle();
    }
  }, [open, familyId]);

  const handleUpdateFamily = async () => {
    try {
      if (!updatedFamilyTitle.trim()) {
        setErrorMessage('Family title cannot be empty.');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/Families/${familyId}`,
        { title: updatedFamilyTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      const errorResponse = error.response?.data as string;
      const errorMessage = errorResponse || error.message;
      setErrorMessage(errorMessage);
    }
  };

  const handleClose = () => {
    setUpdatedFamilyTitle('');
    setErrorMessage('');
    setIsSubmitAttempted(false);
    onClose();
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedFamilyTitle(e.target.value);
    if (isSubmitAttempted) {
      setErrorMessage(e.target.value.trim() ? '' : 'Family title cannot be empty.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Family Title</DialogTitle>
      <DialogContent>
        <TextField
          label="Updated Family Title"
          variant="outlined"
          fullWidth
          value={updatedFamilyTitle}
          onChange={handleTextFieldChange}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            setIsSubmitAttempted(true);
            handleUpdateFamily();
          }}
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFamilyModal;

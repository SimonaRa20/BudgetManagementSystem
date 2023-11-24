import React, { useState } from 'react';
import axios from 'axios';
import { Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { API_BASE_URL } from '../../apiConfig';
import { FamilyResponse } from '../models/family';

interface CreateFamilyModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (createdFamily: FamilyResponse) => void;
}

const CreateFamilyModal: React.FC<CreateFamilyModalProps> = ({ open, onClose, onSuccess }) => {
    const [newFamilyTitle, setNewFamilyTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

    const handleCreateFamily = async () => {
        try {
            if (!newFamilyTitle.trim()) {
                setErrorMessage('Family title cannot be empty.');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await axios.post<FamilyResponse>(
                `${API_BASE_URL}/api/Families`,
                { title: newFamilyTitle },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

            const createdFamily = response.data;
            onSuccess(createdFamily);
            onClose();
        } catch (error: any) {
            const errorResponse = error.response?.data as string;
            const errorMessage = errorResponse || error.message;
            setErrorMessage(errorMessage);
        }
    };

    const handleClose = () => {
        setNewFamilyTitle('');
        setErrorMessage('');
        setIsSubmitAttempted(false);
        onClose();
    };

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFamilyTitle(e.target.value);
        if (isSubmitAttempted) {
            setErrorMessage(e.target.value.trim() ? '' : 'Family title cannot be empty.');
        }
    };

    return (
        <Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Family</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Family Title"
                        variant="outlined"
                        fullWidth
                        value={newFamilyTitle}
                        onChange={handleTextFieldChange}
                        error={!!errorMessage}
                        helperText={errorMessage}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        setIsSubmitAttempted(true);
                        handleCreateFamily();
                    }} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateFamilyModal;

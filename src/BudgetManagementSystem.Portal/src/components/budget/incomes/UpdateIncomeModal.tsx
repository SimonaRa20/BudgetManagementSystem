import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { IncomeCategories, getIncomesCategoryTitle } from '../../models/constants';
import { API_BASE_URL } from '../../../apiConfig';
import axios from 'axios';

interface UpdateIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
  incomeId: number;
  familyId: string;
  memberId: string;
}

// This component is similar to CreateExpenseModal with modifications for updating an existing expense
const UpdateIncomeModal: React.FC<UpdateIncomeModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  incomeId: incomeId,
  familyId,
  memberId,
}) => {
  const [updatedIncome, setUpdatedIncome] = useState({
    title: '',
    category: IncomeCategories.Salary,
    amount: 0,
    description: '',
    time: new Date(),
  });

  // Fetch the existing expense details when the modal is opened
  React.useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/Families/${familyId}/Members/${memberId}/Incomes/${incomeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const incomeDetails = response.data;
        setUpdatedIncome({
          title: incomeDetails.title,
          category: incomeDetails.category,
          amount: incomeDetails.amount,
          description: incomeDetails.description,
          time: new Date(incomeDetails.time),
        });
      } catch (error:any) {
        console.error('Failed to fetch income details:', error.response?.data || error.message);
      }
    };

    if (isOpen && incomeId) {
      fetchExpenseDetails();
    }
  }, [isOpen, incomeId, familyId, memberId]);

  const handleUpdateFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdatedIncome((prevIncome) => ({
      ...prevIncome,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const selectedCategory = event.target.value as IncomeCategories;
    setUpdatedIncome((prevIncome) => ({
      ...prevIncome,
      category: selectedCategory,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    setUpdatedIncome((prevIncome) => ({
      ...prevIncome,
      time: date,
    }));
  };

  const handleUpdateExpense = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/Families/${familyId}/Members/${memberId}/Incomes/${incomeId}`,
        updatedIncome,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateSuccess(); // Trigger the callback
    } catch (error:any) {
      console.error(
        'Failed to update income:',
        error.response?.data || error.message
      );
    } finally {
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Update Income</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={updatedIncome.title}
          onChange={handleUpdateFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Category"
          name="category"
          value={updatedIncome.category}
          onChange={handleCategoryChange}
          fullWidth
          margin="normal"
        >
          {Object.values(IncomeCategories).map((category) => (
            <MenuItem key={category} value={category}>
              {getIncomesCategoryTitle(category as IncomeCategories)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={updatedIncome.amount}
          onChange={handleUpdateFormChange}
          fullWidth
          margin="normal"
          inputProps={{
            step: '0.01',
          }}
        />
        <TextField
          label="Date"
          name="time"
          type="date"
          value={updatedIncome.time.toISOString().split('T')[0]}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={updatedIncome.description}
          onChange={handleUpdateFormChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateExpense}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateIncomeModal;

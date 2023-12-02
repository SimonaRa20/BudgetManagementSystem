import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';
import { ExpenseCategories, getExpensesCategoryTitle } from '../../models/constants';
import { API_BASE_URL } from '../../../apiConfig';
import axios from 'axios';
import { ExpenseRequest } from '../../models/expense';

interface UpdateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
  expenseId: number;
  familyId: string;
  memberId: string;
}

const UpdateExpenseModal: React.FC<UpdateExpenseModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  expenseId,
  familyId,
  memberId,
}) => {
  const [updatedExpense, setUpdatedExpense] = useState<ExpenseRequest>({
    title: '',
    category: ExpenseCategories.Rent,
    amount: 0,
    description: '',
    time: new Date(),
  });

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/${memberId}/Expenses/${expenseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const expenseDetails = response.data;
        console.log('Fetched Expense Details:', expenseDetails);

        setUpdatedExpense((prevExpense) => ({
          ...prevExpense,
          title: expenseDetails.title || '',
          category: expenseDetails.category || ExpenseCategories.Rent,
          amount: expenseDetails.amount || 0,
          description: expenseDetails.description || '',
          time: expenseDetails.time ? new Date(expenseDetails.time) : new Date(),
        }));
      } catch (error: any) {
        console.error('Failed to fetch expense details:', error.response?.data || error.message);
      }
    };

    if (isOpen && expenseId) {
      fetchExpenseDetails();
    }
  }, [isOpen, expenseId, familyId, memberId]);

  const handleUpdateFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdatedExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const selectedCategory = event.target.value as ExpenseCategories;
    setUpdatedExpense((prevExpense) => ({
      ...prevExpense,
      category: selectedCategory,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(0, 0, 0, 0); // Set the time to midnight
  
    setUpdatedExpense((prevExpense) => ({
      ...prevExpense,
      time: selectedDate,
    }));
  };
  

  const handleUpdateExpense = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/${memberId}/Expenses/${expenseId}`,
        updatedExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateSuccess();
    } catch (error: any) {
      console.error(
        'Failed to update expense:',
        error.response?.data || error.message
      );
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Update Expense</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={updatedExpense.title}
          onChange={handleUpdateFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Category"
          name="category"
          value={updatedExpense.category}
          onChange={handleCategoryChange}
          fullWidth
          margin="normal"
        >
          {Object.values(ExpenseCategories).map((category) => (
            <MenuItem key={category} value={category}>
              {getExpensesCategoryTitle(category as ExpenseCategories)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={updatedExpense.amount}
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
          value={updatedExpense.time.toISOString().split('T')[0]}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={updatedExpense.description}
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

export default UpdateExpenseModal;

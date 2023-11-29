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
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ExpenseCategories, getCategoryTitle } from '../../models/constants';
import { API_BASE_URL } from '../../../apiConfig';
import axios from 'axios';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseCreated: () => void;
  familyId: string;
  memberId: string;
}

function getEnumKeys(enumObj: any) {
  return Object.keys(enumObj).filter((key) => !isNaN(Number(enumObj[key])));
}

function getEnumValue(enumObject: any, key: string): any {
  return enumObject[key];
}

const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  isOpen,
  onClose,
  onExpenseCreated,
  familyId,
  memberId,
}) => {
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: ExpenseCategories.Rent,
    amount: 0,
    description: '',
    time: new Date(), // Initialize with the current date
  });

  const [errors, setErrors] = useState({
    title: '',
    amount: '',
    description: '',
  });

  const handleCreateFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));

    // Clear the error for the field when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const selectedCategory = event.target.value as ExpenseCategories;

    setNewExpense((prevExpense) => ({
      ...prevExpense,
      category: selectedCategory,
    }));
  };

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = new Date(event.target.value);
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      time: date,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!newExpense.title) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (newExpense.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
      isValid = false;
    }

    if (!newExpense.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleCreateExpense = async () => {
    try {
      if (!validateForm()) {
        // Do not proceed with the expense creation if the form is not valid
        return;
      }

      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/Families/${familyId}/Members/${memberId}/Expenses`,
        newExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onExpenseCreated(); // Trigger the callback
      onClose(); // Close the modal only if the creation is successful
    } catch (error: any) {
      console.error(
        'Failed to create expense:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create New Expense</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={newExpense.title}
          onChange={handleCreateFormChange}
          fullWidth
          margin="normal"
          error={Boolean(errors.title)}
          helperText={errors.title}
        />
        <TextField
          select
          label="Category"
          name="category"
          value={newExpense.category}
          onChange={handleCategoryChange}
          fullWidth
          margin="normal"
        >
          {getEnumKeys(ExpenseCategories).map((categoryKey) => (
            <MenuItem
              key={categoryKey}
              value={getEnumValue(ExpenseCategories, categoryKey)}
            >
              {getCategoryTitle(getEnumValue(ExpenseCategories, categoryKey))}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={newExpense.amount}
          onChange={handleCreateFormChange}
          fullWidth
          margin="normal"
          inputProps={{
            step: '0.01',
          }}
          error={Boolean(errors.amount)}
          helperText={errors.amount}
        />
        <TextField
          label="Date"
          name="time"
          type="date"
          value={newExpense.time.toISOString().split('T')[0]}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={newExpense.description}
          onChange={handleCreateFormChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          error={Boolean(errors.description)}
          helperText={errors.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateExpense}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateExpenseModal;

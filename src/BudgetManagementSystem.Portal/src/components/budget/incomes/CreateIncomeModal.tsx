import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';
import { IncomeCategories, getIncomesCategoryTitle } from '../../models/constants';
import { API_BASE_URL } from '../../../apiConfig';
import axios from 'axios';

interface CreateIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncomeCreated: () => void;
  familyId: string;
  memberId: string;
}

function getEnumKeys(enumObj: any) {
  return Object.keys(enumObj).filter((key) => !isNaN(Number(enumObj[key])));
}

function getEnumValue(enumObject: any, key: string): any {
  return enumObject[key];
}

const CreateIncomeModal: React.FC<CreateIncomeModalProps> = ({
  isOpen,
  onClose,
  onIncomeCreated,
  familyId,
  memberId,
}) => {
  const [newIncome, setNewIncome] = useState({
    title: '',
    category: IncomeCategories.Salary,
    amount: 0,
    description: '',
    time: new Date(),
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
    setNewIncome((prevIncome) => ({
      ...prevIncome,
      [name]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const selectedCategory = event.target.value as IncomeCategories;

    setNewIncome((prevIncome) => ({
      ...prevIncome,
      category: selectedCategory,
    }));
  };

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = new Date(event.target.value);
    setNewIncome((prevIncome) => ({
      ...prevIncome,
      time: date,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!newIncome.title) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (newIncome.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
      isValid = false;
    }

    if (!newIncome.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleCreateIncome = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/Families/${familyId}/Members/${memberId}/Incomes`,
        newIncome,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onIncomeCreated();
      setNewIncome({
        title: '',
        category: IncomeCategories.Salary,
        amount: 0,
        description: '',
        time: new Date(),
      });
      onClose();
    } catch (error: any) {
      console.error(
        'Failed to create income:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create New Income</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={newIncome.title}
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
          value={newIncome.category}
          onChange={handleCategoryChange}
          fullWidth
          margin="normal"
        >
          {getEnumKeys(IncomeCategories).map((categoryKey) => (
            <MenuItem
              key={categoryKey}
              value={getEnumValue(IncomeCategories, categoryKey)}
            >
              {getIncomesCategoryTitle(getEnumValue(IncomeCategories, categoryKey))}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={newIncome.amount}
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
          value={newIncome.time.toISOString().split('T')[0]}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={newIncome.description}
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
          onClick={handleCreateIncome}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateIncomeModal;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';
import { IncomeCategories, getIncomesCategoryTitle } from '../../models/constants';
import { API_BASE_URL } from '../../../apiConfig';
import axios from 'axios';
import { IncomeRequest } from '../../models/income';

interface UpdateIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
  incomeId: number;
  familyId: string;
  memberId: string;
}

const UpdateIncomeModal: React.FC<UpdateIncomeModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  incomeId,
  familyId,
  memberId,
}) => {
  const [updatedIncome, setUpdatedIncome] = useState<IncomeRequest>({
    title: '',
    category: IncomeCategories.Salary,
    amount: 0,
    description: '',
    time: new Date(),
  });

  const [validCategories] = useState<IncomeCategories[]>([
    IncomeCategories.Salary,
    IncomeCategories.Bonus,
    IncomeCategories.Investment,
    IncomeCategories.Rental,
    IncomeCategories.Freelance,
    IncomeCategories.Gift,
    IncomeCategories.Pension,
    IncomeCategories.DailyAllowance,
    IncomeCategories.Other,
  ]);

  useEffect(() => {
    const fetchIncomeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/${memberId}/Incomes/${incomeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const incomeDetails = response.data;
        console.log('Fetched Expense Details:', incomeDetails);

        setUpdatedIncome((prevIncome) => ({
          ...prevIncome,
          title: incomeDetails.title || '',
          category: incomeDetails.category || IncomeCategories.Salary,
          amount: incomeDetails.amount || 0,
          description: incomeDetails.description || '',
          time: incomeDetails.time ? new Date(incomeDetails.time) : new Date(),
        }));
      } catch (error: any) {
        console.error('Failed to fetch expense details:', error.response?.data || error.message);
      }
    };

    if (isOpen && incomeId) {
      fetchIncomeDetails();
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
    const selectedCategory = event.target.value;
    setUpdatedIncome((prevIncome) => ({
      ...prevIncome,
      category: selectedCategory as IncomeCategories,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(0, 0, 0, 0); // Set the time to midnight

    setUpdatedIncome((prevIncome) => ({
      ...prevIncome,
      time: selectedDate,
    }));
  };

  const handleUpdateIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/${memberId}/Incomes/${incomeId}`,
        updatedIncome,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateSuccess();
    } catch (error: any) {
      console.error(
        'Failed to update income:',
        error.response?.data || error.message
      );
    } finally {
      onClose();
    }
  };

  const mapNumberToIncomeCategory = (categoryNumber: number): IncomeCategories => {
    const matchingCategory = validCategories.find(
      category => category === categoryNumber || category.toString() === categoryNumber.toString()
    );

    return matchingCategory !== undefined
      ? (matchingCategory as IncomeCategories)
      : IncomeCategories.Other;
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
          value={mapNumberToIncomeCategory(updatedIncome.category)}
          onChange={handleCategoryChange}
          fullWidth
          margin="normal"
        >
          {validCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {getIncomesCategoryTitle(category)}
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
          onClick={handleUpdateIncome}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateIncomeModal;

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import { UserResponse } from '../models/auth';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: number;
  onMemberAdded: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, familyId, onMemberAdded }) => {
  const [usersNotInFamily, setUsersNotInFamily] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');

  useEffect(() => {
    const fetchUsersNotInFamily = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/Families/${familyId}/FamilyMembers/NotInFamily`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersNotInFamily(response.data);
      } catch (error: any) {
        console.error('Failed to fetch users not in the family:', error.message);
      }
    };

    if (isOpen) {
      fetchUsersNotInFamily();
    }
  }, [isOpen, familyId]);

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/Families/${familyId}/FamilyMembers`,
        selectedUserId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onMemberAdded();
      onClose();
    } catch (error: any) {
      console.error('Failed to add a new member to the family:', error.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Member</DialogTitle>
      <DialogContent>
        <Typography>Select a user to add to the family:</Typography>
        <FormControl fullWidth>
          <InputLabel id="user-select-label">User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUserId}
            label="User"
            onChange={(e) => setSelectedUserId(e.target.value as number | '')}
          >
            {usersNotInFamily.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {`${user.name} ${user.surname}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddMember} color="primary" variant="contained">
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberModal;

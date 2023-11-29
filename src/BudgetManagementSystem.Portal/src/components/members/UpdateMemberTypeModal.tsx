import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FamilyMemberResponse } from '../models/family-member';
import { MemberType } from '../models/constants';
import { API_BASE_URL } from '../../apiConfig';
import { getMemberTypeText, getMemberTypeNumericValue } from '../models/constants';

interface UpdateMemberTypeModalProps {
    member: FamilyMemberResponse | null;
    isOpen: boolean;
    onUpdate: () => void;
    onClose: () => void;
}

const UpdateMemberTypeModal: React.FC<UpdateMemberTypeModalProps> = ({
    member,
    isOpen,
    onUpdate,
    onClose,
}) => {
    const memberTypeOptions = [0, 1, 2, 3, 4, 5, 6, 7].map((value) => ({
        value: value as MemberType,
        label: getMemberTypeText(value as MemberType),
    }));

    const [newType, setNewType] = useState<MemberType | ''>('');
    const [existingTypeText, setExistingTypeText] = useState<string>('');

    useEffect(() => {
        if (isOpen && member) {
            setExistingTypeText(getMemberTypeText(member.type));
            setNewType(member.type);
        }
    }, [isOpen, member]);

    const handleConfirmUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            if (member && newType !== '') {
                const numericValue = getMemberTypeNumericValue(newType);
                console.log(numericValue)
                await axios.put(
                    `${API_BASE_URL}/api/Families/${member.familyId}/FamilyMembers/${member.familyMemberId}`,
                    numericValue,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                onUpdate();
            }
        } catch (error: any) {

            const validationErrors = error.response?.data?.errors?.$;
            console.error('Validation Errors:', validationErrors);
        } finally {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Update Member Type</DialogTitle>
            <DialogContent>
                {existingTypeText && (
                    <Typography sx={{ marginBottom: '1rem' }}>
                        Existing Member Type: {existingTypeText}
                    </Typography>
                )}
                <FormControl fullWidth>
                    <InputLabel id="member-type-label">New Member Type</InputLabel>
                    <Select
                        labelId="member-type-label"
                        value={newType}
                        label="New Member Type"
                        onChange={(e) => {
                            setNewType(e.target.value as MemberType | '');
                        }}
                    >
                        {memberTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmUpdate} color="primary" variant="contained">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateMemberTypeModal;

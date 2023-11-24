import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FamilyMemberResponse } from '../models/family-member';
import { getMemberTypeText } from '../models/constants';

interface MemberDetailsModalProps {
  member: FamilyMemberResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({ member, isOpen, onClose }) => {
  if (!member) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {`${member.name} ${member.surname}`}
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">{`${member.name} ${member.surname}`}</Typography>
        <Typography>{`Username: ${member.userName}`}</Typography>
        <Typography>{`Email: ${member.email}`}</Typography>
        <Typography>{`Type: ${getMemberTypeText(member.type)}`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MemberDetailsModal;

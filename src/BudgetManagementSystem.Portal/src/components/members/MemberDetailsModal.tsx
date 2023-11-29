import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
      <DialogTitle>Member details</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Name & Surname</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
              <TableCell>{`${member.name} ${member.surname}`}</TableCell>
                <TableCell>{member.userName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{getMemberTypeText(member.type)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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

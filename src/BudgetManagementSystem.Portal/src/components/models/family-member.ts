import { MemberType } from './constants';

export interface FamilyMemberResponse {
    familyMemberId: number;
    familyId: number;
    name: string;
    surname: string;
    userName: string;
    email: string;
    type: MemberType;
  }
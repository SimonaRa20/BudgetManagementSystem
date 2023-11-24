import { MemberType } from './constants';

export interface FamilyMemberResponse {
    familyMemberId: number;
    name: string;
    surname: string;
    userName: string;
    email: string;
    type: MemberType;
  }
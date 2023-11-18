export interface User {
  id: number;
  userName: string;
  role: string;
  token: string;
  refreshToken: string;
}
  export interface Family {
    id: number;
    title: string;
    membersCount: number;
  }

  export interface Family {
    id: number;
    title: string;
    membersCount: number;
    members: FamilyMember[];
  }
  
  export interface FamilyMember {
    familyMemberId: number;
    name: string;
    surname: string;
    userName: string;
    email: string;
  }
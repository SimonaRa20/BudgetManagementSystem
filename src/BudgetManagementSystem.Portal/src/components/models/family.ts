import { FamilyMemberResponse } from "./family-member";

export interface FamilyByIdResponse {
    id: number;
    title: string;
    members: FamilyMemberResponse[];
  }

export interface FamilyCreateRequest {
    title: string;
  }

export interface FamilyResponse {
    id: number;
    title: string;
    membersCount: number;
  }
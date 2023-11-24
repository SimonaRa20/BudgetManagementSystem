import { IncomeCategories } from "./constants";

export interface IncomeResponse {
    id: number;
    title: string;
    category: IncomeCategories;
    amount: number;
    description: string;
    time: Date;
  }

  export interface IncomeRequest {
    title: string;
    category: IncomeCategories;
    amount: number;
    description: string;
    time: Date;
  }
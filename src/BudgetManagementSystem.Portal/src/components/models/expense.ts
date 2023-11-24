import { ExpenseCategories } from "./constants";

export interface ExpenseResponse {
    id: number;
    title: string;
    category: ExpenseCategories;
    amount: number;
    description: string;
    time: Date;
  }

  export interface ExpenseRequest {
    title: string;
    category: ExpenseCategories;
    amount: number;
    description: string;
    time: Date;
  }
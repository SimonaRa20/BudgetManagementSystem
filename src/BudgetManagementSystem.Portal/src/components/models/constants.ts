export enum ExpenseCategories {
    Rent = 0,
    Groceries = 1,
    Transportation = 2,
    Utilities = 3,
    Entertainment = 4,
    DinnerOut = 5,
    Travel = 6,
    Healthcare = 7,
    Education = 8,
    Subscription = 9,
    Other = 10,
  }

  export const getExpensesCategoryTitle = (category: ExpenseCategories): string => {
    switch (category) {
      case ExpenseCategories.Rent:
        return 'Rent';
      case ExpenseCategories.Groceries:
        return 'Groceries';
      case ExpenseCategories.Transportation:
        return 'Transportation';
      case ExpenseCategories.Utilities:
        return 'Utilities';
      case ExpenseCategories.Entertainment:
        return 'Entertainment';
      case ExpenseCategories.DinnerOut:
        return 'Dinner Out';
      case ExpenseCategories.Travel:
        return 'Travel';
      case ExpenseCategories.Healthcare:
        return 'Healthcare';
      case ExpenseCategories.Education:
        return 'Education';
      case ExpenseCategories.Subscription:
        return 'Subscription';
      case ExpenseCategories.Other:
        return 'Other';
      default:
        return '';
    }
  };
  
  export enum IncomeCategories {
    Salary = 0,
    Bonus = 1,
    Investment = 2,
    Rental = 3,
    Freelance = 4,
    Gift = 5,
    Pension = 6,
    DailyAllowance = 7,
    Other = 8,
  }

  
  export const getIncomesCategoryTitle = (category: IncomeCategories): string => {
    switch (category) {
      case IncomeCategories.Salary:
        return 'Salary';
      case IncomeCategories.Bonus:
        return 'Bonus';
      case IncomeCategories.Investment:
        return 'Investment';
      case IncomeCategories.Rental:
        return 'Rental';
      case IncomeCategories.Freelance:
        return 'Freelance';
      case IncomeCategories.Gift:
        return 'Gift';
      case IncomeCategories.Pension:
        return 'Pension';
      case IncomeCategories.DailyAllowance:
        return 'DailyAllowance';
      case IncomeCategories.Other:
        return 'Other';
      default:
        return '';
    }
  }
  
  export enum MemberType {
    Parent = 0,
    Child = 1,
    Sibling = 2,
    Grandparent = 3,
    Aunt = 4,
    Uncle = 5,
    Cousin = 6,
    Other = 7,
  }
  
  export type UserRole = 'Owner' | 'Admin';
  
  export const getMemberTypeText = (type: MemberType): string => {
    switch (type) {
      case MemberType.Parent:
        return 'Parent';
        case MemberType.Child:
          return 'Child';
        case MemberType.Sibling:
          return 'Sibling';
        case MemberType.Grandparent:
          return 'Grandparent';
        case MemberType.Aunt:
          return 'Aunt';
        case MemberType.Uncle:
          return 'Uncle';
        case MemberType.Cousin:
          return 'Cousin';
        case MemberType.Other:
          return 'Other';
        default:
          return 'Unknown';
      }
  };

  export const getMemberTypeNumericValue = (type: MemberType): number => {
    return type;
  };
  
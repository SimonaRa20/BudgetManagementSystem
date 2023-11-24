export enum ExpenseCategories {
    Rent,
    Groceries,
    Transportation,
    Utilities,
    Entertainment,
    DinnerOut,
    Travel,
    Healthcare,
    Education,
    Subscription,
    Other,
  }
  
  export enum IncomeCategories {
    Salary,
    Bonus,
    Investment,
    Rental,
    Freelance,
    Gift,
    Pension,
    DailyAllowance,
    Other,
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
  
  export const Role = {
    Owner: 'Owner',
    Admin: 'Admin',
  };
  
  
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
  
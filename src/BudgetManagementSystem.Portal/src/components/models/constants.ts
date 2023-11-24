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
    Parent,
    Child,
    Sibling,
    Grandparent,
    Aunt,
    Uncle,
    Cousin,
    Other,
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
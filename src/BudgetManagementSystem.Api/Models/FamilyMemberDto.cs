using BudgetManagementSystem.Api.Constants;

namespace BudgetManagementSystem.Api.Models
{
    public class FamilyMemberDto
    {
        public int Id { get; set; }
        public int FamilyId { get; set; }
        public int UserId { get; set; }
        public MemberType Type { get; set; }

        public FamilyDto Family { get; set; }
        public UserDto User { get; set; }
        public List<IncomeDto> Incomes { get; set; }
        public List<ExpenseDto> Expenses { get; set; }
    }
}

using BudgetManagementSystem.Api.Constants;

namespace BudgetManagementSystem.Api.Models
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public ExpenseCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }

        public int FamilyMemberId { get; set; }
        public FamilyMemberDto FamilyMember { get; set; }
    }
}

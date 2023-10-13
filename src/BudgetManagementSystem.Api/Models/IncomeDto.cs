using BudgetManagementSystem.Api.Constants;

namespace BudgetManagementSystem.Api.Models
{
    public class IncomeDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public IncomeCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }

        // Foreign key to represent the user who earned the income
        public int FamilyMemberId { get; set; }
        public FamilyMemberDto FamilyMember { get; set; }
    }
}

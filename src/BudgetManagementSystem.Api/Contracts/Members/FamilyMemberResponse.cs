using BudgetManagementSystem.Api.Constants;

namespace BudgetManagementSystem.Api.Contracts.Members
{
    public class FamilyMemberResponse
    {
        public int FamilyMemberId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public MemberType? Type { get; set; }
    }
}

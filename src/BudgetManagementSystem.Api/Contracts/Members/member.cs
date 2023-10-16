namespace BudgetManagementSystem.Api.Contracts.Members
{
    public class Member
    {
        public int FamilyMemberId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
    }
}

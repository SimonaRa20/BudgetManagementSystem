using BudgetManagementSystem.Api.Contracts.Members;

namespace BudgetManagementSystem.Api.Contracts.Families
{
    public class FamilyByIdResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<FamilyMemberResponse> Members { get; set; }
    }
}

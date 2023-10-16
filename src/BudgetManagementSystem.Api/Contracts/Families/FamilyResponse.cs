using BudgetManagementSystem.Api.Models;

namespace BudgetManagementSystem.Api.Contracts.Families
{
    public class FamilyResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int MembersCount { get; set; }
    }
}

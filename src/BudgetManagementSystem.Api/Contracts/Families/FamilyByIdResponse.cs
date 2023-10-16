using BudgetManagementSystem.Api.Contracts.Members;
using BudgetManagementSystem.Api.Models;

namespace BudgetManagementSystem.Api.Contracts.Families
{
    public class FamilyByIdResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<Member> Members { get; set; }
    }
}

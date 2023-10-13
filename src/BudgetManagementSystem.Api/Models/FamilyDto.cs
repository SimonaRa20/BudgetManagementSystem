using Microsoft.EntityFrameworkCore.Metadata;

namespace BudgetManagementSystem.Api.Models
{
    public class FamilyDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<FamilyMemberDto> FamilyMembers { get; set; }
    }
}

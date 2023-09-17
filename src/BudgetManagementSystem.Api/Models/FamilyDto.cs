using Microsoft.EntityFrameworkCore.Metadata;

namespace BudgetManagementSystem.Api.Models
{
    public class FamilyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<UserDto>? FamilyMembers { get; set; }
    }
}

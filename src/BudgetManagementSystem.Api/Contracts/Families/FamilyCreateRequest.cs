namespace BudgetManagementSystem.Api.Contracts.Families
{
    public class FamilyCreateRequest
    {
        public string Title { get; set; }
        public ICollection<int> MembersId { get; set; }
    }
}

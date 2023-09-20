namespace BudgetManagementSystem.Api.Contracts.Auth
{
    public class UserLoginResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }

        public UserLoginResponse(int id, string? username, string? role, string token)
        {
            Id = id;
            UserName = username;
            Role = role;
            Token = token;
        }
    }
}

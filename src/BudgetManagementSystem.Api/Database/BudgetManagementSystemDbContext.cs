using BudgetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Database
{
    public class BudgetManagementSystemDbContext : DbContext 
    {
        public BudgetManagementSystemDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<UserDto> Users { get; set; }
    }
}

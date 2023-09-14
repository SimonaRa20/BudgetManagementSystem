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
        public DbSet<FamilyDto> Families { get; set; }
        public DbSet<IncomeDto> Incomes { get; set; }
        public DbSet<ExpenseDto> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define relationships here
            modelBuilder.Entity<UserDto>()
                .HasOne(u => u.Family)
                .WithMany(f => f.FamilyMembers)
                .HasForeignKey(u => u.FamilyId);

            modelBuilder.Entity<IncomeDto>()
                .HasOne(i => i.User)
                .WithMany(u => u.Incomes)
                .HasForeignKey(i => i.UserId);

            modelBuilder.Entity<ExpenseDto>()
                .HasOne(e => e.User)
                .WithMany(u => u.Expenses)
                .HasForeignKey(e => e.UserId);
        }
    }
}

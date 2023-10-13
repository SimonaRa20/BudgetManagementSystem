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
        public DbSet<FamilyMemberDto> FamilyMembers { get; set; }
        public DbSet<IncomeDto> Incomes { get; set; }
        public DbSet<ExpenseDto> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<FamilyDto>()
                .HasMany(f => f.FamilyMembers)
                .WithOne(fm => fm.Family)
                .HasForeignKey(fm => fm.FamilyId);

            modelBuilder.Entity<FamilyMemberDto>()
                .HasOne(member => member.Family)
                .WithMany(family => family.FamilyMembers)
                .HasForeignKey(member => member.FamilyId);

            modelBuilder.Entity<FamilyMemberDto>()
                .HasMany(member => member.Incomes)
                .WithOne(income => income.FamilyMember)
                .HasForeignKey(income => income.FamilyMemberId);

            modelBuilder.Entity<FamilyMemberDto>()
                .HasMany(member => member.Expenses)
                .WithOne(expense => expense.FamilyMember)
                .HasForeignKey(expense => expense.FamilyMemberId);
        }
    }
}

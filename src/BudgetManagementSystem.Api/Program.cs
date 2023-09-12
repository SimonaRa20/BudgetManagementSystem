using BudgetManagementSystem.Api.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

var configuration = builder.Services.BuildServiceProvider().GetRequiredService<IConfiguration>();

// front end join
builder.Services.AddCors();
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("Test", builder =>
//    {
//        builder.WithOrigins("http://localhost:3000")
//               .AllowAnyHeader()
//               .AllowAnyMethod()
//               .SetIsOriginAllowed((x) => true)
//               .AllowCredentials();
//    });
//});

builder.Services.AddDbContext<BudgetManagementSystemDbContext>(db => db.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseCors("Test");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Auth;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IConfiguration _config;
        private readonly BudgetManagementSystemDbContext _dbContext;

        public AuthController(IConfiguration config, BudgetManagementSystemDbContext dbContext)
        {
            _config = config;
            _dbContext = dbContext;
        }

        [Route("Login")]
        [HttpPost]
        public ActionResult Login([FromBody] UserLoginRequest userLogin)
        {
            var user = Authenticate(userLogin);
            if (user != null)
            {
                var token = GenerateToken(user);
                var userLoginResponse = LoginResponse(user, token);
                return Created("", userLoginResponse);
            }

            return NotFound("Invalid email or password. Please try again.");
        }

        [Route("Register")]
        [HttpPost]
        public async Task<IActionResult> Register(UserRegisterRequest user)
        {
            List<string> errors = new List<string>();

            if (user.Email.IsNullOrEmpty() || !user.Email.Contains('@'))
            {
                errors.Add("Invalid email format.");
            }

            if (string.IsNullOrWhiteSpace(user.Name))
            {
                errors.Add("User name is necessary.");
            }

            if (string.IsNullOrWhiteSpace(user.Surname))
            {
                errors.Add("User surname is necessary.");
            }

            if (string.IsNullOrWhiteSpace(user.Password) || user.Password.Length < 8)
            {
                errors.Add("Password should be a minimum of 8 characters.");
            }

            if (_dbContext.Users.Any(u => u.Email == user.Email))
            {
                errors.Add("User with the same email already exists.");
            }

            if (errors.Count > 0)
            {
                return new ObjectResult(errors)
                {
                    StatusCode = (int)HttpStatusCode.UnprocessableEntity
                };
            }

            try
            {
                var hashedPassword = HashPassword(user.Password);
                user.Password = hashedPassword;

                UserDto userDto = ConvertUser(user);
                _dbContext.Users.Add(userDto);
                await _dbContext.SaveChangesAsync();

                return Created("", userDto);
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while processing the request.");
            }
        }

        private UserLoginResponse LoginResponse(UserDto user, string token)
        {
            UserLoginResponse response = new(user.Id, user.UserName, user.Role, token);
            return response;
        }

        private string GenerateToken(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.UserName),
                new Claim(ClaimTypes.Role,user.Role)
            };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserDto Authenticate(UserLoginRequest userLogin)
        {
            var currentUser = _dbContext.Users.FirstOrDefault(x => x.Email == userLogin.Email);

            if (currentUser != null)
            {
                if (VerifyPassword(userLogin.Password, currentUser.HashedPassword))
                {
                    return currentUser;
                }
            }

            return null;
        }

        private UserDto ConvertUser(UserRegisterRequest user)
        {
            UserDto userDto = new UserDto
            {
                Id = 0,
                Name = user.Name,
                Surname = user.Surname,
                UserName = user.UserName,
                Role = Role.Owner,
                Email = user.Email,
                HashedPassword = user.Password,
            };

            return userDto;
        }

        private bool VerifyPassword(string enteredPassword, string storedHashedPassword)
        {
            if (HashPassword(enteredPassword) == storedHashedPassword)
            {
                return true;
            }
            return false;
        }

        private string HashPassword(string password)
        {
            byte[] salt = Encoding.ASCII.GetBytes(_config["Salt"]);
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashedPassword;
        }
    }
}

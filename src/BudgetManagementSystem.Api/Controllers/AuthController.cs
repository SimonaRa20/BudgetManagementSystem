using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Auth;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();
                SaveRefreshToken(user.Id, refreshToken);

                var userLoginResponse = LoginResponse(user, accessToken, refreshToken);
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

                var userResponse = new UserResponse
                {
                    Id = userDto.Id,
                    Name = userDto.Name,
                    Surname = userDto.Surname,
                    UserName = userDto.UserName,
                    Email = userDto.Email
                };

                return Created("", userResponse);
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while processing the request.");
            }
        }

        [Route("RefreshToken")]
        [HttpPost]
        public ActionResult RefreshToken([FromBody] RefreshTokenRequest refreshTokenRequest)
        {
            var user = GetUserByRefreshToken(refreshTokenRequest.RefreshToken);
            if (user != null)
            {
                var accessToken = GenerateAccessToken(user);
                return Created("",new { AccessToken = accessToken });
            }

            string errors = "Invalid or expired refresh token.";

            return new ObjectResult(errors)
            {
                StatusCode = (int)HttpStatusCode.UnprocessableEntity
            };
        }

        [Route("Logout")]
        [HttpPost]
        [Authorize] // Add the [Authorize] attribute to secure the endpoint
        public ActionResult Logout()
        {
            try
            {
                // Get the current user's claims, including the userId
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User not authenticated.");
                }

                // Remove the user's refresh token from the database
                RemoveRefreshToken(int.Parse(userId));

                return Ok("Logged out successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while logging out.");
            }
        }

        private void RemoveRefreshToken(int userId)
        {
            var existingRefreshToken = _dbContext.RefreshTokens.FirstOrDefault(rt => rt.UserId == userId);

            if (existingRefreshToken != null)
            {
                _dbContext.RefreshTokens.Remove(existingRefreshToken);
                _dbContext.SaveChanges();
            }
        }

        private UserLoginResponse LoginResponse(UserDto user, string accessToken, string refreshToken)
        {
            UserLoginResponse response = new(user.Id, user.UserName, user.Role, accessToken, refreshToken);
            return response;
        }

        private string GenerateAccessToken(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                expires: DateTime.Now.AddHours(2), // Token expiration time
                claims: claims,
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

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private void SaveRefreshToken(int userId, string refreshToken)
        {
            var existingRefreshToken = _dbContext.RefreshTokens.FirstOrDefault(rt => rt.UserId == userId);

            if (existingRefreshToken != null)
            {
                _dbContext.RefreshTokens.Remove(existingRefreshToken);
            }

            var newRefreshToken = new RefreshTokenDto
            {
                UserId = userId,
                Token = refreshToken,
                ExpiryDate = DateTime.Now.AddDays(1)
            };

            _dbContext.RefreshTokens.Add(newRefreshToken);
            _dbContext.SaveChanges();
        }

        private UserDto GetUserByRefreshToken(string refreshToken)
        {
            var user = _dbContext.Users
                .Join(_dbContext.RefreshTokens, u => u.Id, rt => rt.UserId, (u, rt) => new { u, rt })
                .FirstOrDefault(joined => joined.rt.Token == refreshToken && joined.rt.ExpiryDate > DateTime.Now)
                ?.u;

            return user;
        }
    }
}

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;

namespace Backend.Services
{
    public class JwtService
    {
        public string GenerateToken(User user)
        {
            //same key as in config file
            var secretKey = "jdfjhfdjhhjhjhjhhfdjfdkjfdfdffdf";
          
            
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // 2. Attach the user's specific data to the token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
             
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60), // Hardcoded 60 minutes
                signingCredentials: credentials);

            // 4. Return it as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
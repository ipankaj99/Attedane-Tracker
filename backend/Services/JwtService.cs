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
            // 1. Hardcoding the exact secret key you created
            var secretKey = "jdfjhfdjhhjhjhjhhfdjfdkjfdfdffdf";
            //             Same key used for:
            // 1. Creating signature
            // 2. Verifying signature
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // 2. Attach the user's specific data to the token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                // new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // 3. Build the actual token with your hardcoded URLs
            var token = new JwtSecurityToken(
                // issuer: "http://localhost:5071",
                // audience: "http://localhost:5173",
                claims: claims,
                expires: DateTime.Now.AddMinutes(60), // Hardcoded 60 minutes
                signingCredentials: credentials);

            // 4. Return it as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
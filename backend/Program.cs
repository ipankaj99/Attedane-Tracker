using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Controllers
builder.Services.AddControllers();

// JWT
var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"]
    ?? throw new InvalidOperationException(
        "JWT Secret Key is missing from appsettings.json!"
    );

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecretKey)
            )
        };
    });

builder.Services.AddAuthorization();

// Dependency Injection
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<LeaveService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Apply migrations and seed HR account
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Apply pending migrations
    db.Database.Migrate();

    // Seed HR user if not exists
    if (!db.Users.Any(u => u.Email == "hr@company.com"))
    {
        db.Users.Add(new User
        {
            Name = "HR Admin",
            Email = "hr@company.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"),
            Role = "Hr",
            SickLeave = 10,
            EarnedLeave = 5,
            CasualLeave = 5
        });

        db.SaveChanges();
    }
}

// Middleware
app.UseCors("AllowAll");

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
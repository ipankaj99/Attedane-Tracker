🕒 Attendance Management System
A robust, enterprise-ready attendance tracking application designed to streamline employee record-keeping and organizational hierarchy management.

🚀 Overview
This application provides a secure, role-based platform for tracking daily attendance. Built with a C#/.NET Web API backend and a React frontend, it ensures a seamless experience for both employees and HR administrators. The system emphasizes data integrity, requiring HR oversight for user onboarding and organizational mapping.

🛠 Tech Stack
Backend: C# / .NET 8.0 (Web API)

Database: SQLite (Lightweight, file-based relational storage)

Frontend: React (Vite), Tailwind CSS, Shadcn/UI

Authentication: JWT (JSON Web Tokens) with secure session validation

🏗 Key Features
Role-Based Access Control (RBAC):

HR: Exclusive permissions to onboard new users, assign managers, and manage organizational structure.

Employees: Secure access to track personal attendance once onboarded by HR.

Administrative Workflow:

System Seeding: Includes migration scripts to initialize the system with a master HR account.

Managed Onboarding: HR has full control to create accounts and map employees to their respective managers, ensuring an accurate reporting hierarchy from day one.

Persistent State: Utilizes React Context API for seamless session management, preventing unauthorized access and ensuring state synchronization across the app.

⚙️ Getting Started
Prerequisites
.NET SDK 8.0+

Node.js (LTS)

Installation
Clone the repository

Bash
git clone https://github.com/your-username/attendance-system.git
cd attendance-system
Backend Setup (.NET)

Bash
cd server
dotnet restore
# Run migrations to initialize SQLite database
1) dotnet ef database update
2) dotnet run


#Frontend Setup (React)
Bash
cd client
npm install
npm run dev


📋 Administrative Logic
The application follows a "Controlled Onboarding" pattern. When the system is initialized via the seed script, a master HR account is created. Only this account has the authority to:

Register new users into the system.

Assign Managers to employees during the creation process, maintaining a clean relational link within the SQLite database.


🚀 Advanced Feature Roadmap
1. Smart Rejection Workflow
Feature: When a manager rejects a leave request, a modal (pop-up) forces the entry of a "Reason for Rejection."

Impact: Ensures transparency and provides employees with actionable feedback, reducing follow-up queries.

2. Automated Escalation Engine
Feature: A background job (e.g., a .NET BackgroundService or Hangfire) that monitors request statuses. If a request is "Pending" for >48 hours, it triggers an email/in-app notification to the manager and elevates visibility to HR/Owner.

Impact: Prevents operational bottlenecks and ensures time-sensitive requests are handled promptly.

3. Power-User HR Dashboard
Feature: A centralized command center for HR to:

Hierarchy Management: A drag-and-drop or simple dropdown interface to reassign an employee’s manager.

Global View: A filterable table of all employees, their attendance trends, and pending requests.

Record Correction: An "Edit" mode to override or correct erroneous leave requests submitted by employees.


Step-by-Step Execution Guide

1. Initial System Initialization

Before you can log in, the database must be seeded with the master HR account.

Navigate to the server directory:

bash cd server

Run database migrations:

bash dotnet ef database update

Launch the API:

bash dotnet run


Note: On the first run, the system executes the seed script, creating the master HR account. Refer to your SeedData.cs (or equivalent file) for the default credentials, e.g.:

Email:  hr@company.com
Password: Admin123!




2. HR Administrator Access

Once the backend is running, access the platform as the Administrator to begin operations.

Start the frontend:

bashcd ../client
npm run dev

Login:
Navigate to the login page in your browser and sign in using the master HR credentials.


3. Managing Users and Hierarchy

The system follows a "Controlled Onboarding" pattern — all new users must be created by the HR account.

Onboard New Employees

Navigate to the HR Dashboard → select "Add New User."

Assign Reporting Structure

During the user creation form, use the Manager Selection dropdown:


If you select a specific manager → all attendance requests (leaves/queries) from this new user are routed to that manager.
Default behavior → if the Manager field is left empty/unassigned, the system defaults the reporting line to the HR Administrator.


Credential Handoff

Once the account is saved in the database, communicate the generated credentials to the employee so they can perform their initial login.


💡 Workflow Summary

ActionPerformed ByPurposeDatabase MigrationSystem / DevInitialize tables and seed Master HR.System LoginHR AdminUnlock user management capabilities.Create UserHR AdminRegister employee and map their manager.Attendance / LeaveEmployeeRequest leave; routes to assigned manager.Approval / RejectionManager / HRManage pending employee requests.
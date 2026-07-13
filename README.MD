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
dotnet ef database update
dotnet run
Frontend Setup (React)

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
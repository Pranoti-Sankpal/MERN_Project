# ComplaintCare - Customer Complaint Management System

A **React + Node.js + Express.js + MySQL full-stack application** built for a campus
hiring assessment. It models a complete, real business process end-to-end rather than a
set of disconnected CRUD screens.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Problem](#2-business-problem)
3. [Objectives](#3-objectives)
4. [User Roles](#4-user-roles)
5. [Complete Workflow](#5-complete-workflow)
6. [Features](#6-features)
7. [Technology Stack](#7-technology-stack)
8. [Architecture](#8-architecture)
9. [Database Design](#9-database-design)
10. [ER Relationship Explanation](#10-er-relationship-explanation)
11. [API Documentation](#11-api-documentation)
12. [Folder Structure](#12-folder-structure)
13. [Installation](#13-installation)
14. [MySQL Setup](#14-mysql-setup)
15. [Environment Variables](#15-environment-variables)
16. [Backend Setup](#16-backend-setup)
17. [Frontend Setup](#17-frontend-setup)
18. [Seed Data](#18-seed-data)
19. [Demo Credentials](#19-demo-credentials)
20. [Testing](#20-testing)
21. [Common Errors and Solutions](#21-common-errors-and-solutions)
22. [Future Enhancements](#22-future-enhancements)
23. [AI Tools Used During Development](#23-ai-tools-used-during-development)
24. [Interview Talking Points](#24-interview-talking-points)

---

## 1. Project Overview

ComplaintCare is a customer complaint management system where customers can raise
complaints, admins triage and assign them to employees, employees resolve them, and
customers confirm closure. It is **not** described as "MERN" because it uses **MySQL**,
not MongoDB.

## 2. Business Problem

Organizations need a way to capture customer complaints, categorize them, assign
responsibility to the right employee, track progress to resolution, and give managers
visibility into what is pending, in progress, or resolved.

## 3. Objectives

- Provide a simple way for customers to submit and track complaints.
- Give admins tools to categorize, prioritize, and assign complaints to employees.
- Give employees a clear queue of what they are responsible for.
- Enforce a strict, auditable status workflow so complaints cannot skip steps.
- Enforce ownership so users only ever see what they are allowed to see.

## 4. User Roles

| Role     | Created by            | Key capabilities                                             |
|----------|------------------------|----------------------------------------------------------------|
| ADMIN    | Seeded (`seed.sql`)     | Categorize, assign, monitor, manage employees/categories, dashboard |
| EMPLOYEE | Created by Admin        | View assigned complaints, start work, resolve with remarks     |
| CUSTOMER | Self-registers          | Submit complaints, track status, comment, close resolved ones  |

Full capability lists are in the code (`backend/middleware/roleMiddleware.js` +
`allowRoles(...)` calls in each route file) and match the original requirement spec exactly.

## 5. Complete Workflow

```
Customer
   |
Register/Login
   |
Submit Complaint            -> status = SUBMITTED
   |
Admin reviews, categorizes,
assigns an employee         -> status = ASSIGNED
   |
Employee starts work        -> status = IN_PROGRESS
   |
Employee resolves
(with resolution remarks)   -> status = RESOLVED
   |
Customer (or Admin) closes  -> status = CLOSED  (terminal - cannot be reopened)
```

This exact sequence is enforced in code by `backend/utils/statusTransitions.js`, which is
the single source of truth every status-changing controller must call before writing to
MySQL.

## 6. Features

- JWT authentication + bcrypt password hashing
- Role-based authorization (ADMIN / EMPLOYEE / CUSTOMER) on every route
- Ownership checks independent of role checks (an employee can only touch complaints
  assigned to them; a customer can only touch their own complaints)
- Centralized, single-source-of-truth status transition validation
- Full complaint lifecycle: create, assign, start work, resolve (with remarks), close
- Comments on complaints
- Category management
- Search/filter by status, priority, category, assigned employee
- Admin dashboard with aggregate statistics (`COUNT`, `GROUP BY`)
- Centralized Express error handling with safe, non-leaking error messages
- Parameterized SQL everywhere (no string-concatenated queries)

## 7. Technology Stack

**Frontend:** React.js, Vite, JavaScript, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express.js
**Database:** MySQL (via `mysql2`)
**Auth:** JWT (`jsonwebtoken`), `bcryptjs`

No MongoDB, Mongoose, Firebase, Supabase, PostgreSQL, or any NoSQL database is used
anywhere in this project.

## 8. Architecture

```
React (Vite) SPA  --axios-->  Express REST API  --mysql2-->  MySQL
     |                              |
  React Router                 JWT auth middleware
  Context API (auth state)     Role middleware
                                Ownership checks (in controllers)
                                statusTransitions.js (workflow rules)
```

The frontend never trusts its own validation or its own hidden buttons for security -
every check is re-enforced on the backend. The frontend only hides actions as a UX
convenience.

## 9. Database Design

Four tables, defined in `database/schema.sql`:

- **users** - id, name, email (unique), password (bcrypt hash), phone, role, timestamps
- **complaint_categories** - id, name (unique), description, created_at
- **complaints** - id, customer_id (FK→users), category_id (FK→complaint_categories,
  nullable), assigned_employee_id (FK→users, nullable), subject, description, priority
  (ENUM), status (ENUM), resolution_remarks, created_at, updated_at, resolved_at, closed_at
- **complaint_comments** - id, complaint_id (FK→complaints), user_id (FK→users), comment,
  created_at

Indexes exist on `status`, `priority`, `customer_id`, `assigned_employee_id`,
`category_id`, and `created_at` on the `complaints` table, since these are the columns
used for filtering and sorting in the dashboard and complaint list views.

## 10. ER Relationship Explanation

- **users → complaints (one-to-many, as customer):** one customer can file many
  complaints; `complaints.customer_id` references `users.id`. Deleting a customer cascades
  and deletes their complaints (`ON DELETE CASCADE`).
- **users → complaints (one-to-many, as employee):** one employee can be assigned many
  complaints; `complaints.assigned_employee_id` references `users.id`. Deleting an
  employee sets this field to `NULL` (`ON DELETE SET NULL`) rather than deleting complaint
  history.
- **complaint_categories → complaints (one-to-many):** one category groups many
  complaints; `complaints.category_id` references `complaint_categories.id`, also
  `ON DELETE SET NULL` so deleting a category does not destroy complaint records.
- **complaints → complaint_comments (one-to-many):** one complaint can have many
  comments; `complaint_comments.complaint_id` references `complaints.id`
  (`ON DELETE CASCADE`, since a comment only makes sense attached to its complaint).
- **users → complaint_comments (one-to-many):** one user can write many comments;
  `complaint_comments.user_id` references `users.id`.

## 11. API Documentation

See [API_TESTING.md](./API_TESTING.md) for full request/response examples. Summary:

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`

**Users (Admin-managed):** `GET /api/users`, `GET /api/users/:id`,
`POST /api/users/employees`, `PUT /api/users/:id`, `DELETE /api/users/:id`

**Complaints:** `POST /api/complaints`, `GET /api/complaints`, `GET /api/complaints/:id`,
`PUT /api/complaints/:id`, `DELETE /api/complaints/:id`

**Complaint workflow:** `PUT /api/complaints/:id/assign`, `PUT /api/complaints/:id/status`,
`PUT /api/complaints/:id/resolve`, `PUT /api/complaints/:id/close`

**Comments:** `POST /api/complaints/:id/comments`, `GET /api/complaints/:id/comments`

**Categories:** `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`,
`DELETE /api/categories/:id`

**Dashboard:** `GET /api/dashboard/stats`, `GET /api/dashboard/categories`,
`GET /api/dashboard/priorities`, `GET /api/dashboard/recent`

All responses follow the shape:
```json
{ "success": true, "message": "...", "data": { } }
```
or on error:
```json
{ "success": false, "message": "..." }
```

## 12. Folder Structure

```
customer-complaint-management/
├── frontend/            React + Vite + Tailwind SPA
│   └── src/
│       ├── components/  Reusable UI (tables, badges, forms, modal, etc.)
│       ├── pages/        customer/, employee/, admin/, public/
│       ├── layouts/      DashboardLayout (navbar + sidebar)
│       ├── services/     Axios wrappers per API resource
│       ├── context/      AuthContext (global auth state)
│       ├── hooks/        useAuth
│       ├── utils/        badge styles, date formatting, role redirect
│       └── routes/       ProtectedRoute, RoleRoute
├── backend/              Express API
│   ├── config/db.js       MySQL connection pool
│   ├── controllers/       auth, user, complaint, category, dashboard
│   ├── middleware/        auth, role, error handling
│   ├── routes/             one file per resource
│   ├── utils/              statusTransitions.js (workflow rules), validators, apiResponse
│   └── tests/              unit + integration tests
├── database/
│   ├── schema.sql
│   └── seed.sql
├── README.md
├── API_TESTING.md
├── AI_DEVELOPMENT_LOG.md
├── .gitignore
└── package.json           optional root convenience scripts
```

## 13. Installation

Requirements: Node.js 18+, npm, and a running MySQL 8.x server.

```bash
git clone <this-repo-or-unzip-the-project>
cd customer-complaint-management
npm run install-all   # installs backend + frontend dependencies
```

(`install-all` requires the optional root `package.json`; you can always install each
side individually - see sections 16 and 17.)

## 14. MySQL Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

This creates the `complaint_management` database, all four tables, and inserts the demo
data (1 admin, 2 employees, 5 customers, 6 categories, and a realistic spread of sample
complaints across every status).

## 15. Environment Variables

Copy the example file and fill in your local MySQL credentials:

```bash
cd backend
cp .env.example .env
```

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=complaint_management

JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=1d

FRONTEND_URL=http://localhost:5173
```

Never commit a real `.env` file - it is already listed in `.gitignore`.

For the frontend, copy `frontend/.env.example` to `frontend/.env` if you need to point at
a non-default API URL (defaults to `http://localhost:5000/api`).

## 16. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API starts on `http://localhost:5000`. You should see:
```
MySQL connected successfully.
ComplaintCare API listening on http://localhost:5000
```

## 17. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` (Vite default) and talks to the backend at the
URL configured in `frontend/.env` (or the default).

## 18. Seed Data

`database/seed.sql` inserts:

- 1 Admin, 2 Employees, 5 Customers (all passwords are real bcrypt hashes - never plain text)
- 6 categories: Technical, Billing, Service, Product, Account, Other
- A realistic spread of complaints across every status (SUBMITTED, ASSIGNED, IN_PROGRESS,
  RESOLVED, CLOSED), multiple priorities, multiple categories, and both employees, plus a
  few sample comments.

## 19. Demo Credentials

All seeded accounts use the password: **`Password123`**

| Role     | Email                              |
|----------|--------------------------------------|
| Admin    | admin@complaintcare.com               |
| Employee | ravi.employee@complaintcare.com       |
| Employee | anita.employee@complaintcare.com      |
| Customer | rahul.customer@example.com            |
| Customer | priya.customer@example.com            |
| Customer | amit.customer@example.com             |
| Customer | sneha.customer@example.com            |
| Customer | vikram.customer@example.com           |

## 20. Testing

**Unit tests** (no database required):
```bash
cd backend
npm test
# or specifically:
node --test tests/statusTransitions.test.js
```
These verify every valid and invalid status transition, including that a `CLOSED`
complaint can never be reopened.

**Integration tests** (require MySQL + a running backend on port 5000):
```bash
# terminal 1
cd backend && npm run dev
# terminal 2
cd backend && node --test tests/api.integration.test.js
```
These cover registration, login, invalid login, complaint creation, admin assignment,
employee/customer ownership checks, valid/invalid transitions, resolve, close,
unauthorized access, and forbidden role access - see [API_TESTING.md](./API_TESTING.md)
for the same scenarios written out as a manual checklist.

## 21. Common Errors and Solutions

| Symptom                                             | Likely cause / fix                                                        |
|------------------------------------------------------|----------------------------------------------------------------------------|
| `MySQL connection failed`                            | Check `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_PORT` in `backend/.env` and that MySQL is running |
| `ER_ACCESS_DENIED_ERROR`                              | Wrong MySQL username/password                                             |
| `ER_BAD_DB_ERROR: Unknown database`                   | Run `database/schema.sql` first to create the database                    |
| `401 Not authorized` on every request                | Missing/expired JWT - log in again, and check `Authorization: Bearer <token>` header |
| `403 Forbidden`                                       | Working as intended - your role/ownership does not permit this action     |
| `400 Invalid status transition...`                    | Working as intended - the workflow only allows the specific next status listed in the error |
| CORS error in browser console                         | Confirm `FRONTEND_URL` in `backend/.env` matches the URL the frontend is served from |
| Frontend shows blank page                             | Confirm `VITE_API_BASE_URL` points to a running backend                   |

## 22. Future Enhancements

- Email/SMS notifications on status change
- File attachments on complaints
- Pagination on large complaint lists
- SLA timers / auto-escalation for overdue complaints
- Audit log of every status change (who changed what, when)
- Refresh tokens / token revocation

## 23. AI Tools Used During Development

AI assistance was used throughout development (requirement analysis, database design, API
design, backend/frontend implementation, and test-writing). See
[AI_DEVELOPMENT_LOG.md](./AI_DEVELOPMENT_LOG.md) for a stage-by-stage account of what was
asked, what was generated, how it was reviewed, and what was changed manually.

## 24. Interview Talking Points

- **Why MySQL, not MongoDB?** The data is inherently relational - complaints reference
  customers, employees, and categories via foreign keys, and the workflow needs strict
  referential integrity (e.g., an employee id in `assigned_employee_id` must exist and
  must actually have the `EMPLOYEE` role).
- **Why `isValidTransition()`?** Without one central function, it would be easy for a new
  endpoint (or a bug in an existing one) to move a complaint to an invalid status (e.g.
  straight from `SUBMITTED` to `CLOSED`). Centralizing the rule means there is exactly one
  place to look, test, and audit.
- **How is SQL injection prevented?** Every query uses `mysql2`'s parameterized queries
  (`?` placeholders) - user input is never concatenated directly into a SQL string.
- **How are passwords stored?** Hashed with `bcryptjs` (cost factor 10 at registration
  time) - never in plain text, and the hash is never returned in any API response.
- **What happens if an employee tries to access another employee's complaint?** The
  controller compares `req.user.id` to `complaint.assigned_employee_id` independent of the
  role check, and returns `403 Forbidden` if they don't match.
- **What happens if someone tries to reopen a CLOSED complaint?** `isValidTransition`
  returns `false` for any transition out of `CLOSED` (its allowed-transitions list is
  empty), so the API returns `400 Bad Request`.
- **Known limitations:** No file attachments, no pagination yet on large complaint lists,
  and no email notifications - documented above as future enhancements rather than hidden.

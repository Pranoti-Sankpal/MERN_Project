# API Testing Guide - ComplaintCare

Base URL (local development): `http://localhost:5000/api`

All authenticated requests must include:

```
Authorization: Bearer <JWT_TOKEN>
```

Demo accounts (all use password `Password123`, see README for the full list):

| Role     | Email                              |
|----------|-------------------------------------|
| Admin    | admin@complaintcare.com             |
| Employee | ravi.employee@complaintcare.com     |
| Customer | rahul.customer@example.com          |

---

## 1. Register (Customer)

`POST /api/auth/register`

Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123",
  "phone": "9876543210"
}
```

Success response `201`:
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": { "id": 9, "name": "Jane Doe", "email": "jane.doe@example.com", "phone": "9876543210", "role": "CUSTOMER" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Error response `409` (duplicate email):
```json
{ "success": false, "message": "An account with this email already exists." }
```

---

## 2. Login (any role)

`POST /api/auth/login`

Request body:
```json
{ "email": "admin@complaintcare.com", "password": "Password123" }
```

Success response `200`:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { "id": 1, "name": "System Admin", "email": "admin@complaintcare.com", "phone": "9000000001", "role": "ADMIN" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Error response `401` (wrong password):
```json
{ "success": false, "message": "Invalid email or password." }
```

---

## 3. Get Profile

`GET /api/auth/profile` (auth required)

Success response `200`:
```json
{
  "success": true,
  "message": "Profile fetched successfully.",
  "data": { "user": { "id": 1, "name": "System Admin", "email": "admin@complaintcare.com", "role": "ADMIN", "created_at": "..." } }
}
```

---

## 4. Create Complaint (Customer)

`POST /api/complaints` (auth required, role=CUSTOMER)

Request body:
```json
{
  "subject": "Unable to reset password",
  "description": "The password reset link in the email does not work.",
  "category_id": 5,
  "priority": "HIGH"
}
```

Success response `201`:
```json
{
  "success": true,
  "message": "Complaint created successfully.",
  "data": { "complaint": { "id": 12, "status": "SUBMITTED", "priority": "HIGH", "...": "..." } }
}
```

---

## 5. Assign Complaint (Admin)

`PUT /api/complaints/:id/assign` (auth required, role=ADMIN)

Request body:
```json
{ "assigned_employee_id": 2, "category_id": 5, "priority": "HIGH" }
```

Success response `200`:
```json
{
  "success": true,
  "message": "Complaint assigned successfully.",
  "data": { "complaint": { "id": 12, "status": "ASSIGNED", "assigned_employee_id": 2, "...": "..." } }
}
```

Error response `400` (already assigned/closed etc.):
```json
{ "success": false, "message": "Cannot assign complaint from status CLOSED. Valid next statuses: none." }
```

---

## 6. Update Status (Employee) - e.g. start work

`PUT /api/complaints/:id/status` (auth required, role=EMPLOYEE, must own the complaint)

Request body:
```json
{ "status": "IN_PROGRESS" }
```

Success response `200`:
```json
{
  "success": true,
  "message": "Complaint status updated successfully.",
  "data": { "complaint": { "id": 12, "status": "IN_PROGRESS", "...": "..." } }
}
```

Error response `400` (invalid transition):
```json
{ "success": false, "message": "Invalid status transition from ASSIGNED to CLOSED. Valid next statuses: IN_PROGRESS." }
```

---

## 7. Resolve Complaint (Employee)

`PUT /api/complaints/:id/resolve` (auth required, role=EMPLOYEE, must own the complaint)

Request body:
```json
{ "resolution_remarks": "Reset the password manually and verified the customer can log in." }
```

Success response `200`:
```json
{
  "success": true,
  "message": "Complaint resolved successfully.",
  "data": { "complaint": { "id": 12, "status": "RESOLVED", "resolution_remarks": "...", "resolved_at": "..." } }
}
```

---

## 8. Close Complaint (Customer or Admin)

`PUT /api/complaints/:id/close` (auth required, role=CUSTOMER (owner) or ADMIN)

Success response `200`:
```json
{
  "success": true,
  "message": "Complaint closed successfully.",
  "data": { "complaint": { "id": 12, "status": "CLOSED", "closed_at": "..." } }
}
```

---

## 9. Dashboard Stats

`GET /api/dashboard/stats` (auth required; response is scoped to the caller's role)

Success response `200`:
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully.",
  "data": {
    "stats": {
      "total": 9, "submitted": 3, "assigned": 2, "in_progress": 2,
      "resolved": 1, "closed": 1, "pending": 7
    }
  }
}
```

---

## Other useful endpoints

| Method | Endpoint                          | Access                          |
|--------|------------------------------------|----------------------------------|
| GET    | /api/complaints                    | role-scoped list with filters   |
| GET    | /api/complaints/:id                | owner or Admin                  |
| PUT    | /api/complaints/:id                | owner (limited fields) or Admin |
| DELETE | /api/complaints/:id                | Admin only                      |
| POST   | /api/complaints/:id/comments       | owner (customer/employee) or Admin |
| GET    | /api/complaints/:id/comments       | owner or Admin                  |
| GET    | /api/categories                    | any authenticated user          |
| POST/PUT/DELETE | /api/categories            | Admin only                      |
| GET    | /api/users?role=EMPLOYEE           | Admin only                      |
| POST   | /api/users/employees                | Admin only                      |
| GET    | /api/dashboard/categories          | scoped by role                  |
| GET    | /api/dashboard/priorities          | scoped by role                  |
| GET    | /api/dashboard/recent              | scoped by role                  |

## Testing ownership/authorization failures

- Log in as `anita.employee@complaintcare.com` and try `GET /api/complaints/:id` for a complaint
  assigned to `ravi.employee@complaintcare.com` → expect `403 Forbidden`.
- Log in as any customer and try `GET /api/complaints/:id` for another customer's complaint id
  → expect `403 Forbidden`.
- Call any `/api/complaints` route with no `Authorization` header → expect `401 Unauthorized`.
- Log in as a customer and call `POST /api/categories` → expect `403 Forbidden` (role check).
- Try `PUT /api/complaints/:id/status` with `{"status": "CLOSED"}` on a complaint still in
  `SUBMITTED` → expect `400 Bad Request` with a message naming the valid next status.

A Postman collection can be built directly from the requests above by importing them manually,
or by using the `API_TESTING.md` examples as a reference when constructing requests in any
REST client (Postman, Insomnia, Thunder Client, curl).

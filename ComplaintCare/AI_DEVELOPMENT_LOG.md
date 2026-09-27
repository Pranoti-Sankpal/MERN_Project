# AI Development Log - ComplaintCare

This log documents how AI (Claude) was used to help build this project, stage by stage,
so I can explain my actual development process during the interview.

---

## 1. Requirement Analysis

**What was needed:** Turn a long, detailed spec (business workflow, roles, tech stack,
database fields, API list) into a concrete project plan and folder structure.

**Example prompt used:** "Build a complete React + Node.js + Express.js + MySQL customer
complaint management system with three roles (Admin, Employee, Customer) and a status
workflow SUBMITTED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED."

**What AI generated:** A full folder structure (frontend/backend/database), a list of
tables, and a list of REST endpoints matching the workflow described above.

**How the code was reviewed:** Cross-checked the generated folder structure and endpoint
list against the original requirement list line by line to make sure nothing was missed
(e.g., all 19 frontend pages, all 4 database tables).

**What was changed manually:** N/A at this stage - this was planning only.

**What was learned:** Writing out the full business workflow as a diagram before touching
code makes it much easier to keep the status-transition logic consistent everywhere.

---

## 2. Database Design

**What was needed:** A normalized MySQL schema for users, categories, complaints, and
comments, with correct foreign keys and indexes.

**Example prompt used:** "Design a MySQL schema for `users`, `complaint_categories`,
`complaints`, and `complaint_comments` with foreign keys, an ENUM for role/status/priority,
and appropriate indexes for the columns that will be filtered on (status, priority,
customer_id, assigned_employee_id)."

**What AI generated:** `database/schema.sql` with `CREATE TABLE` statements, `ENUM` columns
for `role`, `status`, and `priority`, foreign key constraints with `ON DELETE`/`ON UPDATE`
behavior, and indexes on the columns used in complaint filters.

**How the code was reviewed:** Manually traced every foreign key back to the requirement
doc (customer_id → users.id, category_id → complaint_categories.id, assigned_employee_id →
users.id) and confirmed `ON DELETE SET NULL` was used for category/employee (so deleting a
category or employee doesn't destroy complaint history) while `ON DELETE CASCADE` was used
for the user → complaint link intentionally scoped to the owning customer.

**What was changed manually:** Adjusted the `ON DELETE` behavior for `assigned_employee_id`
to `SET NULL` instead of `CASCADE` after realizing a cascading delete would silently delete
complaints if an employee account were removed - that would violate the "never lose
complaint history" expectation of a complaint tracker.

**What was learned:** Foreign key `ON DELETE` behavior is a real design decision, not
boilerplate - it directly affects whether business data can be silently lost.

---

## 3. API Design

**What was needed:** A REST API surface that matches the spec: auth, users, complaints
(including workflow actions), categories, dashboard, and comments.

**Example prompt used:** "List REST endpoints for a complaint management API, including
separate PUT endpoints for assign/status/resolve/close so each workflow action can be
authorized and validated independently."

**What AI generated:** The full route list matching the spec, split across
`authRoutes.js`, `userRoutes.js`, `complaintRoutes.js`, `categoryRoutes.js`, and
`dashboardRoutes.js`.

**How the code was reviewed:** Verified every endpoint from the original requirement list
had a matching route + controller function, and that role/ownership middleware was applied
to each one (not just a subset).

**What was changed manually:** None significant - the route grouping matched what was
needed once the controllers were reviewed.

**What was learned:** Splitting "generic update" (`PUT /complaints/:id`) from "workflow
action" (`assign`, `status`, `resolve`, `close`) endpoints keeps authorization logic much
simpler than trying to handle every case inside one big update function.

---

## 4. Backend Implementation

**What was needed:** Working Express controllers using `mysql2` with parameterized
queries, following the response shape `{ success, message, data }`.

**Example prompt used:** "Implement the complaint controller using mysql2/promise,
parameterized queries only, and a consistent JSON response helper."

**What AI generated:** `complaintController.js`, `categoryController.js`,
`dashboardController.js`, `userController.js`, plus the shared `apiResponse.js` helper.

**How the code was reviewed:** Checked every SQL query for string concatenation of user
input (there is none - all values are passed as `?` placeholders through the mysql2 query
parameter array).

**What was changed manually:** Added the `COALESCE(?, column)` pattern in a few UPDATE
statements (e.g., `updateUser`, `updateCategory`) so a partial update (only `name` OR only
`phone`) doesn't accidentally null out the other field.

**What was learned:** `COALESCE` in an UPDATE statement is a simple way to support partial
updates without writing a different SQL string for every combination of fields.

---

## 5. Authentication

**What was needed:** Registration (customer only), login for all roles, JWT issuance,
bcrypt hashing, and a `/profile` endpoint.

**Example prompt used:** "Implement register/login/profile using bcryptjs and
jsonwebtoken, with the JWT payload containing only `id` and `role`."

**What AI generated:** `authController.js` with `bcrypt.hash`/`bcrypt.compare` and
`jwt.sign`/`jwt.verify`, plus `authMiddleware.js` to decode the token on protected routes.

**How the code was reviewed:** Confirmed the password field is never returned in any API
response (the raw password hash is explicitly `delete`d from the user object before it is
sent back on login).

**What was changed manually:** None - this matched the required pattern directly.

**What was learned:** It's easy to forget to strip the password hash from a response object
before sending it to the client; doing it in one place (right after the bcrypt.compare
check) avoids repeating that logic everywhere.

---

## 6. Business Logic (Status Transition Rules)

**What was needed:** A single, centralized function that is the only place status
transition rules are defined, so the workflow can't be bypassed from any endpoint.

**Example prompt used:** "Create `isValidTransition(fromStatus, toStatus)` as the single
source of truth for the complaint workflow, and make every status-changing controller call
it before updating the database."

**What AI generated:** `backend/utils/statusTransitions.js` with an explicit
`ALLOWED_TRANSITIONS` map and a `getNextValidStatuses` helper for clearer error messages.

**How the code was reviewed:** Manually traced each of the four workflow endpoints
(`assign`, `status`, `resolve`, `close`) to confirm every single one calls
`isValidTransition` before touching MySQL, and wrote unit tests
(`tests/statusTransitions.test.js`) to check both valid and invalid transitions, including
that `CLOSED` can never transition anywhere.

**What was changed manually:** Nothing in the logic itself, but I added the unit test file
to prove the rules actually hold rather than trusting the implementation by inspection
alone.

**What was learned:** A lookup table (`{ SUBMITTED: ['ASSIGNED'], ... }`) is far easier to
reason about and test than a chain of `if` statements, and it makes "why did you create
`isValidTransition()`?" an easy interview question to answer.

---

## 7. Frontend Implementation

**What was needed:** React + Vite + Tailwind pages for all three roles, matching the
19-page list in the spec, with shared components for tables, badges, forms, etc.

**Example prompt used:** "Build reusable ComplaintTable, StatusBadge, and PriorityBadge
components so complaint lists look consistent across the Customer, Employee, and Admin
views instead of writing three different table implementations."

**What AI generated:** The shared components (`ComplaintTable.jsx`, `StatusBadge.jsx`,
`PriorityBadge.jsx`, etc.) plus role-specific pages that reuse them.

**How the code was reviewed:** Opened each page mentally against the required route list
in the spec to confirm nothing was missing, and checked that role-specific actions (assign
for Admin, resolve for Employee, close for Customer) only render for the role/ownership
combination that the backend would actually allow.

**What was changed manually:** Consolidated the "Complaint Details" page into one shared
`ComplaintDetailView` component reused by three thin per-role wrapper pages, instead of
three near-duplicate implementations, to keep the codebase simple enough to explain in an
interview.

**What was learned:** The UI hiding a button is a UX nicety, not a security control - the
backend ownership checks are what actually stop unauthorized access, and the frontend
never assumes otherwise.

---

## 8. Integration

**What was needed:** Wiring the Axios client to attach the JWT token automatically and
handle 401s consistently.

**Example prompt used:** "Add an Axios request interceptor that reads the token from
localStorage and an response interceptor that redirects to /login on 401."

**What AI generated:** `services/api.js` with both interceptors, and a set of thin service
modules (`authService.js`, `complaintService.js`, etc.) wrapping each API resource.

**How the code was reviewed:** Manually tested (by reading the code path) that a token
removed from localStorage results in `authenticate` returning 401 so the interceptor's
redirect logic can fire.

**What was changed manually:** None.

**What was learned:** Centralizing the 401 handling in one interceptor avoids repeating the
same "if 401, redirect to login" check in every single page component.

---

## 9. Testing

**What was needed:** Automated tests for the most important behaviors (registration,
login, ownership checks, status transitions), plus a manual testing checklist for anything
that requires a live database connection.

**Example prompt used:** "Write Node.js built-in test-runner tests for the status
transition rules (pure function, no DB needed), and integration tests that exercise the
running API for registration, login, complaint creation, assignment, ownership checks, and
status transitions."

**What AI generated:** `tests/statusTransitions.test.js` (pure unit tests) and
`tests/api.integration.test.js` (integration tests using `fetch` against a running server).

**How the code was reviewed:** Ran the unit test file directly (`node --test
tests/statusTransitions.test.js`) and confirmed all 9 assertions pass. The integration
tests were reviewed line-by-line since they require a live MySQL instance to actually
execute; the API_TESTING.md checklist documents the same scenarios for manual verification
in environments without automated test execution.

**What was changed manually:** Added an explicit test case (`12b`) checking that a `CLOSED`
complaint cannot be reopened, since that is one of the interview's specifically listed
questions.

**What was learned:** Pure business logic (like `isValidTransition`) should be tested
separately from anything requiring network/database access, since the former can run
anywhere instantly and the latter needs a full environment.

---

## 10. Debugging

**What was needed:** Catching a few realistic mistakes before they became bugs.

**Examples of what was caught and fixed while reviewing the generated code:**

1. In the dashboard controller, `SUM(CASE WHEN ...)` can return `NULL` (not `0`) when there
   are zero matching rows in MySQL - added an explicit `Number(stats[k]) || 0` normalization
   step so the frontend never receives `null` for a count.
2. In `assignComplaint`, the original draft checked `req.body.assigned_employee_id` for
   truthiness but did not verify the referenced user was actually an `EMPLOYEE` (an Admin
   could have accidentally assigned a complaint to a Customer's user id) - added an explicit
   role check on the referenced user before allowing the assignment.
3. Double-checked that a customer editing their own complaint (`PUT /complaints/:id`) is
   blocked once the complaint leaves `SUBMITTED` status, so a customer can't quietly rewrite
   the complaint description after an employee has already started working on it.

**What was learned:** Aggregate SQL functions like `SUM`/`COUNT` need explicit `NULL`
handling on the empty-result edge case, and any "assign X to Y" action needs to validate
that Y is actually a valid target, not just that an ID was supplied.

---

## Summary

AI was used throughout the project to accelerate writing boilerplate (routes, controllers,
CRUD forms) and to reason about edge cases (status transitions, ownership checks, `NULL`
aggregates). Every generated file was reviewed against the original requirement document,
and several specific issues (foreign key delete behavior, employee-role validation on
assignment, `NULL` stat normalization) were caught and corrected during that review rather
than assumed correct from the first draft.

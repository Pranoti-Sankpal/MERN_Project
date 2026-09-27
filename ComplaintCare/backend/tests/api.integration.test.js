// ============================================================
// Integration tests against a LIVE server + MySQL database.
//
// These are not run automatically in CI/sandbox environments
// because they require a running MySQL instance seeded with
// database/schema.sql + database/seed.sql, and a running
// backend server (npm run dev) on http://localhost:5000.
//
// To run:
//   1. Start MySQL and load schema.sql + seed.sql
//   2. In one terminal: cd backend && npm run dev
//   3. In another terminal: cd backend && node --test tests/api.integration.test.js
//
// Covers requirement checklist items 1-14 (registration, login,
// complaint creation, assignment, ownership checks, transitions,
// resolve/close, unauthorized/forbidden access).
// ============================================================
const test = require('node:test');
const assert = require('node:assert');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000/api';

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, body: json };
}

let customer1Token, customer2Token, adminToken, employee1Token, employee2Token;
let complaintId;

test('1. Customer registration succeeds with a new email', async () => {
  const email = `test.customer.${Date.now()}@example.com`;
  const res = await request('POST', '/auth/register', {
    name: 'Test Customer',
    email,
    password: 'Password123',
    phone: '9999999999',
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  customer1Token = res.body.data.token;
});

test('2. Login succeeds with the seeded admin account', async () => {
  const res = await request('POST', '/auth/login', {
    email: 'admin@complaintcare.com',
    password: 'Password123',
  });
  assert.strictEqual(res.status, 200);
  adminToken = res.body.data.token;
});

test('3. Invalid login is rejected', async () => {
  const res = await request('POST', '/auth/login', {
    email: 'admin@complaintcare.com',
    password: 'wrong-password',
  });
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.success, false);
});

test('setup: log in second customer + two employees for ownership tests', async () => {
  const c2 = await request('POST', '/auth/login', {
    email: 'priya.customer@example.com',
    password: 'Password123',
  });
  customer2Token = c2.body.data.token;

  const e1 = await request('POST', '/auth/login', {
    email: 'ravi.employee@complaintcare.com',
    password: 'Password123',
  });
  employee1Token = e1.body.data.token;

  const e2 = await request('POST', '/auth/login', {
    email: 'anita.employee@complaintcare.com',
    password: 'Password123',
  });
  employee2Token = e2.body.data.token;
});

test('4. Customer creates a complaint (status = SUBMITTED)', async () => {
  const res = await request(
    'POST',
    '/complaints',
    { subject: 'Test complaint', description: 'Integration test complaint description.', priority: 'MEDIUM' },
    customer1Token
  );
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.data.complaint.status, 'SUBMITTED');
  complaintId = res.body.data.complaint.id;
});

test('5. Admin assigns the complaint to employee1 (status -> ASSIGNED)', async () => {
  // Need employee id - fetch employees list as admin
  const employees = await request('GET', '/users?role=EMPLOYEE', null, adminToken);
  const emp1 = employees.body.data.users.find((u) => u.email === 'ravi.employee@complaintcare.com');

  const res = await request(
    'PUT',
    `/complaints/${complaintId}/assign`,
    { assigned_employee_id: emp1.id, category_id: 1, priority: 'HIGH' },
    adminToken
  );
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.complaint.status, 'ASSIGNED');
});

test('6. Assigned employee CAN access the complaint', async () => {
  const res = await request('GET', `/complaints/${complaintId}`, null, employee1Token);
  assert.strictEqual(res.status, 200);
});

test('7. A different employee CANNOT access the complaint (ownership check)', async () => {
  const res = await request('GET', `/complaints/${complaintId}`, null, employee2Token);
  assert.strictEqual(res.status, 403);
});

test('8. A different customer CANNOT access another customer complaint', async () => {
  const res = await request('GET', `/complaints/${complaintId}`, null, customer2Token);
  assert.strictEqual(res.status, 403);
});

test('9. Valid status transition: ASSIGNED -> IN_PROGRESS', async () => {
  const res = await request('PUT', `/complaints/${complaintId}/status`, { status: 'IN_PROGRESS' }, employee1Token);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.complaint.status, 'IN_PROGRESS');
});

test('10. Invalid status transition is rejected (IN_PROGRESS -> CLOSED)', async () => {
  const res = await request('PUT', `/complaints/${complaintId}/status`, { status: 'CLOSED' }, employee1Token);
  assert.strictEqual(res.status, 400);
});

test('11. Employee resolves the complaint with remarks (-> RESOLVED)', async () => {
  const res = await request(
    'PUT',
    `/complaints/${complaintId}/resolve`,
    { resolution_remarks: 'Fixed during integration test.' },
    employee1Token
  );
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.complaint.status, 'RESOLVED');
});

test('12. Customer closes the resolved complaint (-> CLOSED)', async () => {
  const res = await request('PUT', `/complaints/${complaintId}/close`, null, customer1Token);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.complaint.status, 'CLOSED');
});

test('12b. A closed complaint cannot be reopened', async () => {
  const res = await request('PUT', `/complaints/${complaintId}/status`, { status: 'IN_PROGRESS' }, employee1Token);
  assert.strictEqual(res.status, 400);
});

test('13. Unauthorized request without token is rejected', async () => {
  const res = await request('GET', '/complaints', null, null);
  assert.strictEqual(res.status, 401);
});

test('14. Forbidden role access is rejected (customer creating a category)', async () => {
  const res = await request('POST', '/categories', { name: 'Should Fail' }, customer1Token);
  assert.strictEqual(res.status, 403);
});

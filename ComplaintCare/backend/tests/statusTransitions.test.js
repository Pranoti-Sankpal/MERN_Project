// ============================================================
// Unit tests for the status transition rules.
// Run with: npm test  (uses Node's built-in test runner)
// ============================================================
const test = require('node:test');
const assert = require('node:assert');
const { isValidTransition } = require('../utils/statusTransitions');

test('valid transition: SUBMITTED -> ASSIGNED', () => {
  assert.strictEqual(isValidTransition('SUBMITTED', 'ASSIGNED'), true);
});

test('valid transition: ASSIGNED -> IN_PROGRESS', () => {
  assert.strictEqual(isValidTransition('ASSIGNED', 'IN_PROGRESS'), true);
});

test('valid transition: IN_PROGRESS -> RESOLVED', () => {
  assert.strictEqual(isValidTransition('IN_PROGRESS', 'RESOLVED'), true);
});

test('valid transition: RESOLVED -> CLOSED', () => {
  assert.strictEqual(isValidTransition('RESOLVED', 'CLOSED'), true);
});

test('invalid transition: SUBMITTED -> RESOLVED (skips steps)', () => {
  assert.strictEqual(isValidTransition('SUBMITTED', 'RESOLVED'), false);
});

test('invalid transition: SUBMITTED -> CLOSED (skips steps)', () => {
  assert.strictEqual(isValidTransition('SUBMITTED', 'CLOSED'), false);
});

test('invalid transition: CLOSED -> IN_PROGRESS (cannot reopen)', () => {
  assert.strictEqual(isValidTransition('CLOSED', 'IN_PROGRESS'), false);
});

test('invalid transition: CLOSED -> RESOLVED (cannot reopen)', () => {
  assert.strictEqual(isValidTransition('CLOSED', 'RESOLVED'), false);
});

test('invalid transition: unknown status is rejected', () => {
  assert.strictEqual(isValidTransition('SUBMITTED', 'BOGUS'), false);
  assert.strictEqual(isValidTransition('BOGUS', 'ASSIGNED'), false);
});

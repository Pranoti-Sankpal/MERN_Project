// ============================================================
// Single source of truth for complaint status transitions.
//
// Valid workflow:
//   SUBMITTED   -> ASSIGNED
//   ASSIGNED    -> IN_PROGRESS
//   IN_PROGRESS -> RESOLVED
//   RESOLVED    -> CLOSED
//
// Any transition not explicitly listed here is invalid
// (e.g. SUBMITTED -> RESOLVED, CLOSED -> anything).
// ============================================================

const STATUSES = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const ALLOWED_TRANSITIONS = {
  SUBMITTED: ['ASSIGNED'],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [], // terminal state - can never be reopened
};

/**
 * Checks whether moving a complaint from `fromStatus` to `toStatus`
 * is a legal transition according to the business workflow.
 * @param {string} fromStatus
 * @param {string} toStatus
 * @returns {boolean}
 */
function isValidTransition(fromStatus, toStatus) {
  if (!STATUSES.includes(fromStatus) || !STATUSES.includes(toStatus)) {
    return false;
  }
  return ALLOWED_TRANSITIONS[fromStatus].includes(toStatus);
}

/**
 * Returns the list of statuses that `fromStatus` is allowed to move to.
 * Useful for building helpful error messages.
 */
function getNextValidStatuses(fromStatus) {
  return ALLOWED_TRANSITIONS[fromStatus] || [];
}

module.exports = { isValidTransition, getNextValidStatuses, STATUSES, ALLOWED_TRANSITIONS };

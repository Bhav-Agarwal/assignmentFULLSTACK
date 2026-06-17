// attendance.js
// P3: Attendance store

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'attendance.json');

// P3a: Init store at module scope — read once when this module is first required.
// Start with {} if the file doesn't exist or is unreadable/corrupt.
let store = {};

try {
  const raw = fs.readFileSync(STORE_PATH, 'utf8');
  store = JSON.parse(raw);
} catch (err) {
  store = {};
}

/**
 * P3b: Mark a student present.
 * @param {string} rollNumber
 * @returns {{ success: true } | { success: false, reason: 'already_marked', timestamp: string }}
 */
function markPresent(rollNumber) {
  if (store[rollNumber]) {
    return { success: false, reason: 'already_marked', timestamp: store[rollNumber] };
  }

  const timestamp = new Date().toISOString();
  store[rollNumber] = timestamp;
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');

  return { success: true };
}

/**
 * P3c: Get current attendance stats.
 * @returns {{ total: number, rollNumbers: string[] }}
 */
function getStats() {
  const rollNumbers = Object.keys(store).sort();
  return { total: rollNumbers.length, rollNumbers };
}

/**
 * Get the full store as an array of [rollNumber, timestamp] rows, sorted.
 * Used by the bonus /export command.
 * @returns {[string, string][]}
 */
function getAllRows() {
  return Object.entries(store).sort((a, b) => a[0].localeCompare(b[0]));
}

module.exports = { markPresent, getStats, getAllRows };

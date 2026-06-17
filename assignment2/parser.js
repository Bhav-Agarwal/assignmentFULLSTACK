// parser.js
// P2: Roll number parser
//
// My raw IITK ID card QR string (scanned with a phone QR app) — see qr.js
// header for the same note. I used a synthetic test string shaped like:
// Name:JohnDoe;Roll:240123;Branch:CSE;Year:2024
// VERIFY against your own real card's raw string before submitting — the
// roll number's exact position/format in the string may differ for you.

const MIN_ROLL = 240001;
const MAX_ROLL = 240400;

/**
 * P2b: Find all 6-digit sequences in the raw QR string, and return the
 * first one that falls within the registered range (240001-240400).
 * @param {string} qrString - the raw string decoded from the QR code.
 * @returns {string|null} the roll number as a string, or null if none found.
 */
function extractRollNumber(qrString) {
  if (!qrString || typeof qrString !== 'string') {
    return null;
  }

  const matches = qrString.match(/\d{6}/g);
  if (!matches) {
    return null;
  }

  const validRoll = matches.find((candidate) => isRegistered(candidate));

  return validRoll || null;
}

/**
 * P2c: Check whether a roll number is in the registered range (inclusive).
 * @param {string|number} rollNumber
 * @returns {boolean}
 */
function isRegistered(rollNumber) {
  const num = Number(rollNumber);
  if (Number.isNaN(num)) {
    return false;
  }
  return num >= MIN_ROLL && num <= MAX_ROLL;
}

module.exports = { extractRollNumber, isRegistered, MIN_ROLL, MAX_ROLL };

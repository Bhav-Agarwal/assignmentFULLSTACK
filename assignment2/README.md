# QR Code Attendance System
Go to @IITK_QR_AzTTENDANCE_BOT on telegram
A Telegram bot that takes a photo of an IITK student ID card, decodes the QR code on it, extracts the roll number, checks it's in the registered range (240001-240400), and marks the student present in a JSON store. Duplicate scans are detected and ignored.

## What it does

1. A volunteer sends a photo of a student's ID card to the bot.
2. The bot downloads the photo and decodes the QR code in it (`qr.js` — `decodeQR()`, throws if none found).
3. It extracts a roll number from the raw QR string (`parser.js` — `extractRollNumber()`).
4. It checks the roll number is registered (`isRegistered()`).
5. It marks the student present in `attendance.json`, or reports a duplicate if already marked (`attendance.js` — `markPresent()`).
6. `/report` returns current attendance stats (`getStats()`).
7. `/export` (bonus) sends a CSV file of all attendance records.

## File structure

| File              | Responsibility                                            |
|--------------------|-------------------------------------------------------------|
| `qr.js`            | `decodeQR(imagePath)` — decode a QR code from an image (jimp + jsqr) |
| `parser.js`        | `extractRollNumber()`, `isRegistered()` — find & validate a roll number |
| `attendance.js`    | `markPresent()`, `getStats()` — read/write `attendance.json`, detect dupes |
| `bot.js`           | Telegram I/O only — wires the modules above together         |

## Setup

1. Install dependencies

   npm install

2. Create your bot token

   - Open Telegram, message @BotFather.
   - Run /newbot, follow the prompts, copy the token it gives you.

3. Configure environment variables

   copy .env.example .env

   Then edit .env:

   BOT_TOKEN=your_token_here

   .env is git-ignored — never commit your real token.

4. Run the bot

   node bot.js

   You should see "Bot started. Polling for messages..."

## Using the bot

- /start — quick help message.
- Send a photo of an ID card — marks attendance.
- /report — see who's been marked present so far.
- /export — download a CSV of all attendance records.

## Real ID card format

The real IITK ID card QR string has this shape:

02.240266,1,<base64 signature>.iitkidcard

The roll number sits right after "02." and before the first comma. Tested extractRollNumber() against this exact format — it correctly returns 240266 and finds no other false-positive 6-digit runs in the base64 signature blob, since the parser works generically (matches every 6-digit run in the whole string, returns the first one in 240001-240400) rather than depending on the "02." prefix or ".iitkidcard" suffix specifically.

## A spec quirk worth knowing about

Because extractRollNumber() already filters to the 240001-240400 range before returning anything (per spec P2b), a roll number that's the right shape but outside that range never gets returned as a roll number at all — it just looks like "no roll number found." The bot still has a separate "out of range" reply path (calling isRegistered() on whatever extractRollNumber() returns), but with the current parser that branch will essentially never trigger, since anything extractRollNumber() hands back is already guaranteed in-range. Both checks are left in bot.js since it's harmless and matches what was asked for, but worth knowing about if you want to simplify it later.

## How I tested it

Each module was tested independently before wiring into the bot:

- qr.js: ran `node qr.js path/to/image.png` directly (the P1c standalone test block) against a generated test QR image, and against a plain image with no QR — confirmed it logs the decoded string in the first case and logs the thrown 'No QR code found' error in the second.
- parser.js: tested extractRollNumber() and isRegistered() with hardcoded strings, including the real 02.240266,1,<sig>.iitkidcard format — confirmed it correctly extracts 240266 with no false positives from the base64 signature. Also tested missing roll numbers and out-of-range numbers.
- attendance.js: tested markPresent() with hardcoded roll numbers to confirm first-time marking ({ success: true }), duplicate detection ({ success: false, reason: 'already_marked', timestamp }), and getStats() reporting ({ total, rollNumbers }). Also tested with a missing and a corrupted attendance.json to confirm it starts fresh with {} in both cases.
- Full pipeline: simulated the photo handler's logic end-to-end (decode → extract → check → mark) without an actual Telegram connection, covering: successful mark, duplicate, no QR found, and out-of-range.
- Live test: ran the bot for real against Telegram, sent a real ID card photo, confirmed attendance marking, duplicate detection, /report, and /export all work end-to-end.

## Notes

- attendance.json, .env, and node_modules/ are intentionally not included in the submission.
- Temp images downloaded from Telegram are written to the OS temp directory (os.tmpdir()) and deleted after processing.
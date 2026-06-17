// bot.js
// P4: Telegram bot — I/O only. No attendance/parsing logic lives here.

// P4a: Setup
require('dotenv').config();

const fs = require('fs');
const os = require('os');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const { decodeQR } = require('./qr.js');
const { extractRollNumber, isRegistered } = require('./parser.js');
const { markPresent, getStats, getAllRows } = require('./attendance.js');

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is missing. Create a .env file with BOT_TOKEN=your_token_here (see .env.example).');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('Bot started. Polling for messages...');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Send a photo of an IITK ID card to mark attendance.\nCommands:\n/report - view current attendance\n/export - download attendance as CSV"
  );
});

// P4b + P4c: Photo handler with distinct replies for each failure case.
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Highest-resolution photo is the last item in msg.photo.
    const photoSizes = msg.photo;
    const fileId = photoSizes[photoSizes.length - 1].file_id;

    const localPath = await bot.downloadFile(fileId, os.tmpdir());

    let rawData;
    try {
      rawData = await decodeQR(localPath);
    } catch (decodeErr) {
      // decodeQR throws Error('No QR code found')
      await bot.sendMessage(chatId, 'No QR code found in that image. Please send a clearer photo of the ID card.');
      return;
    } finally {
      fs.unlink(localPath, () => {});
    }

    const rollNumber = extractRollNumber(rawData);

    if (!rollNumber) {
      await bot.sendMessage(chatId, `QR decoded but no registered roll number found in it.\nRaw data: ${rawData}`);
      return;
    }

    if (!isRegistered(rollNumber)) {
      await bot.sendMessage(chatId, `Roll number ${rollNumber} is outside the registered range (240001-240400). Not marked.`);
      return;
    }

    const result = markPresent(rollNumber);

    if (!result.success) {
      await bot.sendMessage(chatId, `Roll number ${rollNumber} was already marked present at ${result.timestamp}. Duplicate ignored.`);
    } else {
      await bot.sendMessage(chatId, `Marked present: ${rollNumber}`);
    }
  } catch (err) {
    console.error('Error processing photo:', err);
    await bot.sendMessage(chatId, 'Something went wrong processing that image. Please try again.');
  }
});

// P4d: /report — total count + roll number list.
bot.onText(/\/report/, async (msg) => {
  const chatId = msg.chat.id;
  const { total, rollNumbers } = getStats();

  if (total === 0) {
    await bot.sendMessage(chatId, 'No students marked present yet.');
    return;
  }

  await bot.sendMessage(chatId, `Present: ${total} student(s)\n${rollNumbers.join(', ')}`);
});

// BONUS: /export — build CSV manually (RollNumber,Timestamp), send as a document.
bot.onText(/\/export/, async (msg) => {
  const chatId = msg.chat.id;
  const rows = getAllRows();

  if (rows.length === 0) {
    await bot.sendMessage(chatId, 'No attendance data to export yet.');
    return;
  }

  const header = ['RollNumber', 'Timestamp'];
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n');

  const exportPath = path.join(os.tmpdir(), `attendance_export_${Date.now()}.csv`);
  fs.writeFileSync(exportPath, csv, 'utf8');

  await bot.sendDocument(chatId, exportPath);

  fs.unlink(exportPath, (err) => {
    if (err) console.error('Failed to delete temp export file:', err);
  });
});

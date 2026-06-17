// qr.js
// P1: QR Decoder
//
// NOTE on the QR string: I tested this with a synthetic QR I generated
// myself (I don't have access to a real IITK ID card), shaped like:
// Name:JohnDoe;Roll:240123;Branch:CSE;Year:2024
// Scan YOUR real card and confirm this file + parser.js still work against
// its actual raw string before submitting. See parser.js for the same note.

const Jimp = require('jimp');
const jsQR = require('jsqr');

/**
 * P1a + P1b: Decode a QR code from an image file.
 * @param {string} imagePath - path to a local image file (jpg/png).
 * @returns {Promise<string>} the raw decoded string.
 * @throws {Error} 'No QR code found' if no QR code is detected in the image.
 */
async function decodeQR(imagePath) {
  const image = await Jimp.read(imagePath);

  const { data, width, height } = image.bitmap;

  const result = jsQR(data, width, height);

  if (!result) {
    throw new Error('No QR code found');
  }

  return result.data;
}

// P1c: Standalone test — run `node qr.js <path-to-image>` to test this file alone.
if (require.main === module) {
  const testImagePath = process.argv[2] || './test_id.jpg';

  decodeQR(testImagePath)
    .then((data) => {
      console.log('Decoded QR data:', data);
    })
    .catch((err) => {
      console.error('Error:', err.message);
    });
}

module.exports = { decodeQR };

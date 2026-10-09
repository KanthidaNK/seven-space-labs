import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generateQRCode() {
  const lineUrl = 'https://line.me/ti/p/@sevenspacelabs';
  const outputPath1 = path.join(process.cwd(), 'public', 'image.png');
  const outputPath2 = path.join(process.cwd(), 'public', 'line-qr.png');

  // Generate crisp black QR code with high error correction
  const buffer = await QRCode.toBuffer(lineUrl, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 2,
    width: 600,
    color: {
      dark: '#111827',
      light: '#FFFFFF'
    }
  });

  fs.writeFileSync(outputPath1, buffer);
  fs.writeFileSync(outputPath2, buffer);
  console.log('High-res QR code saved to /public/image.png and /public/line-qr.png');
}

generateQRCode();

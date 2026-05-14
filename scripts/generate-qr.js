const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Replace with your actual domain after deployment
const URL = 'https://chaurasiya-mobile-review.vercel.app'; 

const generateQR = async (text) => {
  try {
    const filePath = path.join(__dirname, 'qr-code.png');
    await QRCode.toFile(filePath, text, {
      color: {
        dark: '#2563eb', // Blue to match theme
        light: '#ffffff'
      },
      width: 500,
      margin: 2
    });
    console.log('QR Code generated successfully at:', filePath);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
};

generateQR(URL);

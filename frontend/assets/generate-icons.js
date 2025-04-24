const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create SVG content for QR code scanner icon
const createQRScannerSVG = (color = '#3B82F6', size = 512) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size / 8}" fill="white"/>
    <rect x="${size / 8}" y="${size / 8}" width="${size * 3 / 4}" height="${size * 3 / 4}" rx="${size / 16}" stroke="${color}" stroke-width="${size / 16}" />
    <rect x="${size / 4}" y="${size / 4}" width="${size / 2}" height="${size / 2}" rx="${size / 32}" stroke="${color}" stroke-width="${size / 32}" stroke-dasharray="${size / 16}" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 8}" fill="${color}" />
    <path d="M${size / 8} ${size * 3 / 8}L${size / 4} ${size * 3 / 8}" stroke="${color}" stroke-width="${size / 32}" />
    <path d="M${size * 3 / 8} ${size / 8}L${size * 3 / 8} ${size / 4}" stroke="${color}" stroke-width="${size / 32}" />
    <path d="M${size * 7 / 8} ${size * 5 / 8}L${size * 3 / 4} ${size * 5 / 8}" stroke="${color}" stroke-width="${size / 32}" />
    <path d="M${size * 5 / 8} ${size * 7 / 8}L${size * 5 / 8} ${size * 3 / 4}" stroke="${color}" stroke-width="${size / 32}" />
  </svg>`;
};

// Create SVG content for splash icon
const createSplashIconSVG = (color = '#3B82F6', size = 512) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size / 8}" fill="white"/>
    <rect x="${size / 6}" y="${size / 6}" width="${size * 2 / 3}" height="${size * 2 / 3}" rx="${size / 12}" stroke="${color}" stroke-width="${size / 12}" />
    <rect x="${size / 3}" y="${size / 3}" width="${size / 3}" height="${size / 3}" rx="${size / 24}" stroke="${color}" stroke-width="${size / 24}" stroke-dasharray="${size / 12}" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 10}" fill="${color}" />
    <text x="${size / 2}" y="${size * 5 / 6}" font-family="Arial" font-size="${size / 12}" fill="${color}" text-anchor="middle" font-weight="bold">QR Code Scanner Pro</text>
  </svg>`;
};

// Create SVG content for adaptive icon
const createAdaptiveIconSVG = (color = '#3B82F6', size = 512) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="white"/>
    <rect x="${size / 6}" y="${size / 6}" width="${size * 2 / 3}" height="${size * 2 / 3}" rx="${size / 16}" stroke="${color}" stroke-width="${size / 16}" />
    <rect x="${size / 3}" y="${size / 3}" width="${size / 3}" height="${size / 3}" rx="${size / 32}" stroke="${color}" stroke-width="${size / 32}" stroke-dasharray="${size / 16}" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 8}" fill="${color}" />
  </svg>`;
};

// Create SVG content for favicon
const createFaviconSVG = (color = '#3B82F6', size = 64) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size / 8}" fill="white"/>
    <rect x="${size / 8}" y="${size / 8}" width="${size * 3 / 4}" height="${size * 3 / 4}" rx="${size / 16}" stroke="${color}" stroke-width="${size / 16}" />
    <rect x="${size / 4}" y="${size / 4}" width="${size / 2}" height="${size / 2}" rx="${size / 32}" stroke="${color}" stroke-width="${size / 32}" stroke-dasharray="${size / 16}" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 8}" fill="${color}" />
  </svg>`;
};

// Ensure assets directory exists
const assetsDir = path.join(__dirname);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate icon.png (1024x1024)
const iconSvg = createQRScannerSVG('#3B82F6', 1024);
const iconSvgPath = path.join(assetsDir, 'icon.svg');
fs.writeFileSync(iconSvgPath, iconSvg);
sharp(Buffer.from(iconSvg))
  .png()
  .toFile(path.join(assetsDir, 'icon.png'))
  .then(() => console.log('Generated icon.png'))
  .catch((err) => console.error('Error generating icon.png:', err));

// Generate adaptive-icon.png (1024x1024)
const adaptiveIconSvg = createAdaptiveIconSVG('#3B82F6', 1024);
const adaptiveIconSvgPath = path.join(assetsDir, 'adaptive-icon.svg');
fs.writeFileSync(adaptiveIconSvgPath, adaptiveIconSvg);
sharp(Buffer.from(adaptiveIconSvg))
  .png()
  .toFile(path.join(assetsDir, 'adaptive-icon.png'))
  .then(() => console.log('Generated adaptive-icon.png'))
  .catch((err) => console.error('Error generating adaptive-icon.png:', err));

// Generate splash-icon.png (2048x2048)
const splashIconSvg = createSplashIconSVG('#3B82F6', 2048);
const splashIconSvgPath = path.join(assetsDir, 'splash-icon.svg');
fs.writeFileSync(splashIconSvgPath, splashIconSvg);
sharp(Buffer.from(splashIconSvg))
  .png()
  .toFile(path.join(assetsDir, 'splash-icon.png'))
  .then(() => console.log('Generated splash-icon.png'))
  .catch((err) => console.error('Error generating splash-icon.png:', err));

// Generate favicon.png (64x64)
const faviconSvg = createFaviconSVG('#3B82F6', 64);
const faviconSvgPath = path.join(assetsDir, 'favicon.svg');
fs.writeFileSync(faviconSvgPath, faviconSvg);
sharp(Buffer.from(faviconSvg))
  .png()
  .toFile(path.join(assetsDir, 'favicon.png'))
  .then(() => console.log('Generated favicon.png'))
  .catch((err) => console.error('Error generating favicon.png:', err));

console.log('SVG files saved to:', assetsDir);

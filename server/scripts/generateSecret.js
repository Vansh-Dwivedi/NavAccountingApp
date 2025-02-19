const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a secure random string
const secret = crypto.randomBytes(64).toString('hex');

// Read the current .env file
const envPath = path.join(__dirname, '..', '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace the JWT_SECRET line
envContent = envContent.replace(
  /JWT_SECRET=.*/,
  `JWT_SECRET=${secret}`
);

// Write back to .env file
fs.writeFileSync(envPath, envContent);

console.log('New JWT_SECRET generated and updated in .env file');
console.log('Please restart your server for the changes to take effect');

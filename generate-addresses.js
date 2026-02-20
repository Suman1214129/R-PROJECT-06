// Run this with: node generate-addresses.js
const algosdk = require('algosdk');

// Generate 5 valid Algorand addresses
for (let i = 1; i <= 5; i++) {
  const account = algosdk.generateAccount();
  console.log(`seller-${i}: ${account.addr}`);
}

// scratch/update_app_js.cjs
// Script to sync 569 schemes into js/app.js

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../php_db/schemes_seed.json');
const appJsPath = path.join(__dirname, '../js/app.js');

const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
console.log(`Loaded ${seedData.length} unique schemes from seed.`);

let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// 1. Update headers in app.js
appJsContent = appJsContent.replace(/160 Major Schemes/g, `${seedData.length} Government Schemes`);
appJsContent = appJsContent.replace(/160 प्रमुख योजनाएं/g, `${seedData.length} शासकीय योजना`);
appJsContent = appJsContent.replace(/160 महत्त्वाच्या योजना/g, `${seedData.length} महत्त्वाच्या योजना`);

// 2. Replace INITIAL_SCHEMES_DATA in app.js
const startIndex = appJsContent.indexOf('const INITIAL_SCHEMES_DATA = [');
const endIndex = appJsContent.indexOf('// --- INITIALIZATION ---');

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find INITIAL_SCHEMES_DATA boundaries in js/app.js");
  process.exit(1);
}

const formattedJson = JSON.stringify(seedData, null, 2);
const newBlock = `const INITIAL_SCHEMES_DATA = ${formattedJson};\n\n`;

const updatedContent = appJsContent.slice(0, startIndex) + newBlock + appJsContent.slice(endIndex);

fs.writeFileSync(appJsPath, updatedContent, 'utf8');
console.log(`Updated js/app.js successfully with all ${seedData.length} schemes!`);

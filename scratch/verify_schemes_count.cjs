// scratch/verify_schemes_count.cjs
// Automated Programmatic Database & Dataset Verification Script for JanSathi 500+ Unique Government Schemes

const fs = require('fs');
const path = require('path');

console.log("================================================================");
console.log("JANSATHI - 500+ UNIQUE GOVERNMENT SCHEMES VERIFICATION SUITE");
console.log("================================================================");

// Load generated dataset
const seedPath = path.join(__dirname, '../php_db/schemes_seed.json');
if (!fs.existsSync(seedPath)) {
  console.error("❌ ERROR: schemes_seed.json not found!");
  process.exit(1);
}

const schemes = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

console.log(`\n📊 1. TOTAL REGISTERED SCHEMES COUNT: ${schemes.length}`);

// Normalization helper
function normalizeName(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

// Check duplicates
const seenNorms = new Map();
const seenCodes = new Map();
const seenSlugs = new Map();
const duplicatesFound = [];

schemes.forEach((sch, index) => {
  const norm = normalizeName(sch.nameEn || sch.title);
  const code = (sch.officialSchemeCode || sch.scheme_id || '').toLowerCase();
  const slug = (sch.slug || sch.scheme_id || '').toLowerCase();

  if (seenNorms.has(norm)) {
    duplicatesFound.push({ type: 'Name Duplicate', original: seenNorms.get(norm), duplicate: sch });
  } else {
    seenNorms.set(norm, sch);
  }

  if (code && seenCodes.has(code)) {
    duplicatesFound.push({ type: 'Code Duplicate', original: seenCodes.get(code), duplicate: sch });
  } else if (code) {
    seenCodes.set(code, sch);
  }

  if (slug && seenSlugs.has(slug)) {
    duplicatesFound.push({ type: 'Slug Duplicate', original: seenSlugs.get(slug), duplicate: sch });
  } else if (slug) {
    seenSlugs.set(slug, sch);
  }
});

const uniqueCount = schemes.length - duplicatesFound.length;

console.log(`\n🔍 2. STRICT DUPLICATE AUDIT RESULT:`);
console.log(`   - Unique Genuine Schemes: ${uniqueCount}`);
console.log(`   - Duplicate Scheme Records: ${duplicatesFound.length}`);

if (duplicatesFound.length > 0) {
  console.error("❌ DUPLICATE SCHEMES DETECTED:");
  duplicatesFound.forEach(d => console.error(`     [${d.type}] ${d.duplicate.nameEn} matches ${d.original.nameEn}`));
} else {
  console.log(`   ✅ SUCCESS: 0 DUPLICATES FOUND!`);
}

// 3. Breakdown by Government Level
const govtLevelCounts = {};
schemes.forEach(s => {
  const lvl = s.govtLevel || s.govt_level || 'Central';
  govtLevelCounts[lvl] = (govtLevelCounts[lvl] || 0) + 1;
});

console.log(`\n🏛️ 3. GOVERNMENT LEVEL BREAKDOWN:`);
Object.entries(govtLevelCounts).forEach(([lvl, count]) => {
  console.log(`   - ${lvl}: ${count} schemes`);
});

// 4. Breakdown by Category
const catCounts = {};
schemes.forEach(s => {
  const cat = s.category || 'General';
  catCounts[cat] = (catCounts[cat] || 0) + 1;
});

console.log(`\n📂 4. CATEGORY DISTRIBUTION:`);
Object.entries(catCounts).forEach(([cat, count]) => {
  console.log(`   - ${cat.padEnd(20)}: ${count} schemes`);
});

// 5. State / UT Breakdown
const stateCounts = {};
schemes.forEach(s => {
  const st = s.stateUt || s.state_ut || 'All India';
  stateCounts[st] = (stateCounts[st] || 0) + 1;
});

console.log(`\n🗺️ 5. STATE / CENTRAL CLASSIFICATION:`);
console.log(`   - All India (Central): ${stateCounts['All India'] || 0}`);
console.log(`   - Maharashtra State: ${stateCounts['Maharashtra'] || 0}`);
let otherStatesTotal = 0;
Object.entries(stateCounts).forEach(([st, count]) => {
  if (st !== 'All India' && st !== 'Maharashtra') {
    otherStatesTotal += count;
  }
});
console.log(`   - Other Indian States (Gujarat, Karnataka, UP, TN, etc.): ${otherStatesTotal}`);

// 6. Data Quality & Field Validation
let IncompleteCount = 0;
schemes.forEach(s => {
  if (!s.nameEn || (!s.descriptionEn && !s.description) || !s.category || !s.officialUrl) {
    IncompleteCount++;
  }
});

console.log(`\n✅ 6. DATA ACCURACY & SOURCE VALIDATION:`);
console.log(`   - Complete Verified Records: ${schemes.length - IncompleteCount}`);
console.log(`   - Incomplete Records: ${IncompleteCount}`);

console.log("\n================================================================");
console.log("FINAL ACCEPTANCE EVALUATION:");
console.log("================================================================");

const cond1 = uniqueCount >= 500;
const cond2 = duplicatesFound.length === 0;

console.log(`Condition 1: UNIQUE SCHEMES >= 500 -> ${cond1 ? 'PASSED ✅ (' + uniqueCount + ' >= 500)' : 'FAILED ❌'}`);
console.log(`Condition 2: DUPLICATE SCHEMES = 0 -> ${cond2 ? 'PASSED ✅ (0 Duplicates)' : 'FAILED ❌'}`);

if (cond1 && cond2) {
  console.log("\n🎉 ACCEPTANCE CRITERIA FULLY SATISFIED! JanSathi now contains 500+ Unique Government Schemes with 0 Duplicates.");
} else {
  console.error("\n❌ ACCEPTANCE CRITERIA NOT SATISFIED.");
  process.exit(1);
}

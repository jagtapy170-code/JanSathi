// src/utils/duplicateDetector.js
// Multi-Level Duplicate Detection Engine for Government Schemes

/**
 * Level 1: Normalize string by lowercasing, removing punctuation, hyphens, and whitespace.
 */
export function normalizeSchemeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F]/g, ' ') // Preserve English & Devanagari characters
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strip common noise stop words to compare core scheme subject.
 */
export function extractCoreTokens(name) {
  const norm = normalizeSchemeName(name);
  const stopWords = new Set([
    'yojana', 'scheme', 'pradhan', 'mantri', 'pm', 'govt', 'government', 'maharashtra',
    'state', 'central', 'national', 'rashtriya', 'mukhyamantri', 'yojna', 'karyakram',
    'shasan', 'bharat', 'yojane', 'subsidy', 'grant', 'bima', 'kisan'
  ]);
  
  return norm
    .split(' ')
    .filter(token => token.length > 1 && !stopWords.has(token));
}

/**
 * Levenshtein distance computation between two strings
 */
export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Similarity percentage (0 to 100)
 */
export function calculateSimilarity(str1, str2) {
  const norm1 = normalizeSchemeName(str1);
  const norm2 = normalizeSchemeName(str2);

  if (norm1 === norm2) return 100;
  if (!norm1 || !norm2) return 0;

  const distance = levenshteinDistance(norm1, norm2);
  const maxLength = Math.max(norm1.length, norm2.length);
  const levSimilarity = ((maxLength - distance) / maxLength) * 100;

  // Token overlap similarity
  const tokens1 = extractCoreTokens(str1);
  const tokens2 = extractCoreTokens(str2);

  if (tokens1.length > 0 && tokens2.length > 0) {
    const intersection = tokens1.filter(t => tokens2.includes(t));
    const tokenOverlap = (intersection.length * 2) / (tokens1.length + tokens2.length) * 100;
    
    // Combine Levenshtein and Token overlap
    return Math.max(levSimilarity, tokenOverlap);
  }

  return levSimilarity;
}

/**
 * Level 1 & Level 2 Duplicate Checker
 * Returns match classification and list of potential duplicates
 */
export function checkDuplicateScheme(newScheme, existingSchemes, threshold = 85) {
  const newNorm = normalizeSchemeName(newScheme.nameEn || newScheme.title || newScheme.nameMr || newScheme.nameHi);
  const newCode = (newScheme.officialSchemeCode || newScheme.scheme_id || '').toLowerCase();
  const newUrl = (newScheme.officialUrl || newScheme.link || '').toLowerCase().trim();

  const matches = [];

  for (const item of existingSchemes) {
    const existingNorm = normalizeSchemeName(item.nameEn || item.title || item.nameMr || item.nameHi);
    const existingCode = (item.officialSchemeCode || item.scheme_id || '').toLowerCase();
    const existingUrl = (item.officialUrl || item.link || '').toLowerCase().trim();

    // Check Level 1: Exact matches
    if (newNorm && newNorm === existingNorm) {
      matches.push({ scheme: item, similarity: 100, reason: 'Exact Name Match' });
      continue;
    }
    if (newCode && existingCode && newCode === existingCode) {
      matches.push({ scheme: item, similarity: 100, reason: 'Exact Scheme ID/Code Match' });
      continue;
    }
    if (newUrl && newUrl !== '#' && existingUrl && existingUrl !== '#' && newUrl === existingUrl) {
      matches.push({ scheme: item, similarity: 98, reason: 'Exact Official Portal URL Match' });
      continue;
    }

    // Check Level 2: Similarity matching
    const sim = calculateSimilarity(newScheme.nameEn || newScheme.title || '', item.nameEn || item.title || '');
    if (sim >= threshold) {
      matches.push({ scheme: item, similarity: Math.round(sim), reason: `High Similarity (${Math.round(sim)}%)` });
    }
  }

  matches.sort((a, b) => b.similarity - a.similarity);

  return {
    isDuplicate: matches.length > 0 && matches[0].similarity >= threshold,
    highestMatch: matches[0] || null,
    allMatches: matches
  };
}

/**
 * Comprehensive Duplicate Audit of full database
 */
export function runDatabaseDuplicateAudit(schemesList) {
  const auditResults = {
    totalSchemes: schemesList.length,
    exactDuplicates: [],
    highSimilarity: [],
    possibleDuplicates: [],
    uniqueCount: 0
  };

  const processed = new Set();

  for (let i = 0; i < schemesList.length; i++) {
    const schemeA = schemesList[i];
    if (processed.has(schemeA.id || schemeA.scheme_id)) continue;

    for (let j = i + 1; j < schemesList.length; j++) {
      const schemeB = schemesList[j];
      const sim = calculateSimilarity(schemeA.nameEn || schemeA.title, schemeB.nameEn || schemeB.title);

      if (sim === 100) {
        auditResults.exactDuplicates.push({ pair: [schemeA, schemeB], score: 100 });
      } else if (sim >= 90) {
        auditResults.highSimilarity.push({ pair: [schemeA, schemeB], score: Math.round(sim) });
      } else if (sim >= 75) {
        auditResults.possibleDuplicates.push({ pair: [schemeA, schemeB], score: Math.round(sim) });
      }
    }
  }

  auditResults.uniqueCount = schemesList.length - auditResults.exactDuplicates.length;
  return auditResults;
}

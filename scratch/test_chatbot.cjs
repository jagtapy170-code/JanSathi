const http = require('http');

const testCases = [
  { name: "1. English Query", payload: { message: "Which scholarship schemes are available for students?", language: "auto" } },
  { name: "2. Marathi Query", payload: { message: "विद्यार्थ्यांसाठी कोणत्या शिष्यवृत्ती योजना उपलब्ध आहेत?", language: "auto" } },
  { name: "3. Hindi Query", payload: { message: "छात्रों के लिए कौन सी छात्रवृत्ति योजनाएं उपलब्ध हैं?", language: "auto" } },
  { name: "4. Hinglish / Mixed Query", payload: { message: "Mujhe farmer scheme aur PM kisan chahiye", language: "auto" } },
  { name: "5. Marathlish Query", payload: { message: "Mala scholarship sathi eligibility kay aahe?", language: "auto" } }
];

async function runTests() {
  console.log("=== JANSAHAYAK MULTILINGUAL CHATBOT API TEST RESULTS ===");
  for (const test of testCases) {
    const data = JSON.stringify(test.payload);
    await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: '/api/chatbot',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            console.log(`\n[${test.name}]`);
            console.log(`Query: ${test.payload.message}`);
            console.log(`Detected Language: ${parsed.language}`);
            console.log(`Intent: ${parsed.intent}`);
            console.log(`Reply:\n${parsed.reply}`);
          } catch(e) {
            console.log(`Error parsing response: ${body}`);
          }
          resolve();
        });
      });
      req.on('error', (err) => {
        console.log(`Error: ${err.message}`);
        resolve();
      });
      req.write(data);
      req.end();
    });
  }
}

runTests();

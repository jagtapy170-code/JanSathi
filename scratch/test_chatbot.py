import urllib.request
import json

url = "http://localhost:8080/api/chatbot"

test_cases = [
    {
        "name": "1. English Query",
        "payload": {"message": "Which scholarship schemes are available for students?", "language": "auto"}
    },
    {
        "name": "2. Marathi Query",
        "payload": {"message": "विद्यार्थ्यांसाठी कोणत्या शिष्यवृत्ती योजना उपलब्ध आहेत?", "language": "auto"}
    },
    {
        "name": "3. Hindi Query",
        "payload": {"message": "छात्रों के लिए कौन सी छात्रवृत्ति योजनाएं उपलब्ध हैं?", "language": "auto"}
    },
    {
        "name": "4. Hinglish / Mixed Query",
        "payload": {"message": "Mujhe farmer scheme aur PM kisan chahiye", "language": "auto"}
    },
    {
        "name": "5. Marathlish Query",
        "payload": {"message": "Mala scholarship sathi eligibility kay aahe?", "language": "auto"}
    }
]

print("=== JANSAHAYAK MULTILINGUAL CHATBOT API TEST RESULTS ===")
for test in test_cases:
    data = json.dumps(test["payload"]).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode("utf-8"))
            print(f"\n[{test['name']}]")
            print(f"Query: {test['payload']['message']}")
            print(f"Detected Language: {res.get('language')}")
            print(f"Intent: {res.get('intent')}")
            print(f"Response:\n{res.get('reply')}")
    except Exception as e:
        print(f"Error in {test['name']}: {e}")

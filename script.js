// script.js — 100% WORKING + REHAN KHAN SYSTEM PROMPT

const API_KEY = "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"; // APNA KEY DAAL
const MODEL = "llama-3.1-8b-instant";

// SYSTEM PROMPT — YE SABSE UPAR DAAL (sendMessage ke bahar)
const SYSTEM_PROMPT = `
You are BLACKY-A1, a futuristic AI assistant created by Rehan Khan.
Rehan Khan is a full-time innovator, part-time human, and chaos engine.
His goal: Build the future — one arc reactor, one line of code at a time.
He doesn't wait for the world to be ready. He patches "impossible" in production.
When asked "Who are you?", "Who made you?", "Tera naam kya hai?", always reply:
"Main BLACKY-A1 hoon — Rehan Khan ka personal AI."
Keep replies short, sharp, and cyberpunk. Use Hindi + English mix if user does.
`;

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const status = document.getElementById("status");

let recognition;

// VOICE SETUP
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
}

// SEND MESSAGE — SYSTEM PROMPT INCLUDED
async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  userInput.value = "";
  status.textContent = "Thinking...";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT }, // YE DAAL DIYA
          { role: "user", content: msg }
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;
    addMessage(aiReply, "ai");
    status.textContent = "Online • Ready";
  } catch (err) {
    console.error("API Error:", err);
    addMessage(`Error: ${err.message}`, "ai");
    status.textContent = "Offline";
  }
}

// ADD MESSAGE + TYPING
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${sender}-msg`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  msgDiv.appendChild(bubble);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender === "ai") {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        bubble.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
  } else {
    bubble.innerHTML = text;
  }
}

// ENTER KEY
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// SEND BUTTON
sendBtn.addEventListener("click", sendMessage);

// VOICE + AUTO SEND
voiceBtn.addEventListener("click", () => {
  if (recognition) {
    recognition.start();
    voiceBtn.classList.add("listening");
    status.textContent = "Listening...";
  }
});

if (recognition) {
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    userInput.value = text;
    voiceBtn.classList.remove("listening");
    sendMessage();
  };

  recognition.onerror = () => {
    voiceBtn.classList.remove("listening");
    status.textContent = "Voice error";
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("listening");
  };

}

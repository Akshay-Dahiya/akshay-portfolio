/* CURSOR */
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2,
  dx: (Math.random() - 0.5),
  dy: (Math.random() - 0.5)
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00f2ff";
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* REVEAL */
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

/* CHATBOT */
const chatbot = document.getElementById("chatbot");
document.getElementById("chatbot-toggle").onclick = () => {
  chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
};

let OPENAI_API_KEY = localStorage.getItem("openai_api_key");

function saveApiKey() {
  const key = document.getElementById("apiKeyInput").value.trim();
  if (!key.startsWith("sk-")) {
    alert("Invalid API key");
    return;
  }
  localStorage.setItem("openai_api_key", key);
  OPENAI_API_KEY = key;
  addMessage("✅ API key saved. You can chat now!", "bot-msg");
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  if (!OPENAI_API_KEY) {
    addMessage("⚠️ Please paste your OpenAI API key first.", "bot-msg");
    return;
  }

  addMessage(message, "user-msg");
  input.value = "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Akshay Dahiya's portfolio AI assistant. Answer professionally."
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  addMessage(data.choices[0].message.content, "bot-msg");
}

function addMessage(text, cls) {
  const msg = document.createElement("div");
  msg.className = cls;
  msg.innerText = text;
  document.getElementById("chatbot-body").appendChild(msg);
  document.getElementById("chatbot-body").scrollTop = 9999;
}

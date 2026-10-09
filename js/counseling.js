// ============ pages/counselor.js (student) — v1 yellow blinkit theme ============
const DEMO = true; // ← flip to false once Supabase keys + accounts are ready

const REPLIES = [
  "Thanks for telling me. I've made a note — I'll reply properly by tonight. You're not alone in this. 💛",
  "That makes sense. Let's take it one small step at a time — what feels like the biggest part right now?",
  "I hear you. Want to meet in person for 10 minutes? Room 204, tomorrow after lunch. Or we can keep going right here."
];

(async () => {
  let profile = DEMO ? { name: "Arun Kumar", class_name: "3A", reg_no: "23EC01" }
                     : await requireRole(["student"]);
  if (!profile) return;
  const first = profile.name.split(" ")[0];

  document.getElementById("side-name").textContent = profile.name;
  document.getElementById("side-class").textContent = `Class ${profile.class_name} • ${profile.reg_no}`;
  document.getElementById("today").textContent = new Date().toDateString();

  const chat = document.getElementById("chat");
  const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const add = (who, text) => {
    const b = document.createElement("div");
    b.className = "bubble " + who;
    b.innerHTML = `${text}<div style="font-size:10px;opacity:.6;margin-top:4px">${who === "mine" ? "You" : "Prof. Meera"} · ${now()}</div>`;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  };

  const start = [
    ["theirs", `Hi ${first}! I'm Prof. Meera 👋 What's on your mind today? (Anything works — attendance, stress, career, family...)`],
    ["theirs", "By the way, I noticed you've been asking about Control Systems doubts. Want to talk about it?"],
    ["mine", "Actually, I've been anxious about my IA-II. Everything feels like it's falling apart."],
    ["theirs", "That's really brave of you to say. Let's take it one step at a time — what's the hardest part?"]
  ];
  start.forEach(([w, t]) => add(w, t));

  let ri = 0;
  const send = () => {
    const inp = document.getElementById("msg");
    const t = inp.value.trim();
    if (!t) return;
    add("mine", t);
    inp.value = "";
    setTimeout(() => { add("theirs", REPLIES[ri % REPLIES.length]); ri++; }, 900);
  };
  document.getElementById("send-msg").addEventListener("click", send);
  document.getElementById("msg").addEventListener("keydown", e => { if (e.key === "Enter") send(); });

  document.querySelectorAll("#topics li").forEach(li => {
    li.addEventListener("click", () => {
      const inp = document.getElementById("msg");
      inp.value = li.dataset.t;
      inp.focus();
    });
  });

  attachLogout();
})();
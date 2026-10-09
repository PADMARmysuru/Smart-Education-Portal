// ============ pages/doubts.js (student) — v1 yellow blinkit theme ============
const DEMO = true; // ← flip to false once Supabase keys + accounts are ready

const SAMPLE = {
  name: "Arun Kumar", cls: "Class 3A • 23EC01",
  subjects: {
    "Control Systems": ["Transfer Functions", "Stability Analysis", "Root Locus", "Bode Plots"],
    "Networks": ["Nodal Analysis", "Mesh Analysis", "AC Circuits", "Resonance"],
    "Signals & Systems": ["Sampling Theorem", "Fourier Series", "Z-Transform"],
    "Math-II": ["Laplace Transforms", "Partial Fractions", "Numerical Methods"],
    "DBMS": ["Normalization", "SQL Queries", "Transactions"]
  },
  doubts: [
    { subject: "Control Systems", topic: "Stability Analysis", q: "Routh-Hurwitz — when an entire row becomes zero, what do I actually do?", taps: 7, when: "2 days ago" },
    { subject: "Networks", topic: "AC Circuits", q: "Phasor domain vs time domain — when exactly should I switch?", taps: 6, when: "3 days ago" },
    { subject: "Signals & Systems", topic: "Sampling Theorem", q: "What happens at EXACTLY half the sampling frequency? Nyquist says nothing about it?", taps: 5, when: "4 days ago" },
    { subject: "Math-II", topic: "Laplace Transforms", q: "Why does the Final Value Theorem fail when there's a pole on the imaginary axis?", taps: 4, when: "5 days ago" },
    { subject: "DBMS", topic: "Normalization", q: "Is 3NF enough, or will they really ask BCNF in placement interviews?", taps: 3, when: "1 week ago" }
  ]
};

const timeAgo = iso => {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 3600) return "an hour ago";
  if (s < 86400) return "a day ago";
  return Math.floor(s / 86400) + " days ago";
};

(async () => {
  let d;
  let profile = DEMO ? { name: SAMPLE.name, class_name: "3A", reg_no: "23EC01" }
                     : await requireRole(["student"]);
  if (!profile) return;

  if (!DEMO) {
    const { data: rows } = await supabase.from("doubts").select("subject,topic,question,created_at").order("created_at", { ascending: false }).limit(10);
    d = {
      name: profile.name,
      cls: `Class ${profile.class_name} • ${profile.reg_no}`,
      subjects: SAMPLE.subjects,
      doubts: (rows || []).map(r => ({ subject: r.subject, topic: r.topic, q: r.question, taps: 1, when: timeAgo(r.created_at) }))
    };
    document.getElementById("sample-badge").style.display = "none";
  } else {
    d = SAMPLE;
  }

  document.getElementById("side-name").textContent = d.name;
  document.getElementById("side-class").textContent = d.cls;
  document.getElementById("today").textContent = new Date().toDateString();

  document.getElementById("k-open").textContent = d.doubts.length;
  const hot = {};
  d.doubts.forEach(x => { hot[x.subject + " • " + x.topic] = (hot[x.subject + " • " + x.topic] || 0) + x.taps; });
  document.getElementById("k-hot").textContent = Object.values(hot).filter(n => n >= 5).length;

  const selS = document.getElementById("subject");
  const selT = document.getElementById("topic");
  selS.innerHTML = Object.keys(d.subjects).map(s => `<option>${s}</option>`).join("");
  const fillTopics = () => { selT.innerHTML = d.subjects[selS.value].map(t => `<option>${t}</option>`).join(""); };
  selS.addEventListener("change", fillTopics);
  fillTopics();

  const render = list => {
    document.getElementById("doubt-list").innerHTML = list.map(x => `
      <div class="note-item">
        <div class="note-title"><span style="background:#fff3c0;color:#7a5b00;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800">${x.subject}</span> ${x.topic} — "${x.q}"</div>
        <div class="note-body">👆 ${x.taps} student${x.taps > 1 ? "s" : ""} asked something similar · ${x.when}</div>
      </div>`).join("");
  };
  render(d.doubts);

  document.getElementById("send").addEventListener("click", async () => {
    const q = document.getElementById("q").value.trim();
    const ok = document.getElementById("ok-note");
    if (!q) { ok.textContent = "Type your doubt first 🙂"; ok.style.color = "#c62828"; return; }
    if (!DEMO) { await supabase.from("doubts").insert({ subject: selS.value, topic: selT.value, question: q }); }
    d.doubts.unshift({ subject: selS.value, topic: selT.value, q, taps: 1, when: "just now" });
    render(d.doubts);
    document.getElementById("k-open").textContent = d.doubts.length;
    document.getElementById("q").value = "";
    ok.style.color = "";
    ok.textContent = "Sent anonymously ✅ — your name was never attached. (The doubts table has no name column — it's in the schema!)";
  });

  attachLogout();
})();
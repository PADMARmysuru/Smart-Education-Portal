// ============ pages/events.js (student) — v1 yellow blinkit theme ============
const DEMO = true; // ← flip to false once Supabase keys + accounts are ready

const SAMPLE = {
  name: "Arun Kumar", cls: "Class 3A • 23EC01",
  events: [
    { icon: "🏆", title: "HackNext 3.0 — 24h Hackathon", deadline: "2026-10-15", url: "#" },
    { icon: "💡", title: "IEEE Workshop: Embedded Systems", deadline: "2026-10-16", url: "#" },
    { icon: "🤖", title: "Robotics Club Open Day", deadline: "2026-10-22", url: "#" },
    { icon: "🏏", title: "Gymkhana: Cricket Trials", deadline: "2026-10-24", url: "#" },
    { icon: "💼", title: "Placement Cell: Resume Workshop", deadline: "2026-10-28", url: "#" },
    { icon: "❤️", title: "CCF: Blood Donation Camp", deadline: "2026-10-29", url: "#" },
    { icon: "🇮", title: "Smart India Hackathon — Internal Round", deadline: "2026-10-30", url: "#" },
    { icon: "🎆", title: "Tech Fest: Vidyuth", deadline: "2026-11-10", url: "#" }
  ]
};

const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

(async () => {
  let d;
  let profile = DEMO ? { name: SAMPLE.name, class_name: "3A", reg_no: "23EC01" }
                     : await requireRole(["student"]);
  if (!profile) return;

  if (!DEMO) {
    const { data: evs } = await supabase.from("events").select("title,deadline,apply_url").order("deadline");
    d = {
      name: profile.name,
      cls: `Class ${profile.class_name} • ${profile.reg_no}`,
      events: evs.map(e => ({ icon: "🎪", title: e.title, deadline: e.deadline, url: e.apply_url }))
    };
    document.getElementById("sample-badge").style.display = "none";
  } else {
    d = SAMPLE;
  }

  document.getElementById("side-name").textContent = d.name;
  document.getElementById("side-class").textContent = d.cls;
  document.getElementById("today").textContent = new Date().toDateString();

  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  const daysLeft = dl => Math.ceil((new Date(dl + "T00:00:00") - today0) / 86400000);

  document.getElementById("k-events").textContent = d.events.length;
  document.getElementById("k-week").textContent = d.events.filter(e => { const n = daysLeft(e.deadline); return n >= 0 && n <= 7; }).length;

  const meta = e => {
    const n = daysLeft(e.deadline);
    if (n < 0) return `Apply by ${fmtDate(e.deadline)} · <span class="danger">closed</span>`;
    if (n === 0) return `Apply by ${fmtDate(e.deadline)} · <span class="danger">today!</span>`;
    if (n <= 2) return `Apply by ${fmtDate(e.deadline)} · <span class="danger">${n} days left</span>`;
    return `Apply by ${fmtDate(e.deadline)} · ${n} days left`;
  };

  const render = list => {
    document.getElementById("events-list").innerHTML = list.length ? list.map(e => `
      <div class="event-row">
        <div><div class="event-title">${e.icon} ${e.title}</div><div class="event-meta">${meta(e)}</div></div>
        <a class="btn-apply" href="${e.url}" target="_blank">Apply Now</a>
      </div>`).join("")
      : `<div class="note-item"><div class="note-title">No events match your search 🔍</div></div>`;
  };

  render(d.events);

  document.getElementById("search").addEventListener("input", ev => {
    const q = ev.target.value.toLowerCase();
    render(d.events.filter(e => e.title.toLowerCase().includes(q)));
  });

  const week = d.events.filter(e => daysLeft(e.deadline) <= 7).sort((a, b) => a.deadline.localeCompare(b.deadline));
  document.getElementById("week-list").innerHTML = week.length ? week.map(e => `
    <div class="event-row">
      <div><div class="event-title">${e.icon} ${e.title}</div><div class="event-meta">${meta(e)}</div></div>
      <a class="btn-apply" href="${e.url}" target="_blank">Apply</a>
    </div>`).join("")
    : `<div class="note-item"><div class="note-title">🎉 Nothing due this week</div></div>`;

  attachLogout();
})();
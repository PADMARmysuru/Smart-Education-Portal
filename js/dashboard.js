// ============ pages/faculty-dashboard.js — v1 yellow blinkit theme ============
const DEMO = true; // ← flip to false once Supabase keys + accounts are ready

const SAMPLE = {
  name: "Prof. Anand", cls: "Class 3A • ECE",
  weekDoubts: 12,
  students: [
    { name: "Arun Kumar",  reg: "23EC01", total: 40, attended: 38 },
    { name: "Ben Thomas",  reg: "23EC02", total: 40, attended: 38 },
    { name: "Chandni Singh", reg: "23EC03", total: 40, attended: 39 },
    { name: "Deepa Rani",  reg: "23EC04", total: 40, attended: 30 },
    { name: "Eshwar Reddy", reg: "23EC05", total: 40, attended: 38 },
    { name: "Farhana Khan", reg: "23EC06", total: 40, attended: 38 },
    { name: "Gokul Raj",   reg: "23EC07", total: 40, attended: 38 },
    { name: "Harini N",    reg: "23EC08", total: 40, attended: 39 },
    { name: "Jasleen Kaur", reg: "23EC09", total: 40, attended: 32 },
    { name: "Kiran Kumar", reg: "23EC10", total: 40, attended: 38 }
  ],
  topics: [
    { name: "Control Systems • Stability Analysis", count: 7 },
    { name: "Networks • AC Circuits", count: 6 },
    { name: "Signals • Sampling Theorem", count: 5 },
    { name: "Math-II • Laplace Transforms", count: 4 },
    { name: "DBMS • Normalization", count: 3 }
  ],
  certs: [
    { year: 2025, title: "NAAC A+ Accreditation (Re-accredited)", tag: "NAAC" },
    { year: 2024, title: "NBA Accreditation — ECE (3 years)", tag: "NBA" },
    { year: 2025, title: "Smart India Hackathon — Finalist", tag: "SIH" },
    { year: 2025, title: "IEEE Student Branch — Active Chapter", tag: "IEEE" },
    { year: 2024, title: "Vidyuth Tech Fest — Best College", tag: "College" },
    { year: 2024, title: "NSS National Award", tag: "NSS" }
  ]
};

(async () => {
  let d;
  let profile = DEMO ? { name: SAMPLE.name, class_name: "3A" }
                     : await requireRole(["faculty", "hod"]);
  if (!profile) return;

  if (!DEMO) {
    const { data: studs } = await supabase.from("students").select("id,name,reg_no,class_name").eq("class_name", profile.class_name || "3A");
    const { data: recs } = await supabase.from("attendance_records").select("student_id,present");
    const byUid = {};
    (recs || []).forEach(r => { (byUid[r.student_id] = byUid[r.student_id] || []).push(r.present ? 1 : 0); });
    const { data: doubts } = await supabase.from("doubts").select("subject,topic");
    const byTopic = {};
    (doubts || []).forEach(x => { const k = x.subject + " • " + x.topic; byTopic[k] = (byTopic[k] || 0) + 1; });
    const { data: certs } = await supabase.from("certificates").select("year,title,tag");
    d = {
      name: profile.name,
      cls: `Class ${profile.class_name || "3A"} • ECE`,
      weekDoubts: (doubts || []).length,
      students: (studs || []).map(s => {
        const arr = byUid[s.id] || [];
        return { name: s.name, reg: s.reg_no, total: arr.length, attended: arr.filter(Boolean).length };
      }),
      topics: Object.entries(byTopic).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      certs: (certs || []).map(c => ({ year: c.year, title: c.title, tag: c.tag || "Other" }))
    };
    document.getElementById("sample-badge").style.display = "none";
  } else {
    d = SAMPLE;
  }

  document.getElementById("side-name").textContent = d.name;
  document.getElementById("side-class").textContent = d.cls;
  document.getElementById("today").textContent = new Date().toDateString();

  const rows = d.students.map(s => ({ ...s, pct: s.total ? Math.round(s.attended / s.total * 100) : 0 })).sort((a, b) => a.pct - b.pct);
  const statusOf = pct => pct < 75 ? ["cell-red", "Below 75%"] : pct < 85 ? ["cell-orange", "At Risk"] : ["cell-green", "Safe"];

  document.getElementById("k-students").textContent = d.students.length;
  document.getElementById("k-irregular").textContent = rows.filter(r => r.pct < 85).length;
  document.getElementById("k-doubts").textContent = d.weekDoubts;
  document.getElementById("k-certs").textContent = d.certs.length;

  document.querySelector("#watch-table tbody").innerHTML = rows.map(r => {
    const [cls, label] = statusOf(r.pct);
    return `<tr class="${r.pct < 75 ? "row-danger" : ""}">
      <td style="font-weight:700">${r.name}</td>
      <td class="muted">${r.reg}</td>
      <td><span class="cell-blue">${r.attended}/${r.total}</span></td>
      <td><span class="${cls}">${r.pct}%</span></td>
      <td><span class="${cls}">${label}</span></td>
    </tr>`;
  }).join("");

  const max = Math.max(...d.topics.map(t => t.count), 1);
  document.getElementById("topic-bars").innerHTML = d.topics.map(t => `
    <div class="bar-row">
      <div class="bar-label"><span>${t.name}</span><span>${t.count} doubts</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(t.count / max * 100)}%"></div></div>
    </div>`).join("") + `<p class="muted" style="margin-top:10px">🕶️ Names are never stored with doubts — only subject + topic. That's why you can see this with a clear conscience.</p>`;

  document.getElementById("cert-list").innerHTML = d.certs.map(c => `
    <div class="event-row">
      <div><div class="event-title">🏅 ${c.title}</div><div class="event-meta">${c.year} · ${c.tag}</div></div>
    </div>`).join("");

  document.getElementById("report-btn").addEventListener("click", () => {
    document.getElementById("rep-note").textContent = "🧪 Demo: the printable 1-page report opens in the next build step. Final version: one click → print → Save as PDF (NAAC/NBA-ready).";
  });

  attachLogout();
})();
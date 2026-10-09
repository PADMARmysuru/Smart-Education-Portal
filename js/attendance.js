// ============ pages/attendance.js (student) — v1 yellow blinkit theme ============
const DEMO = true; // ← flip to false once Supabase keys + accounts are ready

const SAMPLE = {
  name: "Arun Kumar", cls: "Class 3A • 23EC01",
  total: 40, attended: 38,
  months: [
    { m: "July", pct: 92 },
    { m: "August", pct: 95 },
    { m: "September", pct: 97 },
    { m: "October", pct: 96 }
  ],
  absences: [
    { date: "28 Aug", subject: "Mathematics-II" },
    { date: "12 Sep", subject: "Control Systems Lab" }
  ]
};

const GREEN = "#558b2f", AMBER = "#f9a825";

(async () => {
  let d;
  let profile = DEMO ? { name: SAMPLE.name, class_name: "3A", reg_no: "23EC01" }
                     : await requireRole(["student"]);
  if (!profile) return;

  if (!DEMO) {
    const uid = (await supabase.auth.getUser()).data.user.id;
    const { data: recs } = await supabase.from("attendance_records").select("day,present").eq("student_id", uid).order("day");
    const byMonth = {};
    (recs || []).forEach(r => {
      const k = new Date(r.day + "T00:00:00").toLocaleString("en", { month: "long" });
      (byMonth[k] = byMonth[k] || []).push(r.present ? 1 : 0);
    });
    d = {
      total: recs.length,
      attended: recs.filter(r => r.present).length,
      months: Object.entries(byMonth).map(([m, arr]) => ({ m, pct: Math.round(arr.filter(Boolean).length / arr.length * 100) })),
      absences: recs.filter(r => !r.present).slice(-5).map(r => ({
        date: new Date(r.day + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        subject: "Class"
      }))
    };
    document.getElementById("sample-badge").style.display = "none";
  } else {
    d = SAMPLE;
  }

  document.getElementById("side-name").textContent = d.name;
  document.getElementById("side-class").textContent = d.cls;
  document.getElementById("today").textContent = new Date().toDateString();

  const pct = Math.round((d.attended / d.total) * 100);
  const absent = d.total - d.attended;
  const afford = Math.floor((d.attended - 0.75 * d.total) / 0.75);

  document.getElementById("k-total").textContent = d.total;
  document.getElementById("k-pct").textContent = pct + "%";
  document.getElementById("k-abs").textContent = absent;
  const kaff = document.getElementById("k-afford");
  kaff.textContent = afford < 0 ? "SHORT 🚨" : String(afford);
  if (afford < 0) kaff.classList.add("danger");

  document.getElementById("m-bars").innerHTML = d.months.map(m => `
    <div class="bar-row">
      <div class="bar-label"><span>${m.m}</span><span>${m.pct}%</span></div>
      <div class="bar-track"><div class="bar-fill ${m.pct < 80 ? "gold" : ""}" style="width:${m.pct}%"></div></div>
    </div>`).join("");

  document.getElementById("donut").style.background = `conic-gradient(${GREEN} 0 ${pct}%, ${AMBER} ${pct}% 100%)`;
  document.getElementById("donut-pct").textContent = pct + "%";
  document.getElementById("lg-p").textContent = d.attended;
  document.getElementById("lg-a").textContent = absent;
  const sw = document.querySelectorAll(".legend i");
  if (sw.length === 2) { sw[0].style.background = GREEN; sw[1].style.background = AMBER; }

  document.getElementById("abs-list").innerHTML = d.absences.length
    ? d.absences.map(a => `
      <div class="event-row">
        <div class="event-title">🚫 ${a.date}</div>
        <div class="event-meta">${a.subject}</div>
      </div>`).join("")
    : `<div class="note-item"><div class="note-title">🎉 No absences — perfect semester!</div></div>`;

  document.getElementById("rule-num").textContent = afford < 0 ? "BELOW ⚠️" : String(afford);
  document.getElementById("rule-text").textContent = afford < 0
    ? "You are under 75% now. Talk to your counselor early — the counselor chat is one tap away."
    : `You can miss ${afford} more classes and still stay at or above 75% attendance.`;

  attachLogout();
})();
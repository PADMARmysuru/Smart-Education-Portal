// ============ pages/faculty-report.js — printable HOD report ============
const STUDENTS = [
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
];

const TOPICS = [
  { name: "Control Systems • Stability Analysis", count: 7 },
  { name: "Networks • AC Circuits", count: 6 },
  { name: "Signals • Sampling Theorem", count: 5 },
  { name: "Math-II • Laplace Transforms", count: 4 },
  { name: "DBMS • Normalization", count: 3 }
];

const CERTS = [
  { year: 2025, title: "NAAC A+ Accreditation (Re-accredited)", tag: "NAAC" },
  { year: 2024, title: "NBA Accreditation — ECE (3 years)", tag: "NBA" },
  { year: 2025, title: "Smart India Hackathon — Finalist", tag: "SIH" },
  { year: 2025, title: "IEEE Student Branch — Active Chapter", tag: "IEEE" },
  { year: 2024, title: "Vidyuth Tech Fest — Best College", tag: "College" },
  { year: 2024, title: "NSS National Award", tag: "NSS" }
];

document.getElementById("rep-meta").innerHTML =
  `Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}<br>Period: Jul – Oct 2026<br>Data: Sample (demo mode)`;

const rows = STUDENTS
  .map(s => ({ ...s, pct: Math.round((s.attended / s.total) * 100) }))
  .sort((a, b) => b.pct - a.pct);

const statusOf = pct => pct < 75 ? ["cell-red", "Below 75%"] : pct < 85 ? ["cell-orange", "At Risk"] : ["cell-green", "Safe"];

document.getElementById("s-avg").textContent = (rows.reduce((a, r) => a + r.pct, 0) / rows.length).toFixed(1) + "%";
document.getElementById("s-safe").textContent = `${rows.filter(r => r.pct >= 85).length}/${rows.length}`;
document.getElementById("s-doubts").textContent = TOPICS.reduce((a, t) => a + t.count, 0);
document.getElementById("s-certs").textContent = CERTS.length;

document.querySelector("#rep-table tbody").innerHTML = rows.map(r => {
  const [cls, label] = statusOf(r.pct);
  return `<tr>
    <td style="font-weight:700">${r.name}</td>
    <td>${r.reg}</td>
    <td>${r.attended}/${r.total}</td>
    <td><b>${r.pct}%</b></td>
    <td><span class="${cls}">${label}</span></td>
  </tr>`;
}).join("");

const actionOf = n => n >= 6 ? "Re-teach in next class" : n >= 4 ? "Clarify in doubt session" : "Monitor";
document.getElementById("rep-topics").innerHTML = TOPICS.map((t, i) => `
  <tr><td>${i + 1}</td><td style="font-weight:700">${t.name}</td><td><b>${t.count}</b></td><td>${actionOf(t.count)}</td></tr>`).join("");

document.getElementById("rep-certs").innerHTML = CERTS.map(c => `
  <tr><td>${c.year}</td><td style="font-weight:700">${c.title}</td><td>${c.tag}</td></tr>`).join("");
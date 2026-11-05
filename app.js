const $ = (id) => document.getElementById(id);
const shuffle = (xs) => xs.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

const KEY = "motion_study";
const st = JSON.parse(localStorage.getItem(KEY)) ?? { pid: crypto.randomUUID().slice(0, 8), order: shuffle(TRIALS.map((t) => t.id)), results: [] };
const save = () => localStorage.setItem(KEY, JSON.stringify(st));
save();

const trials = st.order.map((id) => TRIALS.find((t) => t.id === id));
const results = st.results;
const pid = st.pid;
let idx = results.length, t0 = 0;

function media(el, src) {
  el.innerHTML = src
    ? `<video src="${src}" autoplay loop muted playsinline></video>`
    : `<span class="placeholder">motion</span>`;
}

function show() {
  const t = trials[idx];
  media($("left"), t.a);
  media($("right"), t.b);
  $("counter").textContent = `${idx + 1} / ${trials.length}`;
  $("bar").style.width = `${(100 * idx) / trials.length}%`;
  t0 = performance.now();
}

function pick(side) {
  const t = trials[idx];
  results.push({ trial: t.id, choice: side === "left" ? "A" : "B", time_ms: Math.round(performance.now() - t0) });
  save();
  idx++;
  if (idx < trials.length) return show();
  finish();
}

function finish() {
  $("study").classList.add("hidden");
  $("done").classList.remove("hidden");
  submit();
}

async function submit() {
  const rows = results.map((r) => ({ participant: pid, ...r }));
  try {
    const res = await fetch(`${DB_URL}/rest/v1/results`, {
      method: "POST",
      headers: { apikey: DB_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    localStorage.removeItem(KEY);
    $("status").textContent = "Your answers have been submitted. You can close this page.";
  } catch (err) {
    $("status").textContent = "Submission failed. Please contact the study organizer.";
    console.error(err, rows);
  }
}

if (idx > 0) $("start").textContent = "Continue";
$("start").onclick = () => {
  $("intro").classList.add("hidden");
  $("study").classList.remove("hidden");
  idx < trials.length ? show() : finish();
};
document.querySelectorAll(".option").forEach((b) => (b.onclick = () => pick(b.dataset.side)));
document.addEventListener("keydown", (e) => {
  if ($("study").classList.contains("hidden")) return;
  if (["a", "A", "ArrowLeft"].includes(e.key)) pick("left");
  if (["b", "B", "ArrowRight"].includes(e.key)) pick("right");
});

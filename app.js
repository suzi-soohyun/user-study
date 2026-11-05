const $ = (id) => document.getElementById(id);
const shuffle = (xs) => xs.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

const trials = shuffle(TRIALS).map((t) => (Math.random() < 0.5 ? { id: t.id, l: t.a, r: t.b } : { id: t.id, l: t.b, r: t.a }));
const results = [];
const pid = crypto.randomUUID().slice(0, 8);
let idx = 0, t0 = 0;

function media(el, m) {
  el.innerHTML = m.src
    ? `<video src="${m.src}" autoplay loop muted playsinline></video>`
    : `<span class="placeholder">motion</span>`;
}

function show() {
  const t = trials[idx];
  media($("left"), t.l);
  media($("right"), t.r);
  $("counter").textContent = `${idx + 1} / ${trials.length}`;
  $("bar").style.width = `${(100 * idx) / trials.length}%`;
  t0 = performance.now();
}

function pick(side) {
  const t = trials[idx];
  const [win, lose] = side === "left" ? [t.l, t.r] : [t.r, t.l];
  results.push({ trial: t.id, left: t.l.method, right: t.r.method, choice: side === "left" ? "A" : "B", chosen: win.method, other: lose.method, time_ms: Math.round(performance.now() - t0) });
  idx++;
  if (idx < trials.length) return show();
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
    $("status").textContent = "Your answers have been submitted. You can close this page.";
  } catch (err) {
    $("status").textContent = "Submission failed. Please contact the study organizer.";
    console.error(err, rows);
  }
}

$("start").onclick = () => {
  $("intro").classList.add("hidden");
  $("study").classList.remove("hidden");
  show();
};
document.querySelectorAll(".option").forEach((b) => (b.onclick = () => pick(b.dataset.side)));
document.addEventListener("keydown", (e) => {
  if ($("study").classList.contains("hidden")) return;
  if (["a", "A", "ArrowLeft"].includes(e.key)) pick("left");
  if (["b", "B", "ArrowRight"].includes(e.key)) pick("right");
});

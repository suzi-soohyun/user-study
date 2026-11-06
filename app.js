const $ = (id) => document.getElementById(id);

const ADJ = ["brave", "calm", "happy", "swift", "bright", "gentle", "lucky", "quiet", "bold", "clever", "sunny", "witty"];
const ANIMAL = ["otter", "panda", "fox", "koala", "tiger", "eagle", "dolphin", "rabbit", "owl", "lion", "penguin", "whale"];
const any = (xs) => xs[Math.floor(Math.random() * xs.length)];
const randomName = () => `${any(ADJ)}-${any(ANIMAL)}-${Math.floor(Math.random() * 1000)}`;

const KEY = "motion_study";
const order = TRIALS.map((t) => t.id);
const LABELS = ["disc_low", "disc_high"];
const flip = () => LABELS[Math.floor(Math.random() * 2)];
const fresh = () => ({ pid: randomName(), order, left: order.map(flip), results: [] });
const stored = JSON.parse(localStorage.getItem(KEY));
const valid = JSON.stringify(stored?.order) === JSON.stringify(order) && stored.left?.length === order.length;
const st = valid ? stored : fresh();
const save = () => localStorage.setItem(KEY, JSON.stringify(st));
save();

const trials = st.order.map((id) => TRIALS.find((t) => t.id === id));
const results = st.results;
const pid = st.pid;
const other = (l) => LABELS.find((x) => x !== l);
const label = (side) => (side === "left" ? st.left[idx] : other(st.left[idx]));
const sample = (src) => src.split("/").pop().replace(/^[ab]_|\.\w+$/g, "");
let idx = results.length, t0 = 0, sel = null;

function media(el, src) {
  if (!src) el.innerHTML = `<span class="placeholder">motion</span>`;
  else if (src.endsWith(".gif")) el.innerHTML = `<img src="${src}" alt="motion">`;
  else el.innerHTML = `<video src="${src}" autoplay loop muted playsinline></video>`;
}

function show() {
  const t = trials[idx];
  media($("left"), t[st.left[idx]]);
  media($("right"), t[other(st.left[idx])]);
  $("counter").textContent = `${idx + 1} / ${trials.length}`;
  $("bar").style.width = `${(100 * idx) / trials.length}%`;
  const r = results[idx];
  select(r ? (r.choice === r.left_label ? "left" : "right") : null);
  $("next").textContent = idx === trials.length - 1 ? "Submit" : "Next";
  const pair = document.querySelector(".pair");
  pair.classList.remove("fade");
  void pair.offsetWidth;
  pair.classList.add("fade");
  t0 = performance.now();
}

function select(side) {
  sel = side;
  document.querySelectorAll(".option").forEach((b) => b.classList.toggle("selected", b.dataset.side === side));
  $("next").disabled = !side;
}

function next() {
  if (!sel) return;
  const ms = Math.round(performance.now() - t0) + (results[idx]?.time_ms ?? 0);
  const t = trials[idx], c = label(sel);
  results[idx] = { trial: t.id, choice: c, sample: sample(t[c]), left_label: st.left[idx], time_ms: ms };
  save();
  idx++;
  if (idx < trials.length) return show();
  finish();
}

function back() {
  if (idx > 0) {
    idx--;
    return show();
  }
  $("study").classList.add("hidden");
  $("intro").classList.remove("hidden");
}

function finish() {
  $("study").classList.add("hidden");
  $("done").classList.remove("hidden");
  submit();
}

async function submit() {
  const rows = results.map((r) => ({ username: pid, ...r }));
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

$("n").textContent = trials.length;
if (idx > 0) $("start").textContent = "Continue";
$("start").onclick = () => {
  $("intro").classList.add("hidden");
  $("study").classList.remove("hidden");
  idx < trials.length ? show() : finish();
};
document.querySelectorAll(".option").forEach((b) => (b.onclick = () => select(b.dataset.side)));
$("next").onclick = next;
$("back").onclick = back;
document.addEventListener("keydown", (e) => {
  if (["Enter", " "].includes(e.key)) e.preventDefault();
});

// Supabase project settings (Project Settings -> API). See setup.sql.
const DB_URL = "";
const DB_KEY = "";

// Each trial compares two motions. Replace `src` with video paths (e.g. "videos/001_ours.mp4").
// Leave `src` empty to show the "motion" placeholder.
const TRIALS = [
  { id: "001", a: { method: "ours", src: "" }, b: { method: "baseline", src: "" } },
  { id: "002", a: { method: "ours", src: "" }, b: { method: "baseline", src: "" } },
  { id: "003", a: { method: "ours", src: "" }, b: { method: "baseline", src: "" } },
  { id: "004", a: { method: "ours", src: "" }, b: { method: "gt", src: "" } },
  { id: "005", a: { method: "baseline", src: "" }, b: { method: "gt", src: "" } },
];

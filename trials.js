// Supabase project settings (Project Settings -> API). See setup.sql.
const DB_URL = "https://aqdhhrvitajoroxcmguw.supabase.co";
const DB_KEY = "sb_publishable_voHeVJ69s6UuwcMXg646ag_GThZ3j5_";

// Each trial pairs the motion with the lower and the higher discriminator score (gif or video paths).
// Left/right placement is randomised per participant.
const TRIALS = [
  { id: "local1", disc_low: "result/cropped/local1/a_2057_30.gif", disc_high: "result/cropped/local1/b_3960_7.gif" },
  { id: "local2", disc_low: "result/cropped/local2/a_5053_2.gif", disc_high: "result/cropped/local2/b_5091_7.gif" },
  { id: "local3", disc_low: "result/cropped/local3/a_1342_5.gif", disc_high: "result/cropped/local3/b_908_33.gif" },
  { id: "local4", disc_low: "result/cropped/local4/a_5210_24.gif", disc_high: "result/cropped/local4/b_1307_10.gif" },
  { id: "local5", disc_low: "result/cropped/local5/a_5240_23.gif", disc_high: "result/cropped/local5/b_3953_6.gif" },
  { id: "global1", disc_low: "result/cropped/global1/a_1776_16.gif", disc_high: "result/cropped/global1/b_5261_23.gif" },
  { id: "global2", disc_low: "result/cropped/global2/a_5226_48.gif", disc_high: "result/cropped/global2/b_1449_0.gif" },
  { id: "global3", disc_low: "result/cropped/global3/a_183_23.gif", disc_high: "result/cropped/global3/b_725_22.gif" },
  { id: "global4", disc_low: "result/cropped/global4/a_5043_24.gif", disc_high: "result/cropped/global4/b_3352_14.gif" },
  { id: "global5", disc_low: "result/cropped/global5/a_1424_47.gif", disc_high: "result/cropped/global5/b_2831_25.gif" },
];

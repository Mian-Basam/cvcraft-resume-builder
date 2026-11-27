// The 80-concept template collection, one file per category. Each category file exports `layouts`,
// entries in the same shape as the base layouts in ../index.js (plus `collection`, the category name).
import { layouts as minimal } from "./minimal";
import { layouts as luxury } from "./luxury";
import { layouts as corporate } from "./corporate";
import { layouts as creative } from "./creative";
import { layouts as tech } from "./tech";
import { layouts as editorial } from "./editorial";
import { layouts as infographic } from "./infographic";
import { layouts as futuristic } from "./futuristic";
import { layouts as playful } from "./playful";
import { layouts as special } from "./special";

export const COLLECTIONS = [
  ["minimal", "Minimal & modern"],
  ["luxury", "Premium & luxury"],
  ["corporate", "Corporate & executive"],
  ["creative", "Creative & design"],
  ["tech", "Tech & AI"],
  ["editorial", "Editorial & magazine"],
  ["infographic", "Infographic & visual"],
  ["futuristic", "Futuristic & experimental"],
  ["playful", "Fun & personality"],
  ["special", "Special formats"],
];

// Entries missing a component (e.g. a file still being written) are skipped rather than breaking every page.
export const collectionLayouts = [...minimal, ...luxury, ...corporate, ...creative, ...tech, ...editorial, ...infographic, ...futuristic, ...playful, ...special].filter(
  (l) => l && l.id && typeof l.component === "function",
);

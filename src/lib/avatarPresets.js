// Ready-made avatars for the builder. Each is a starting point the user can customise.
// The shirt colour is not stored: avatars always wear the template's accent colour.
const S = ["#fbe0cc", "#f2c6a0", "#e2aa7e", "#c68a5c", "#9a6440", "#6b4329"];
const H = { black: "#1f1a17", dark: "#3b2a20", brown: "#6b4423", auburn: "#a8692f", blond: "#d9b26f", grey: "#b8b8b8", red: "#b5452f" };

const f = (skin, hair, hairStyle, outfit, extra = {}) => ({ variant: "female", skin: S[skin], hair, hairStyle, outfit, expression: "smile", glasses: "none", beard: "none", freckles: false, eyes: "#6b4226", ...extra });
const m = (skin, hair, hairStyle, outfit, extra = {}) => ({ variant: "male", skin: S[skin], hair, hairStyle, outfit, expression: "smile", glasses: "none", beard: "none", freckles: false, eyes: "#6b4226", ...extra });

export const FEMALE_PRESETS = [
  f(1, H.dark, "wavy", "wrap", { glasses: "round", earrings: false }),
  f(2, H.black, "bob", "knit", { expression: "calm" }),
  f(0, H.blond, "long", "tshirt", { eyes: "#4a7bb0" }),
  f(1, H.black, "bob", "blazer", { glasses: "round" }),
  f(2, H.brown, "ponytail", "hoodie", { expression: "grin" }),
  f(3, H.dark, "curly", "shirt"),
  f(4, H.black, "afro", "turtleneck", { expression: "grin" }),
  f(5, H.black, "braids", "tshirt"),
  f(2, "#5b6b8c", "hijab", "blazer"),
  f(1, H.auburn, "bun", "turtleneck", { expression: "calm", glasses: "square" }),
  f(0, H.red, "wavy", "tshirt", { expression: "grin", freckles: true, eyes: "#4f8a5b" }),
  f(3, H.black, "long", "shirt", { expression: "calm", glasses: "sun" }),
  f(4, H.dark, "bob", "hoodie"),
  f(4, "#8c4a5b", "hijab", "tshirt", { expression: "grin" }),
  f(1, H.grey, "short", "blazer", { glasses: "round" }),
  f(5, H.dark, "ponytail", "blazer"),
  f(2, H.dark, "wavy", "hoodie", { eyes: "#8a6a3a" }),
  f(3, H.black, "bun", "shirt", { expression: "grin" }),
];

export const MALE_PRESETS = [
  m(2, H.black, "quiff", "polo", { glasses: "square", beard: "full", expression: "calm" }),
  m(1, H.brown, "short", "knit", { beard: "stubble" }),
  m(1, H.brown, "short", "hoodie"),
  m(1, H.blond, "sidepart", "blazer", { eyes: "#4a7bb0" }),
  m(2, H.black, "spiky", "hoodie", { expression: "grin" }),
  m(4, H.black, "buzz", "tshirt", { beard: "stubble" }),
  m(5, H.black, "afro", "shirt", { expression: "grin" }),
  m(3, H.dark, "curly", "turtleneck", { glasses: "round" }),
  m(2, H.grey, "bald", "blazer", { beard: "beard", expression: "calm" }),
  m(3, "#2c3e7a", "turban", "shirt", { beard: "beard" }),
  m(0, H.grey, "sidepart", "blazer", { glasses: "square", beard: "moustache", expression: "calm", eyes: "#6b7d8c" }),
  m(5, H.black, "short", "hoodie", { beard: "goatee" }),
  m(1, H.brown, "bun", "tshirt", { beard: "beard" }),
  m(0, H.red, "spiky", "tshirt", { expression: "grin", freckles: true, eyes: "#4f8a5b" }),
  m(3, H.black, "buzz", "blazer", { glasses: "sun" }),
  m(4, H.black, "curly", "tshirt", { expression: "grin" }),
  m(1, H.brown, "long", "shirt", { beard: "beard", expression: "calm" }),
  m(2, H.dark, "short", "turtleneck", { glasses: "round", beard: "stubble" }),
];

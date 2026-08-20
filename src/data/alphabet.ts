import type { GlyphSymbol } from "../types/glyph";
import { NEUTRAL_CLASS } from "../types/glyph";

export const ALPHABET: GlyphSymbol[] = [
  { classId: "OMEGA", glyph: "Ω", meaning: "A" },
  { classId: "RUNA", glyph: "ᚱ", meaning: "E" },
  { classId: "SOL", glyph: "☉", meaning: "I" },
  { classId: "DELTA", glyph: "Δ", meaning: "O" },
  { classId: "INFINITO", glyph: "∞", meaning: "U" },
  { classId: "LUA", glyph: "☾", meaning: " ", isSpecial: true },
  { classId: "ENXOFRE", glyph: "🜏", meaning: "S" },
  { classId: "MIRA", glyph: "⌖", meaning: "R" },
  { classId: "TERRA", glyph: "⏚", meaning: "N" },
  { classId: "VESTA", glyph: "⚶", meaning: "T" },
  { classId: "NO", glyph: "⌘", meaning: "M" },
  { classId: "CUNHA", glyph: "⏄", meaning: "D" },
];

export const NEUTRAL_SYMBOL: GlyphSymbol = {
  classId: NEUTRAL_CLASS,
  glyph: "·",
  meaning: "",
  isSpecial: true,
};

export function findSymbol(classId: string): GlyphSymbol | undefined {
  if (classId === NEUTRAL_CLASS) return NEUTRAL_SYMBOL;
  return ALPHABET.find((s) => s.classId === classId);
}
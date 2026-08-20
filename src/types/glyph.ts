export interface Prediction {
  className: string;
  probability: number;
}

export interface GlyphSymbol {
  classId: string;      
  glyph: string;        
  meaning: string;      
  isSpecial?: boolean;    
}

export const NEUTRAL_CLASS = "NEUTRO";

export const CONFIDENCE_THRESHOLD = 0.8;

export const STABILITY_WINDOW_MS = 900;

// Resultado bruto de uma predição do modelo Teachable Machine
export interface Prediction {
  className: string;
  probability: number;
}

// Um símbolo do alfabeto GLYPH: liga o rótulo da classe treinada
// a um caractere/ação no "idioma" decodificado
export interface GlyphSymbol {
  classId: string;      // precisa bater EXATAMENTE com o nome da classe no Teachable Machine
  glyph: string;        // o caractere visual (Ω, ᚱ, ☉...) — só para exibição
  meaning: string;       // o que ele vira na mensagem decodificada (uma letra, espaço, etc.)
  isSpecial?: boolean;    // true para separador/espaço, não conta como "letra"
}

export const NEUTRAL_CLASS = "NEUTRO";

// Limiar mínimo de confiança para considerar uma predição válida.
// Ver dica do enunciado: evita ações disparando com ruído/baixa confiança.
export const CONFIDENCE_THRESHOLD = 0.8;

// Tempo mínimo (ms) que o mesmo símbolo precisa ficar estável antes de
// ser aceito — evita registrar o mesmo símbolo várias vezes por segundo
// e evita "piscar" entre classes parecidas.
export const STABILITY_WINDOW_MS = 900;

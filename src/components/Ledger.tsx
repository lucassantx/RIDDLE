import type { GlyphSymbol } from "../types/glyph";

interface CapturedEntry {
  id: number;
  symbol: GlyphSymbol;
}

interface LedgerProps {
  entries: CapturedEntry[];
  onReset: () => void;
}

export function Ledger({ entries, onReset }: LedgerProps) {
  const decoded = entries.map((e) => e.symbol.meaning).join("");

  return (
    <div className="ledger">
      <div className="ledger-head">
        <span className="ledger-eyebrow">SÍMBOLOS DECIFRADOS</span>
        <button className="ledger-reset" onClick={onReset} type="button">
          reiniciar
        </button>
      </div>

      <div className="ledger-specimens">
        {entries.length === 0 && (
          <p className="ledger-empty">
            aguardando o primeiro símbolo...
          </p>
        )}
        {entries.map((entry) => (
          <div
            className="specimen-stamp"
            key={entry.id}
          >
            <span className="specimen-glyph">{entry.symbol.glyph}</span>
            <span className="specimen-index">Nº {String(entry.id).padStart(3, "0")}</span>
          </div>
        ))}
      </div>

      <div className="ledger-decoded">
        <span className="ledger-eyebrow">MENSAGEM</span>
        <p className="decoded-text">{decoded || "?"}</p>
      </div>
    </div>
  );
}


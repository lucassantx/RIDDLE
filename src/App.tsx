import { useRef, useState } from "react";
import { useClassifierLoop } from "./hooks/useClassifierLoop";
import { findSymbol, NEUTRAL_SYMBOL } from "./data/alphabet";
import type { GlyphSymbol } from "./types/glyph";
import { NEUTRAL_CLASS } from "./types/glyph";
import { ScanPane } from "./components/ScanPane";
import { Ledger } from "./components/Ledger";
import "./glyph.css";

interface CapturedEntry {
  id: number;
  symbol: GlyphSymbol;
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [entries, setEntries] = useState<CapturedEntry[]>([]);
  const nextId = useRef(1);

  function handleStableSymbol(classId: string) {
    if (classId === NEUTRAL_CLASS) return; // fundo/neutro nunca vira entrada
    const symbol = findSymbol(classId) ?? NEUTRAL_SYMBOL;
    setEntries((prev) => [...prev, { id: nextId.current++, symbol }]);
  }

  const { status, errorMessage, topPrediction } = useClassifierLoop(
    videoRef,
    handleStableSymbol
  );

  return (
    <div className="atlas">
      <header className="atlas-header">
        <span className="atlas-kicker">TRANSMISSÃO NÃO IDENTIFICADA</span>
        <h1 className="atlas-title">RIDDLE</h1>
        <p className="atlas-subtitle">
          decifre a mensagem antes que seja tarde demais.
        </p>
      </header>

      <main className="atlas-grid">
        <ScanPane
          videoRef={videoRef}
          status={status}
          errorMessage={errorMessage}
          topPrediction={topPrediction}
        />
        <div className="ledger-column">
          <Ledger
            entries={entries}
            onReset={() => setEntries([])}
          />
          <div className="meme-slot">
            <img src="/doesheknow.jpg" alt="" className="meme-caption" />
          </div>
        </div>
      </main>

      <footer className="atlas-footer">
        apresente um símbolo à câmera. o sistema fará o resto.
      </footer>
    </div>
  );
}

export default App;
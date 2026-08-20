import React from "react";
import type { Prediction } from "../types/glyph";

interface ScanPaneProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: "loading" | "ready" | "error";
  errorMessage?: string;
  topPrediction: Prediction | null;
}

export function ScanPane({ videoRef, status, errorMessage, topPrediction }: ScanPaneProps) {
  const confidencePct = topPrediction ? Math.round(topPrediction.probability * 100) : 0;

  return (
    <div className="scan-pane">
      <span className="ledger-eyebrow">SCANNER</span>

      <div className="scan-frame">
        <video ref={videoRef} className="scan-video" muted playsInline />
        <div className="scan-corners" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        {status === "loading" && (
          <div className="scan-overlay">carregando modelo de reconhecimento...</div>
        )}
        {status === "error" && (
          <div className="scan-overlay scan-overlay--error">
            erro: {errorMessage}
          </div>
        )}
      </div>

      <div className="scan-reading">
        <div className="scan-reading-row">
          <span>símbolo</span>
          <strong>{topPrediction ? topPrediction.className : "?"}</strong>
        </div>
        <div className="confidence-track">
          <div
            className="confidence-fill"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
        <div className="scan-reading-row scan-reading-row--small">
          <span>confiança</span>
          <strong>{confidencePct}%</strong>
        </div>
      </div>
    </div>
  );
}


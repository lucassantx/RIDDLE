import { useEffect, useRef, useState } from "react";
import { classifyFrame, loadModel } from "../services/classifierService";
import type { Prediction } from "../types/glyph";
import { CONFIDENCE_THRESHOLD, STABILITY_WINDOW_MS } from "../types/glyph";

interface ClassifierLoopState {
  status: "loading" | "ready" | "error";
  errorMessage?: string;
  topPrediction: Prediction | null;
  // Dispara só quando um símbolo fica estável acima do limiar de confiança
  // por STABILITY_WINDOW_MS — essa é a "ação disparada pela predição"
  // exigida pelo enunciado, não um clique manual.
  onStableSymbol: (classId: string) => void;
}

export function useClassifierLoop(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onStableSymbol: (classId: string) => void
): ClassifierLoopState {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [topPrediction, setTopPrediction] = useState<Prediction | null>(null);

  const lastClassRef = useRef<string | null>(null);
  const stableSinceRef = useRef<number>(0);
  const firedRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        // Câmera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 224, height: 224 },
        });
        if (cancelled) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Modelo
        await loadModel();
        if (cancelled) return;

        setStatus("ready");
        loop();
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Falha ao iniciar câmera ou modelo."
        );
      }
    }

    function loop() {
      rafRef.current = requestAnimationFrame(async () => {
        if (cancelled) return;
        if (videoRef.current && videoRef.current.readyState === 4) {
          const predictions = await classifyFrame(videoRef.current);
          const top = predictions[0];
          setTopPrediction(top);
          evaluateStability(top);
        }
        loop();
      });
    }

    function evaluateStability(top: Prediction) {
      const now = performance.now();

      if (top.probability < CONFIDENCE_THRESHOLD) {
        lastClassRef.current = null;
        firedRef.current = false;
        return;
      }

      if (top.className !== lastClassRef.current) {
        lastClassRef.current = top.className;
        stableSinceRef.current = now;
        firedRef.current = false;
        return;
      }

      const heldLongEnough = now - stableSinceRef.current >= STABILITY_WINDOW_MS;
      if (heldLongEnough && !firedRef.current) {
        firedRef.current = true;
        onStableSymbol(top.className);
      }
    }

    setup();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      const stream = videoRef.current?.srcObject as MediaStream | undefined;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, errorMessage, topPrediction, onStableSymbol };
}

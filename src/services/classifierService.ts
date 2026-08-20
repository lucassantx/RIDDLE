import * as tf from "@tensorflow/tfjs";
import type { Prediction } from "../types/glyph";

// Serviço fino em volta do modelo exportado do Teachable Machine (TF.js).
// Depois de exportar em teachablemachine.withgoogle.com, baixem o modelo
// e coloquem model.json + weights.bin + metadata.json em /public/model/
//
// O Teachable Machine gera seu próprio pacote de runtime (tmImage), mas
// aqui carregamos via @tensorflow/tfjs puro para ter tipagem e controle
// explícitos em TypeScript, em vez de depender do script solto que a
// plataforma sugere.

const MODEL_URL = "/model/model.json";
const METADATA_URL = "/model/metadata.json";

let model: tf.LayersModel | null = null;
let classLabels: string[] = [];

export async function loadModel(): Promise<void> {
  model = await tf.loadLayersModel(MODEL_URL);

  const metadataResponse = await fetch(METADATA_URL);
  const metadata = await metadataResponse.json();
  classLabels = metadata.labels as string[];
}

export function isModelLoaded(): boolean {
  return model !== null;
}

// Roda inferência em um frame de vídeo/imagem e devolve as predições
// ordenadas da mais para a menos confiante.
export async function classifyFrame(
  video: HTMLVideoElement
): Promise<Prediction[]> {
  if (!model) throw new Error("Modelo ainda não foi carregado — chame loadModel() primeiro.");

  const scores = tf.tidy(() => {
    const tensor = tf.browser
      .fromPixels(video)
      .resizeBilinear([224, 224]) // tamanho padrão de exportação do Teachable Machine
      .toFloat()
      .div(127.5)
      .sub(1)
      .expandDims(0);

    const output = model!.predict(tensor) as tf.Tensor;
    return output.dataSync();
  });

  const predictions: Prediction[] = classLabels.map((className, i) => ({
    className,
    probability: scores[i],
  }));

  return predictions.sort((a, b) => b.probability - a.probability);
}

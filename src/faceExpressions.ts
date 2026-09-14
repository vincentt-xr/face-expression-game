import { getFaceBlendshape } from "@vincentt-xr/sdk/tracking";
import type { FaceExpression } from "./faceExpressionTypes";

const score = (face: Parameters<typeof getFaceBlendshape>[0], name: Parameters<typeof getFaceBlendshape>[1]) =>
  getFaceBlendshape(face, name);

export const FACE_EXPRESSIONS: FaceExpression[] = [
  { id: "smile", label: "Smile", hint: "Show us your biggest smile", matches: face => score(face, "mouthSmileLeft") > 0.55 && score(face, "mouthSmileRight") > 0.55 },
  { id: "open-mouth", label: "Open Mouth", hint: "Open your mouth wide", matches: face => score(face, "jawOpen") > 0.55 },
  { id: "blink-left", label: "Blink Left", hint: "Close your left eye", matches: face => score(face, "eyeBlinkLeft") > 0.6 },
  { id: "blink-right", label: "Blink Right", hint: "Close your right eye", matches: face => score(face, "eyeBlinkRight") > 0.6 },
  { id: "wide-eyes", label: "Wide Eyes", hint: "Open your eyes wide", matches: face => score(face, "eyeWideLeft") > 0.55 && score(face, "eyeWideRight") > 0.55 },
  { id: "neutral", label: "Neutral Face", hint: "Relax your face", matches: face => ["jawOpen", "mouthSmileLeft", "mouthSmileRight", "eyeBlinkLeft", "eyeBlinkRight"].every(name => score(face, name as Parameters<typeof getFaceBlendshape>[1]) < 0.25) },
];

export const shuffledExpressions = (): FaceExpression[] => [...FACE_EXPRESSIONS].sort(() => Math.random() - 0.5);

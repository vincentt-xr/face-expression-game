import { getFaceActionValue, getFaceBlendshape } from "@vincentt-xr/sdk/tracking";
import type { FaceExpression } from "./faceExpressionTypes";

const score = (face: Parameters<typeof getFaceBlendshape>[0], name: Parameters<typeof getFaceBlendshape>[1]) =>
  getFaceBlendshape(face, name);

// Each round's on-screen label and hint are literal texts in ExpressionGameUI.tsx.
export const FACE_EXPRESSIONS: FaceExpression[] = [
  { id: "smile", matches: face => score(face, "mouthSmileLeft") > 0.55 && score(face, "mouthSmileRight") > 0.55 },
  { id: "open-mouth", matches: face => score(face, "jawOpen") > 0.55 },
  { id: "blink-left", matches: face => getFaceActionValue(face, "eyeBlinkLeft") > 0.6 },
  { id: "blink-right", matches: face => getFaceActionValue(face, "eyeBlinkRight") > 0.6 },
  { id: "wide-eyes", matches: face => score(face, "eyeWideLeft") > 0.55 && score(face, "eyeWideRight") > 0.55 },
  { id: "neutral", matches: face => ["jawOpen", "mouthSmileLeft", "mouthSmileRight", "eyeBlinkLeft", "eyeBlinkRight"].every(name => score(face, name as Parameters<typeof getFaceBlendshape>[1]) < 0.25) },
];

export const shuffledExpressions = (): FaceExpression[] => [...FACE_EXPRESSIONS].sort(() => Math.random() - 0.5);

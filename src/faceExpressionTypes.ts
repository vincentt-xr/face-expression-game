import type { FaceInfo } from "@vincentt-xr/sdk/tracking";

export type GamePhase = "intro" | "playing" | "won" | "game-over";

export type ExpressionFeedback = "correct" | "wrong" | null;

export type ExpressionId =
  | "smile"
  | "open-mouth"
  | "blink-left"
  | "blink-right"
  | "wide-eyes"
  | "neutral";

export type FaceExpression = {
  id: ExpressionId;
  label: string;
  hint: string;
  matches: (face: FaceInfo) => boolean;
};

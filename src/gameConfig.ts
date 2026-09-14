/** Creator-facing controls for the face-expression game. */
export const GAME_CONFIG = {
  startingLives: 3,
  secondsPerExpression: 5,
  expressionHoldMs: 300,
  feedbackDurationMs: 700,
  faceTargetFps: 20,
  animation: {
    frameRate: 15,
    breathingScale: 0.015,
    hintFloatPixels: 4,
    urgentPulseScale: 0.08,
    lifeBounceScale: 0.12,
    feedbackPop: { from: 0.85, peak: 1.08, durationMs: 300 },
    expressionPop: { from: 0.88, peak: 1.06, durationMs: 280 },
    wrongShakePixels: 5,
    wrongShakeDurationMs: 260,
  },
} as const;

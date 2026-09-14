import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceInfo } from "@vincentt-xr/sdk/tracking";
import type { ExpressionFeedback, FaceExpression } from "./faceExpressionTypes";
import { shuffledExpressions } from "./faceExpressions";
import { GAME_CONFIG } from "./gameConfig";

const { startingLives, secondsPerExpression, expressionHoldMs, feedbackDurationMs } = GAME_CONFIG;

export const useFaceExpressionGame = (face: FaceInfo | null) => {
  const [phase, setPhase] = useState<"intro" | "playing" | "won" | "game-over">(
    "intro",
  );
  const [lives, setLives] = useState<number>(startingLives);
  const [round, setRound] = useState<FaceExpression[]>(() =>
    shuffledExpressions(),
  );
  const [index, setIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(secondsPerExpression);
  const [holdProgress, setHoldProgress] = useState(0);
  const [feedback, setFeedback] = useState<ExpressionFeedback>(null);
  const startedAt = useRef<number | null>(null);
  const holdStartedAt = useRef<number | null>(null);
  const feedbackTimer = useRef<number | null>(null);

  const advance = useCallback(
    (nextLives: number, result: Exclude<ExpressionFeedback, null>) => {
      setFeedback(result);
      if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
      feedbackTimer.current = window.setTimeout(() => {
        setFeedback(null);
        feedbackTimer.current = null;
      }, feedbackDurationMs);
      setHoldProgress(0);
      if (index >= round.length - 1) {
        setPhase("won");
        return;
      }
      setLives(nextLives);
      setIndex((value) => value + 1);
      setSecondsRemaining(secondsPerExpression);
    },
    [index, round.length],
  );

  const startGame = useCallback(() => {
    setRound(shuffledExpressions());
    setIndex(0);
    setLives(startingLives);
    setSecondsRemaining(secondsPerExpression);
    setHoldProgress(0);
    startedAt.current = null;
    holdStartedAt.current = null;
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (startedAt.current === null) startedAt.current = now;
      const elapsed = now - startedAt.current;
      setSecondsRemaining(
        Math.max(0, secondsPerExpression - Math.floor(elapsed / 1000)),
      );
      if (elapsed >= secondsPerExpression * 1000) {
        const nextLives = lives - 1;
        if (nextLives <= 0) setPhase("game-over");
        else advance(nextLives, "wrong");
        startedAt.current = now;
        holdStartedAt.current = null;
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [advance, lives, phase]);

  useEffect(() => {
    if (phase !== "playing" || !face) return;
    const expression = round[index];
    if (!expression) return;
    const now = performance.now();
    if (!expression.matches(face)) {
      holdStartedAt.current = null;
      setHoldProgress(0);
      return;
    }
    if (holdStartedAt.current === null) holdStartedAt.current = now;
    const progress = Math.min(1, (now - holdStartedAt.current) / expressionHoldMs);
    setHoldProgress(progress);
    if (progress >= 1) {
      advance(lives, "correct");
      startedAt.current = now;
      holdStartedAt.current = null;
    }
  }, [advance, face, index, lives, phase, round]);

  useEffect(() => () => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
  }, []);

  return {
    phase,
    lives,
    currentExpression: round[index] as FaceExpression | undefined,
    secondsRemaining,
    progress: index,
    total: round.length,
    holdProgress,
    feedback,
    startGame,
  };
};

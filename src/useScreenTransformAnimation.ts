import { useEffect, useRef, useState } from "react";
import type { ScreenTransform2DSettings } from "@vincentt-xr/sdk";
import { GAME_CONFIG } from "./gameConfig";

export type ScreenTransformAnimation =
  | "breathing-pop"
  | "float"
  | "feedback-pop"
  | "pulse"
  | "life-bounce"
  | "wrong-shake";

type Options = {
  baseTransform: ScreenTransform2DSettings;
  animation: ScreenTransformAnimation;
  active: boolean;
  triggerKey?: string | number;
};

const FRAME_INTERVAL_MS = 1000 / GAME_CONFIG.animation.frameRate;
const easeOut = (value: number) => 1 - (1 - value) ** 3;

const scaleTransform = (
  transform: ScreenTransform2DSettings,
  scale: number,
): ScreenTransform2DSettings => ({
  ...transform,
  scale2D: {
    x: transform.scale2D.x * scale,
    y: transform.scale2D.y * scale,
  },
});

export const useScreenTransformAnimation = ({
  baseTransform,
  animation,
  active,
  triggerKey,
}: Options): ScreenTransform2DSettings => {
  const [animatedTransform, setAnimatedTransform] =
    useState<ScreenTransform2DSettings>(baseTransform);
  const baseRef = useRef(baseTransform);

  useEffect(() => {
    baseRef.current = baseTransform;
    if (!active) setAnimatedTransform(baseTransform);
  }, [active, baseTransform]);

  useEffect(() => {
    if (!active) {
      setAnimatedTransform(baseRef.current);
      return undefined;
    }

    const startedAt = performance.now();
    let lastUpdate = startedAt - FRAME_INTERVAL_MS;
    let frame = 0;

    const update = (now: number) => {
      if (now - lastUpdate >= FRAME_INTERVAL_MS) {
        const elapsed = now - startedAt;
        const base = baseRef.current;
        let next = base;

        if (animation === "float") {
          const offset = Math.sin((elapsed / 2200) * Math.PI * 2) * GAME_CONFIG.animation.hintFloatPixels;
          next = {
            ...base,
            position: { x: base.position.x, y: base.position.y + offset },
          };
        } else if (animation === "pulse") {
          const pulse = 1 + Math.max(0, Math.sin((elapsed / 700) * Math.PI * 2)) * GAME_CONFIG.animation.urgentPulseScale;
          next = scaleTransform(base, pulse);
        } else if (animation === "life-bounce") {
          const progress = Math.min(1, elapsed / 360);
          const bounce = progress < 0.5
            ? 1 + easeOut(progress * 2) * GAME_CONFIG.animation.lifeBounceScale
            : 1 + (1 - easeOut((progress - 0.5) * 2)) * GAME_CONFIG.animation.lifeBounceScale;
          next = scaleTransform(base, bounce);
        } else if (animation === "feedback-pop") {
          const progress = Math.min(1, elapsed / 300);
          const pop = progress < 0.5
            ? 0.85 + easeOut(progress * 2) * 0.23
            : 1.08 - easeOut((progress - 0.5) * 2) * 0.08;
          next = scaleTransform(base, pop);
        } else if (animation === "wrong-shake") {
          const progress = Math.min(1, elapsed / 260);
          const offset = Math.sin(progress * Math.PI * 6) * GAME_CONFIG.animation.wrongShakePixels * (1 - progress);
          next = {
            ...base,
            position: { x: base.position.x + offset, y: base.position.y },
          };
        } else {
          const popProgress = Math.min(1, elapsed / 280);
          const pop = popProgress < 0.5
            ? 0.88 + easeOut(popProgress * 2) * 0.18
            : 1.06 - easeOut((popProgress - 0.5) * 2) * 0.06;
          const breathing = 1 + Math.sin((elapsed / 1800) * Math.PI * 2) * GAME_CONFIG.animation.breathingScale;
          next = scaleTransform(base, popProgress < 1 ? pop : breathing);
        }

        if (animation === "feedback-pop" && elapsed >= 300) next = base;
        if (animation === "life-bounce" && elapsed >= 360) next = base;
        if (animation === "wrong-shake" && elapsed >= 260) next = base;

        setAnimatedTransform(next);
        lastUpdate = now;
      }
      frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [active, animation, triggerKey]);

  return animatedTransform;
};

import { useState } from "react";
import {
  ScreenImage,
  ScreenSpaceUI,
  ScreenText,
  type ScreenTransform2DSettings,
} from "@vincentt-xr/sdk";
import type {
  ExpressionFeedback,
  ExpressionId,
  GamePhase,
} from "./faceExpressionTypes";
import { Overlay } from "./overlay";
import { useScreenTransformAnimation } from "./useScreenTransformAnimation";

// Each round's label and hint, and each feedback line, is its own ScreenText with
// literal `text`, and each HUD icon a ScreenImage with a literal `src`, so the
// console's visual editor can retype or swap them. Only the one for the current
// round is visible. Text built from a variable can only be changed in code.

type Props = {
  phase: GamePhase;
  lives: number;
  secondsRemaining: number;
  expressionId: ExpressionId | undefined;
  feedback: ExpressionFeedback;
  onStart: () => void;
};

const initialClockCountTransform: ScreenTransform2DSettings = {
  enabled: true,
  position: { x: 285, y: 520 },
  size: { width: 150, height: 100 },
  pivot: [0.5, 0.5],
  rotation: 0,
  scale2D: { x: 1, y: 1 },
  referencePixelsPerUnit: 32,
  renderOrder: 1002,
  overlay: true,
  visible: true,
  showTransformGuides: false,
};

const initialFeedbackTransform: ScreenTransform2DSettings = {
  enabled: true,
  position: { x: 0, y: 170 },
  size: { width: 320, height: 80 },
  pivot: [0.5, 0.5],
  rotation: 0,
  scale2D: { x: 1, y: 1 },
  referencePixelsPerUnit: 32,
  renderOrder: 1003,
  overlay: true,
  visible: true,
  showTransformGuides: false,
};

const Button = ({
  label,
  onClick,
  visible,
}: {
  label: string;
  onClick: () => void;
  visible: boolean;
}) => (
  <Overlay corner="center" interactive={visible}>
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (visible) onClick();
      }}
      style={{
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
        border: 0,
        borderRadius: 18,
        padding: "14px 50px",
        background: "#ff4f8b",
        color: "white",
        fontSize: 20,
        fontWeight: 700,
        transition: "transform 140ms ease, box-shadow 180ms ease",
        animation: visible
          ? "face-expression-button-glow 2.2s ease-in-out infinite"
          : "none",
      }}
    >
      {label}
    </button>
  </Overlay>
);

export const ExpressionGameUI = (props: Props) => {
  const {
    phase,
    lives,
    secondsRemaining,
    expressionId,
    feedback,
    onStart,
  } = props;
  const [lifeCountTransform, setLifeCountTransform] =
    useState<ScreenTransform2DSettings>({
      enabled: true,
      position: { x: -150, y: 520 },
      size: { width: 200, height: 100 },
      pivot: [0.5, 0.5],
      rotation: 0,
      scale2D: { x: 1, y: 1 },
      referencePixelsPerUnit: 32,
      renderOrder: 1002,
      overlay: true,
      visible: true,
      showTransformGuides: false,
    });

  const [expressionTextTransform, setExpressionTextTransform] =
    useState<ScreenTransform2DSettings>({
      enabled: true,
      position: { x: 0, y: 300 },
      size: { width: 560, height: 140 },
      pivot: [0.5, 0.5],
      rotation: 0,
      scale2D: { x: 1, y: 1 },
      referencePixelsPerUnit: 32,
      renderOrder: 1002,
      overlay: true,
      visible: true,
      showTransformGuides: false,
    });
  const [expressionHintTransform, setExpressionHintTransform] =
    useState<ScreenTransform2DSettings>({
      enabled: true,
      position: { x: 0, y: 220 },
      size: { width: 520, height: 80 },
      pivot: [0.5, 0.5],
      rotation: 0,
      scale2D: { x: 1, y: 1 },
      referencePixelsPerUnit: 32,
      renderOrder: 1002,
      overlay: true,
      visible: true,
      showTransformGuides: false,
    });
  const [clockCountTransform, setClockCountTransform] =
    useState<ScreenTransform2DSettings>(initialClockCountTransform);
  const [feedbackTransform, setFeedbackTransform] =
    useState<ScreenTransform2DSettings>(initialFeedbackTransform);
  const isPlaying = phase === "playing";
  const urgentCountdown = isPlaying && secondsRemaining <= 2;
  const animatedLifeCountTransform = useScreenTransformAnimation({
    baseTransform: lifeCountTransform,
    animation: "life-bounce",
    active: true,
    triggerKey: lives,
  });
  const animatedClockCountTransform = useScreenTransformAnimation({
    baseTransform: clockCountTransform,
    animation: "pulse",
    active: urgentCountdown,
    triggerKey: secondsRemaining,
  });
  const animatedExpressionTransform = useScreenTransformAnimation({
    baseTransform: expressionTextTransform,
    animation: "breathing-pop",
    active: isPlaying,
    triggerKey: expressionId,
  });
  const animatedHintTransform = useScreenTransformAnimation({
    baseTransform: expressionHintTransform,
    animation: "float",
    active: isPlaying,
  });
  const animatedFeedbackTransform = useScreenTransformAnimation({
    baseTransform: feedbackTransform,
    animation: feedback === "wrong" ? "wrong-shake" : "feedback-pop",
    active: isPlaying && feedback !== null,
    triggerKey: feedback ?? "none",
  });

  return (
    <>
      <ScreenSpaceUI>
        <ScreenImage
          name="life"
          src="https://cdn.jsdelivr.net/gh/21myatt/poc-lib-assets-cdn@main/assets/overlay/communication-icons-social-media-sets/3d-red-heart-chat-bubble-like.png"
          fit="contain"
          transparent
          alphaTest={0.01}
          transform={{
            enabled: true,
            position: { x: -270, y: 520 },
            size: { width: 120, height: 120 },
            pivot: [0.5, 0.5],
            rotation: 0,
            scale2D: { x: 0.5, y: 0.5 },
            referencePixelsPerUnit: 32,
            renderOrder: 1001,
            overlay: true,
            visible: true,
            showTransformGuides: false,
          }}
          transformGuideLayer="overlay"
        />
        <ScreenText
          name="lifeCount"
          text={`x ${lives}`}
          fontSize={54}
          color="#ffffff"
          screenTransform={animatedLifeCountTransform}
          bgColor="transparent"
          textAlign="left"
          verticalAlign="center"
          transformGuideLayer="overlay"
          onScreenTransformChange={(next) => {
            setLifeCountTransform(next);
            // eslint-disable-next-line no-console
            console.info("lifeCount transform:", next);
          }}
        />
        <ScreenImage
          name="clock"
          src="https://cdn.jsdelivr.net/gh/21myatt/poc-lib-assets-cdn@main/assets/overlay/3d-icons-pink-sets/3d-pink-twin-bell-alarm-clock.png"
          fit="contain"
          transparent
          alphaTest={0.01}
          transform={{
            enabled: true,
            position: { x: 170, y: 520 },
            size: { width: 120, height: 120 },
            pivot: [0.5, 0.5],
            rotation: 0,
            scale2D: { x: 0.5, y: 0.5 },
            referencePixelsPerUnit: 32,
            renderOrder: 1001,
            overlay: true,
            visible: true,
            showTransformGuides: false,
          }}
          transformGuideLayer="overlay"
        />
        <ScreenText
          name="clockCount"
          text={`${secondsRemaining}`}
          fontSize={54}
          color="#ffffff"
          bgColor="transparent"
          textAlign="left"
          verticalAlign="center"
          screenTransform={animatedClockCountTransform}
          transformGuideLayer="overlay"
          onScreenTransformChange={(next) => {
            setClockCountTransform(next);
            // eslint-disable-next-line no-console
            console.info("clockCount transform:", next);
          }}
        />
        <ScreenText
          name="Smile label"
          text="Smile"
          fontSize={108}
          color="#ffffff"
          bgColor="transparent"
          fontWeight={900}
          strokeLayers={[{ color: "#101828", width: 12, opacity: 1 }]}
          shadowLayers={[{ color: "#38bdf8", blur: 18, opacity: 0.8 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedExpressionTransform}
          visible={isPlaying && expressionId === "smile"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionTextTransform}
        />
        <ScreenText
          name="Smile hint"
          text="Show us your biggest smile"
          fontSize={42}
          color="#9be7ff"
          bgColor="transparent"
          fontWeight={500}
          fontStyle="italic"
          shadowLayers={[{ color: "#0ea5e9", blur: 12, opacity: 0.55 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedHintTransform}
          visible={isPlaying && expressionId === "smile"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionHintTransform}
        />
        <ScreenText
          name="Open Mouth label"
          text="Open Mouth"
          fontSize={108}
          color="#ffffff"
          bgColor="transparent"
          fontWeight={900}
          strokeLayers={[{ color: "#101828", width: 12, opacity: 1 }]}
          shadowLayers={[{ color: "#38bdf8", blur: 18, opacity: 0.8 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedExpressionTransform}
          visible={isPlaying && expressionId === "open-mouth"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionTextTransform}
        />
        <ScreenText
          name="Open Mouth hint"
          text="Open your mouth wide"
          fontSize={42}
          color="#9be7ff"
          bgColor="transparent"
          fontWeight={500}
          fontStyle="italic"
          shadowLayers={[{ color: "#0ea5e9", blur: 12, opacity: 0.55 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedHintTransform}
          visible={isPlaying && expressionId === "open-mouth"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionHintTransform}
        />
        <ScreenText
          name="Blink Left label"
          text="Blink Left"
          fontSize={108}
          color="#ffffff"
          bgColor="transparent"
          fontWeight={900}
          strokeLayers={[{ color: "#101828", width: 12, opacity: 1 }]}
          shadowLayers={[{ color: "#38bdf8", blur: 18, opacity: 0.8 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedExpressionTransform}
          visible={isPlaying && expressionId === "blink-left"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionTextTransform}
        />
        <ScreenText
          name="Blink Left hint"
          text="Close your left eye"
          fontSize={42}
          color="#9be7ff"
          bgColor="transparent"
          fontWeight={500}
          fontStyle="italic"
          shadowLayers={[{ color: "#0ea5e9", blur: 12, opacity: 0.55 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedHintTransform}
          visible={isPlaying && expressionId === "blink-left"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionHintTransform}
        />
        <ScreenText
          name="Blink Right label"
          text="Blink Right"
          fontSize={108}
          color="#ffffff"
          bgColor="transparent"
          fontWeight={900}
          strokeLayers={[{ color: "#101828", width: 12, opacity: 1 }]}
          shadowLayers={[{ color: "#38bdf8", blur: 18, opacity: 0.8 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedExpressionTransform}
          visible={isPlaying && expressionId === "blink-right"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionTextTransform}
        />
        <ScreenText
          name="Blink Right hint"
          text="Close your right eye"
          fontSize={42}
          color="#9be7ff"
          bgColor="transparent"
          fontWeight={500}
          fontStyle="italic"
          shadowLayers={[{ color: "#0ea5e9", blur: 12, opacity: 0.55 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedHintTransform}
          visible={isPlaying && expressionId === "blink-right"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionHintTransform}
        />
        <ScreenText
          name="Wide Eyes label"
          text="Wide Eyes"
          fontSize={108}
          color="#ffffff"
          bgColor="transparent"
          fontWeight={900}
          strokeLayers={[{ color: "#101828", width: 12, opacity: 1 }]}
          shadowLayers={[{ color: "#38bdf8", blur: 18, opacity: 0.8 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedExpressionTransform}
          visible={isPlaying && expressionId === "wide-eyes"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionTextTransform}
        />
        <ScreenText
          name="Wide Eyes hint"
          text="Open your eyes wide"
          fontSize={42}
          color="#9be7ff"
          bgColor="transparent"
          fontWeight={500}
          fontStyle="italic"
          shadowLayers={[{ color: "#0ea5e9", blur: 12, opacity: 0.55 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedHintTransform}
          visible={isPlaying && expressionId === "wide-eyes"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionHintTransform}
        />
        <ScreenText
          name="Neutral Face label"
          text="Neutral Face"
          fontSize={108}
          color="#ffffff"
          bgColor="transparent"
          fontWeight={900}
          strokeLayers={[{ color: "#101828", width: 12, opacity: 1 }]}
          shadowLayers={[{ color: "#38bdf8", blur: 18, opacity: 0.8 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedExpressionTransform}
          visible={isPlaying && expressionId === "neutral"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionTextTransform}
        />
        <ScreenText
          name="Neutral Face hint"
          text="Relax your face"
          fontSize={42}
          color="#9be7ff"
          bgColor="transparent"
          fontWeight={500}
          fontStyle="italic"
          shadowLayers={[{ color: "#0ea5e9", blur: 12, opacity: 0.55 }]}
          textAlign="center"
          verticalAlign="center"
          screenTransform={animatedHintTransform}
          visible={isPlaying && expressionId === "neutral"}
          transformGuideLayer="overlay"
          onScreenTransformChange={setExpressionHintTransform}
        />
        <ScreenText
          name="Correct feedback"
          text="✓ CORRECT!"
          fontSize={48}
          color="#7CFFB2"
          bgColor="transparent"
          fontWeight={800}
          strokeLayers={[{ color: "#101828", width: 8, opacity: 1 }]}
          shadowLayers={[{ color: "#22c55e", blur: 18, opacity: 0.7 }]}
          textAlign="center"
          verticalAlign="center"
          visible={isPlaying && feedback === "correct"}
          screenTransform={animatedFeedbackTransform}
          transformGuideLayer="overlay"
          onScreenTransformChange={setFeedbackTransform}
        />
        <ScreenText
          name="Wrong feedback"
          text="✕ TRY AGAIN"
          fontSize={48}
          color="#FF8A9B"
          bgColor="transparent"
          fontWeight={800}
          strokeLayers={[{ color: "#101828", width: 8, opacity: 1 }]}
          shadowLayers={[{ color: "#ef4444", blur: 18, opacity: 0.7 }]}
          textAlign="center"
          verticalAlign="center"
          visible={isPlaying && feedback === "wrong"}
          screenTransform={animatedFeedbackTransform}
          transformGuideLayer="overlay"
          onScreenTransformChange={setFeedbackTransform}
        />
      </ScreenSpaceUI>
      <Overlay corner="center">
        <div
          style={{
            visibility: phase === "intro" ? "visible" : "hidden",
            pointerEvents: phase === "intro" ? "auto" : "none",
            width: "min(86vw, 520px)",
            transform: "translateY(-150px)",
            textAlign: "center",
            color: "white",
            textShadow: "0 2px 8px #000",
          }}
        >
          <h1>Face Expression Challenge</h1>
          <p>Make each expression before the clock runs out.</p>
          <p>You have 3 lives.</p>
        </div>
      </Overlay>
      <Button
        label="Start Game"
        onClick={onStart}
        visible={phase === "intro"}
      />
      <Overlay corner="center">
        <div
          style={{
            visibility:
              phase === "won" || phase === "game-over" ? "visible" : "hidden",
            pointerEvents:
              phase === "won" || phase === "game-over" ? "auto" : "none",
            width: "min(86vw, 520px)",
            textAlign: "center",
            color: "white",
            textShadow: "0 2px 8px #000",
            transform: "translateY(-150px)",
          }}
        >
          <h1>{phase === "won" ? "You Win!" : "Game Over"}</h1>
          <p>
            {phase === "won"
              ? "Amazing expression skills!"
              : "Try again and beat the clock."}
          </p>
        </div>
      </Overlay>
      <Button
        label="Play Again"
        onClick={onStart}
        visible={phase === "won" || phase === "game-over"}
      />
    </>
  );
};

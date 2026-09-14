// Scene.tsx — the agent's surface.
// Add SDK components and R3F primitives here.
// See GROUNDING.md for the API reference and pattern catalog.
//
// react/no-unknown-property is disabled for this file in .eslintrc.json, not by
// a directive here: R3F props (position, rotation, args) are unknown to the rule
// and every one of them errors, but this file is EMPTY of primitives until an
// agent adds some — so an in-file directive sits unused, and the lint script
// runs --report-unused-disable-directives, which makes the unused directive
// itself the error. Disabling at the config keeps the suppression true in both
// states.
import { useFaceInfo } from "@vincentt-xr/sdk/tracking";
import { ExpressionGameUI } from "./ExpressionGameUI";
import { GAME_CONFIG } from "./gameConfig";
import { useFaceExpressionGame } from "./useFaceExpressionGame";

export const Scene = () => {
  const face = useFaceInfo({ active: true, targetFps: GAME_CONFIG.faceTargetFps });
  const game = useFaceExpressionGame(face);
  return (
    <ExpressionGameUI
      phase={game.phase}
      lives={game.lives}
      secondsRemaining={game.secondsRemaining}
      expression={
        game.currentExpression ?? {
          label: "Get Ready",
          hint: "Press Start to begin",
        }
      }
      feedback={game.feedback}
      onStart={game.startGame}
    />
  );
};

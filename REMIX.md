# Face Expression Game Remix Guide

This project is a face-expression challenge. Start remixing in `src/Scene.tsx`.

## Main edit points

- `src/gameConfig.ts` — lives, timing, tracking rate, and animation intensity.
- `src/faceExpressions.ts` — expression labels, hints, thresholds, and matching.
- `src/ExpressionGameUI.tsx` — fixed HUD, prompt layout, colors, and transforms.
- `src/useFaceExpressionGame.ts` — game phases, timer, lives, progression, and replay.
- `src/useScreenTransformAnimation.ts` — subtle screen-space motion.
- `src/hudAssets.ts` — heart and clock texture URLs.

## Game flow

1. The player presses **Start Game**.
2. A shuffled expression appears.
3. The player has five seconds to perform it.
4. The expression must remain valid for 300ms.
5. A match advances to the next expression.
6. A timeout removes one life.
7. All expressions completed means **You Win**.
8. Losing all lives means **Game Over**.

## Customize expressions

Edit `src/faceExpressions.ts`. Each expression has an ID, label, hint, and
`matches(face)` function. Adjust blendshape thresholds when recognition is too
sensitive or too strict. Keep the matching function pure and fast because it
runs against tracking updates.

## Customize the screen layout

Edit the `ScreenTransform2DSettings` values in `src/ExpressionGameUI.tsx`.
The heart and clock HUD are fixed screen-space elements; they do not follow the
face. Transform guides are disabled by default. When enabled, each editable
text transform logs its updated settings to the browser console.

## Customize animation

Edit the values under `GAME_CONFIG.animation` in `src/gameConfig.ts`.
Animations affect only screen-space transforms and never change gameplay timing.

## Protected runtime files

Do not edit `src/App.tsx` or `src/main.tsx` for normal remixing. They own the
Vincentt runtime shell, camera, media source, and XR session lifecycle.

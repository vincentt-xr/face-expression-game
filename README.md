# Face Expression Game

An editable Vincentt XR game built with React, R3F, and the Vincentt XR SDK.
Players perform six tracked facial expressions against a five-second timer with
three lives.

See [REMIX.md](./REMIX.md) for creator-facing customization instructions.

## Shape

```
src/
  main.tsx            mount — never edited
  App.tsx             protected shell: XRProvider + AspectRatioContainer +
                      XRScene + media-source binding, camera, lighting,
                      VideoBackground, PreviewAnchors — never edited
  Scene.tsx           the agent's surface: add SDK components and R3F
                      primitives here
  PreviewAnchors.tsx  editor-preview integration — never edited
```

See `AGENTS.md` and `GROUNDING.md` for the SDK reference and scene-authoring rules.

## Game source shape

```
src/
  Scene.tsx                    scene composition
  ExpressionGameUI.tsx         screen-space HUD and prompt UI
  useFaceExpressionGame.ts     game state and timing
  faceExpressions.ts           expression definitions and matching rules
  faceExpressionTypes.ts       shared game types
  gameConfig.ts                remix controls
  useScreenTransformAnimation.ts  UI motion
```

## Develop

```
pnpm install
pnpm dev          # esbuild dev server on :5173
pnpm preview      # on-device preview over a secure tunnel (needs `vincentt login`)
pnpm typecheck
pnpm build        # production bundle to dist/
```

## Release

`vincentt init` scaffolds from the **`latest` tag**, not from `main`. Merging to `main` does
not ship a template to creators — cutting a release does.

```
git tag 1.1.0 <sha>      # bare semver, no `v` prefix
git push origin 1.1.0    # the Release workflow verifies the tag, then moves `latest`
```

The Release workflow (`.github/workflows/release.yml`) installs from the frozen lockfile,
builds, and typechecks **the tagged tree** before force-updating `latest` to it. A tag that
fails leaves `latest` where it was, so a broken release cannot reach a new creator.

**Never move `latest` by hand.** It is force-updated by that workflow and nowhere else; moving
it manually decouples the pointer from the version it claims to be.

Creators can pin a specific version — `vincentt init --template 1.0.0` — which is the escape
hatch when a release turns out to be bad. That is why the version tags are immutable and only
`latest` moves.

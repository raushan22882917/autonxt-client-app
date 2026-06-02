---
name: Expo secrets on Replit
description: Why EXPO_PUBLIC_X=$SECRET shell forwarding fails in Expo workflows on Replit, and the reliable pattern
---

# Expo + Replit secrets injection

In a Replit Expo artifact, the package.json `dev` script forwards secrets like
`EXPO_PUBLIC_COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID pnpm exec expo start`. This
**silently produces empty strings** for the EXPO_PUBLIC_* vars even though the
base secret (`COGNITO_CLIENT_ID`) is present in the same final process env.

Symptom: AWS Cognito returns `InvalidParameterException: "2 validation errors
detected: Value '' at 'clientId'..."` (empty ClientId), and AppSync/GraphQL
calls show "Failed to fetch" (empty endpoint/key). Restarting the workflow does
NOT fix it.

**Why:** Replit injects secrets into the final monitored process, but pnpm's
script-running shell does the `$VAR` expansion in a context where the secret is
not yet visible, so the inline `EXPO_PUBLIC_X=$Y` assignment captures "".
Verified: `pnpm exec node -e` sees `process.env.COGNITO_CLIENT_ID` (correct
length) but `process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID` is length 0.

**How to apply:** Do not rely on shell `EXPO_PUBLIC_X=$SECRET` forwarding for
secret values. Instead use a dynamic `app.config.js` that reads the BASE env
vars in Node at bundle time and exposes them via `extra`:
`extra: { cognitoClientId: process.env.COGNITO_CLIENT_ID || '' , ... }`. App code
reads `Constants.expoConfig.extra` (with `process.env.EXPO_PUBLIC_*` as a
harmless fallback). `app.config.js` runs in the same pnpm/metro Node context that
DOES have the base secrets, so values inline correctly into the bundle for both
dev and production export.

Verify with: `pnpm exec expo config --json` → check `extra` field lengths.

**Caveat for deploy:** the production build (`build.js` → metro export) also runs
`app.config.js` in Node, so it works as long as the deployment environment has
the BASE secrets configured.

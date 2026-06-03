---
name: AppSync & Cognito auth quirks (mobile app)
description: Non-obvious environment gotchas for the AutoNXT mobile app's AppSync GraphQL + Cognito auth
---

# AppSync / Cognito (artifacts/mobile)

- AppSync GraphQL requires **Cognito userPool auth only**. API-key auth fails — do not attempt it.
- The `$APPSYNC_ENDPOINT` secret has a **hostname typo** — do NOT use it. The correct endpoint is hardcoded in `app.config.js`.
- The app gates all content behind a Cognito login screen, so the authenticated dashboard **cannot be reached by the screenshot tool without real test credentials** (which are not available). Verify auth'd screens via typecheck + clean Metro bundle instead.

**Why:** wasted time re-discovering that the secret endpoint is broken and that API-key auth is rejected.
**How to apply:** when wiring AppSync calls or debugging auth, trust `app.config.js` endpoint + userPool tokens; ignore the env secret.

---
name: AppSync auth mode and public config
description: AppSync userPool auth requires the Cognito idToken (not accessToken); public AWS client config belongs in committed config, not secrets
---

# AppSync (Cognito User Pool) auth + where AWS client config belongs

## userPool auth uses the idToken, not the accessToken
When AppSync's `defaultAuthMode` is `userPool`, GraphQL requests authorize with
the Cognito **ID token** placed raw (no `Bearer` prefix) in the `Authorization`
header. Sending the **access token** instead connects but fails authorization.

**Why:** AppSync's Cognito User Pool authorizer validates claims (e.g. `aud`,
group claims) that live on the idToken, not the accessToken.

**How to apply:** The token-getter wired into the GraphQL client must return
`tokens.idToken`. Symptom of the bug: requests reach AppSync but error on auth,
while a wrong/empty endpoint instead throws a network-level "Failed to fetch".

## Public AWS client config does NOT belong in secrets
AppSync endpoint URL, AWS region, Cognito User Pool ID, App Client ID, and
Identity Pool ID are **public** client identifiers (they ship in every client
bundle; Amplify commits them to the repo). Keep them as authoritative values in
committed config (here: `app.config.js` `extra`), not as secrets. Only genuinely
sensitive values (e.g. an AppSync API key used for non-userPool ops) stay in env.

**Why:** A secret holding the AppSync endpoint had a single-character typo in the
hostname (`...ffncwai` vs `...ffhcwai`), causing "Failed to fetch" (host did not
resolve). Secrets can't be read back or edited via tooling, so a typo there is
hard to spot; a committed value is reviewable and diffable. Storing public
config as secrets also reintroduces the `EXPO_PUBLIC_X=$SECRET` empty-string
trap (see expo-replit-secrets.md).

**How to apply:** When a user hands you an Amplify/AWS config, bake the public
identifiers into committed config as the source of truth. Don't read them from
env (a typo'd secret would override). Verify with `pnpm exec expo config --json`.

## IAM SigV4 can introspect the schema, but data is userPool-only
SigV4-signed requests (service `appsync`) to the GraphQL endpoint can run
`__schema`/`__type` **introspection** even when `defaultAuthMode` is `userPool`,
but the data resolvers enforce Cognito User Pool authorization — IAM-signed
**data** queries return `errorType: "Unauthorized"` ("Not Authorized to access X
on type Query").

**Why:** Introspection is governed by API-level config, while each resolver has
its own auth directives tied to Cognito groups/claims. This is also a safety
property: leaked AWS IAM keys cannot read app data through AppSync.

**How to apply:** To discover field names, enum values, and argument types when
you lack a live user token, use IAM SigV4 introspection in the build env only
(never ship IAM keys in the app). Then build the queries the app runs with the
user's idToken. Don't expect IAM creds to return real data for verification —
end-to-end data checks require a logged-in user token.

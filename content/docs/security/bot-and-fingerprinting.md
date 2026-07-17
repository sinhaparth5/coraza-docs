---
sidebar_position: 3
title: Bot Protection & Fingerprinting
description: Header-based bot scoring with a JavaScript proof-of-work challenge, plus JA4 TLS fingerprinting and ASN lookup.
keywords: [bot protection, js challenge, ja4, ja3, tls fingerprinting, proof of work]
---


## Bot protection & JS challenge

- Each request is scored **O(1) from headers only**: scanner user agents, HTTP-library user agents,
  and missing/suspicious headers each add to an anomaly score.
- **Trusted SEO/social crawlers** (Googlebot, Bingbot, Applebot, etc.) are detected first and
  **bypass scoring and the challenge entirely**.
- When bot protection is active, requests without a valid bypass cookie are redirected to a
  **JavaScript proof-of-work challenge** (`/_cz/challenge`) — a SHA-256 nonce that a real browser
  solves in under a second, then receives an HMAC-signed bypass cookie.
- **Per-service bot mode** overrides the global setting:
  - `inherit` — use the global setting.
  - `always` — challenge every non-trusted client regardless of score.
  - `off` — never challenge.

Tune the global challenger (enabled, threshold, TTL) under **Settings → Bot protection**
(`POST /admin/settings/bot`, meta keys `bot_enabled`/`bot_threshold`/`bot_ttl`, defaulting to
**disabled, threshold 8, TTL 3600s** if never configured), and set per-service overrides from each
service's Manage panel. See the [dashboard walkthrough](/docs/configuration/dashboard).

### How the proof-of-work challenge works

1. A challenged request is redirected to `GET /_cz/challenge?n=<nonce>&r=<original-path>&exp=<unix-ts>&sig=<hmac>`.
   The nonce, expiry (2-minute solve window), and original destination are embedded in the
   URL and authenticated with an HMAC (`sig`) so the challenge page itself can't be forged or replayed
   past its window.
2. The page's JS brute-forces a `solution` integer such that
   `SHA-256(nonce + solution)`'s **first byte is `0x00`**. This takes roughly 256 attempts on average and is solved by
   a real browser in well under a second, deliberately far too cheap to meaningfully slow down a
   single request but expensive enough to filter `curl`/basic scrapers that never run the JS at all.
3. Concurrently, the page loads the vendored FingerprintJS bundle from `GET /_cz/fp.js`. It is
   vendored because ad blockers and Brave/Firefox block the public CDN by default. The bundle
   computes a browser visitor ID and probes for automated-browser leakage (see below).
4. The page `POST`s `{nonce, exp, sig, solution, visitor_id, automation}` to `/_cz/verify`. The server
   re-checks the signature, the PoW solution, and that the nonce hasn't already been redeemed (each
   nonce mints at most one cookie; replaying a captured solve within its window gets a `403`), then
   refuses the cookie outright if any automation signal was reported (see below).
5. On success, a bypass cookie (`cz_bot_ok`, `HttpOnly`, `SameSite=Lax`, `Secure` on HTTPS) is set:
   `<expiry_unix>.<visitor_id>.<hmac>`. The HMAC covers both the expiry and the visitor ID, so a
   client can't extend its own TTL or swap in a different visitor ID without invalidating the cookie.
   A legacy two-part `<expiry>.<hmac>` format (no visitor ID, pre-dating FingerprintJS integration) is
   still accepted so cookies issued before an upgrade stay valid until they naturally expire.

![Bot Protection settings panel showing the enable toggle, anomaly threshold field set to 8, and bypass cookie TTL field set to 3600 seconds](/img/docs/docs_bot_protection.png)

### Automated-browser detection

The challenge page also probes for **automated-browser leakage**: `navigator.webdriver`,
ChromeDriver's `cdc_`/`$cdc_` arrays, `domAutomationController`, Selenium / Puppeteer / Playwright /
PhantomJS / Nightmare globals, and `HeadlessChrome` in the User-Agent. Any hit is reported to the
server alongside the proof-of-work solution. The server **refuses to issue the bypass cookie**
even when the PoW itself was solved correctly. Default browser-driven scanners, including OWASP ZAP,
Selenium, Puppeteer, and Playwright, stay at the challenge
instead of earning a trusted session. Repeated unsolved challenge redirects also accrue points toward
an [automatic IP ban](/docs/security/blocking#automatic-ip-banning).

:::note[This is client-side detection]
A determined attacker who reads the challenge page's JS can strip the signals before submitting, so
it defeats off-the-shelf automation, not custom evasion.
:::

## JA4 / JA3 TLS fingerprinting

**JA4** (primary) and **JA3** (legacy) fingerprints are computed during the **TLS handshake**, before
the HTTP request is parsed. This provides a TLS-layer client signal that is
independent of headers and can't be spoofed by editing the User-Agent.

- Each fingerprint is looked up per request. If the connection came through Cloudflare, the `Cf-Ja4` /
  `Cf-Ja3-Fp` headers are used instead of a local computation, since Cloudflare already computed them
  at its edge.
- **JA4 sorts cipher suites and extensions before hashing**, so a client that randomizes handshake
  order per connection still produces a stable fingerprint. JA4 is therefore the primary signal.

:::warning[Do not build new detection logic on JA3]
JA3's MD5 hash has no such sorting and is trivially evaded by reordering the handshake. It is retained
only for continuity with existing log data and external JA3-keyed threat feeds.
:::

### JA4 format

A JA4 hash looks like `t13d1516h2_8daaf6152771_02713d6af862` — three underscore-separated sections:

- **`a` (plaintext, human-readable)** — transport (`t`=TCP/`q`=QUIC), TLS version (`13`/`12`/…),
  whether SNI was present (`d`=yes/`i`=no), zero-padded cipher count, zero-padded extension count, and
  the first ALPN value's first+last character (`h2` above). Comparable at a glance even before the
  hashed sections are checked.
- **`b`** — a truncated SHA-256 over the sorted cipher suite list.
- **`c`** — a truncated SHA-256 over the sorted extension list (SNI and ALPN excluded from the hash
  input, though still counted in section `a`).

**GREASE values** ([RFC 8701](https://www.rfc-editor.org/rfc/rfc8701) — the fake cipher/extension/
version IDs real browsers insert to force servers to tolerate unknown values) are filtered out of
every section before counting or hashing, so a client's GREASE randomization never perturbs its own
fingerprint.

The resolved JA4 hash appears in each request's [log detail view](/docs/configuration/dashboard)
alongside the country and ASN.

## ASN / organization lookup

A bundled **DB-IP ASN Lite** database (`//go:embed`-ed) provides in-process ASN / organization
lookup for client IPs — **no MaxMind account, no external service**. Attribution is in
`THIRD_PARTY_NOTICES.md`. The resolved ASN/organization appears in each request's
[log detail view](/docs/configuration/dashboard).

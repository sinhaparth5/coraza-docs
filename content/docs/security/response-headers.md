---
sidebar_position: 7
title: Security Response Headers
description: Browser-hardening headers applied to every response, plus the forced Server header.
keywords: [security headers, hsts, x-frame-options, response headers]
---


A global middleware sets browser-hardening headers on **every** response (blocked, admin, and
proxied alike):

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, only on TLS connections
  (`c.Request().TLS != nil`) so a plain-HTTP dev setup is never told to force HTTPS
- `X-WAF-Engine: Coraza v3 / OWASP CRS`

The `Server` header on every response is forced to `Palisade`, overwriting whatever the
backend sent.

:::note[No `X-Protected-By` header]
An earlier version also sent an `X-Protected-By` header. It was removed to reduce WAF fingerprinting
via response headers — `X-WAF-Engine` is the only identification header left.
:::

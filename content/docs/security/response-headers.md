---
sidebar_position: 7
title: Security Response Headers
description: Browser-hardening headers applied to every response, plus the forced Server header.
---


A global middleware sets browser-hardening headers on **every** response (blocked, admin, and
proxied alike):

- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- **HSTS** on TLS connections
- `X-WAF-Engine` identification header

The `Server` header on every response is forced to `Coraza WAF Mod`, overwriting whatever the
backend sent.

:::note[No `X-Protected-By` header]
An earlier version also sent an `X-Protected-By` header. It was removed to reduce WAF fingerprinting
via response headers — `X-WAF-Engine` is the only identification header left.
:::

---
sidebar_position: 3
title: TLS / HTTPS
description: Plain HTTP, automatic Let's Encrypt, your own certificates, and per-service TLS resolved by SNI.
---


There are three modes, mixable per service:

- **Plain HTTP** (default) — no TLS.
- **Automatic Let's Encrypt (ACME)** — provide a domain + contact email; certificates are issued on
  first HTTPS request and cached on disk.
- **Your own certificate** — supply a PEM cert/key as the global fallback, and/or upload a custom
  cert **per service** from the dashboard.

**Per-service TLS:** each backend can have its own uploaded cert or its own auto-issued cert.
Certificates are resolved by SNI: per-service custom cert → per-service/legacy autocert → global
fallback. Uploaded private keys are stored **on disk** under `certs/services/<name>/` with `0600`
permissions — never in the database.

## 1. Self-signed (IP-based deployments)

Generate a cert and point the binary at it:

```bash
coraza-waf-mod gencert --cert /var/lib/coraza-waf-mod/certs/self-signed.crt \
  --key /var/lib/coraza-waf-mod/certs/self-signed.key --hosts 203.0.113.10
# then run with:
--listen :80 --listen-tls :443 \
--tls-cert /var/lib/coraza-waf-mod/certs/self-signed.crt \
--tls-key  /var/lib/coraza-waf-mod/certs/self-signed.key
```

The `gencert` subcommand produces a self-signed **ECDSA P-256** certificate with hostname/IP SANs,
so IP-based deployments get HTTPS without openssl. Browsers will warn on a self-signed cert; add an
exception, or move to ACME once you have a domain.

## 2. Automatic Let's Encrypt (ACME)

Store a domain + contact email (the installer does this when you enter a domain; manually it's
`setup --domain … --acme-email …`), then run with `--listen :80` (for the ACME HTTP-01 challenge +
redirect) and `--listen-tls :443`. The certificate is provisioned on the first HTTPS request and
cached under `--certs`. **DNS for the domain must point at the server before the first request.**

## 3. Per-service certificates

From a service's **Manage** panel, upload a custom cert/key or enable per-service auto-issue.
Certificates are resolved by SNI at handshake time: **per-service custom → per-service/legacy
autocert → global fallback.** Uploaded private keys are stored on disk (`certs/services/<name>/`,
mode `0600`), never in the database.

See [Certificates & per-service TLS](/docs/configuration/dashboard) in the dashboard walkthrough for
the exact forms and routes.

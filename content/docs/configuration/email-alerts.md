---
sidebar_position: 9
title: Daily Report & Ban Alert Emails
description: Daily traffic digest and instant autoban alert emails sent via Cloudflare Email Service — only the recipient list and API token are configurable.
---


Coraza WAF Mod sends two kinds of email via **Cloudflare Email Service** (SMTPS — no external SMTP
provider needed):

- **Daily traffic report** — sent just after local midnight, covering the completed day: total
  requests, blocked count, 403s, unique blocked IPs, and a per-stage breakdown.
- **Ban alert** — sent every time [autoban](/docs/security/blocking#automatic-ip-banning) permanently
  blocks an IP.

A ban is written to the blocklist regardless of whether email is configured or the send succeeds —
email is a notification, not a dependency.

## What's configurable

**Only the recipient list and the Cloudflare API token** are configurable, from the **Email Alerts**
card on the Settings page (`POST /admin/settings/email` with `email_enabled`, `email_to`,
`email_token`). Everything else is **fixed in code** and never appears in `config.yaml`, the binary,
or `install.sh`:

| | Value |
|---|---|
| SMTP endpoint | `smtp.mx.cloudflare.net:465` (implicit TLS — no STARTTLS) |
| SMTP username | the literal string `api_token` |
| SMTP password | your configured Cloudflare API token |
| Sender address | fixed in code (see `internal/notify/mailer/mailer.go`'s `Sender` constant) — allowlist it in your mail client if alerts land in spam |

Connecting on the implicit-TLS port means `net/smtp.PlainAuth` works even though the standard library
client doesn't natively speak implicit TLS — `smtp.NewClient` detects the already-TLS connection and
marks the session as secured before auth runs.

The token is stored in the database (meta keys `email_enabled`, `email_token`, `email_to`) and **never
echoed back to the UI** once saved, so on subsequent saves leave the token field blank to keep the
existing value.

Alerts arrive with a display name so they show up as *Coraza WAF Mod* in your inbox. Gmail strips
inline SVG from HTML email, so the logo badge in the template is built from plain HTML/CSS (a green
rounded square with three bars) rather than an SVG image.

## Daily report contents

| Field | Meaning |
|---|---|
| Total | All requests logged in the completed day. |
| Blocked | Requests denied by any pipeline stage. |
| 403s | Requests answered with HTTP 403. |
| Unique blocked IPs | Distinct client IPs with at least one blocked request. |
| Per-stage breakdown | WAF-blocked, IP-blocked, geo-blocked, rate-limited, and bot-challenged counts. |

## Verifying credentials

A **Send test report** button (`POST /admin/settings/email/test`) sends a report covering the last 24
hours immediately, using the currently *saved* configuration — so save your settings first, then test
to verify the credentials before turning the daily schedule on.

## Idempotent per day

Sends are **idempotent per day**: a restart around midnight neither duplicates nor skips the daily
report, and a failed send is retried on the next tick/restart rather than being marked as sent.

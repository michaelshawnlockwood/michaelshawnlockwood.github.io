---
layout: none
---

# PII / PHI / PCI

## PII — Personally Identifiable Information: data that can identify a person (direct: name, SSN, driver’s license; indirect: combinations like DOB+ZIP). Typical controls: least-privilege, encryption in transit/at rest, masking/tokenization, access reviews, audit.

## PHI — Protected Health Information (HIPAA): individually identifiable health info held by a covered entity/business associate. Includes any of the 18 HIPAA identifiers with health context (diagnosis, treatment, billing, etc.). Controls are stricter: BAAs, minimum necessary, audit logs, breach notification, retention limits, encryption everywhere.

## PCI — Payment Card Industry (PCI DSS): cardholder data = PAN (+ name/expiry) and sensitive authentication data (full track data, CVV/CVC, PIN). SAD must never be stored post-authorization; PAN must be protected (truncation, tokenization, strong crypto). Scope and segment systems that touch PAN; quarterly scans/pen tests; tight logging and key management.
---
layout: single
---

# Session Lifecycle & Secret Handling (PropAgent)

 > Goal: Keep secrets ephemeral and server-side while guaranteeing uninterrupted access for any active tenant session.

## Principles
 - Secrets never leave the server process; never log or persist them.  
 - Build a per-tenant effective connection string in memory after Vault retrieval; discard raw secret objects immediately.  
 - Cache the connection string per session on the server (never in the browser), with sliding expiration and an absolute cap.  

## Lifecycle
 - Sign-in + Tenant Resolve: On first request post-auth, resolve tenant → fetch Vault creds → assemble connection string in memory → cache it keyed to the session.  
 - Active Use (Every Request):
   - Touch the session to refresh the sliding TTL (e.g., 20 minutes).
   - If cache entry missing or expired, re-fetch from Vault once (with jittered backoff), rebuild, continue.  
 - Lease Management:  
   - Use Vault dynamic creds with a lease slightly longer than your typical session.
   - Start background renewal when remaining lease time drops below a threshold (e.g., 25%).
   - On renewal failure, attempt one grace refresh before impacting the user.
 - Timeout & Logout:
   - On inactivity > sliding TTL: invalidate the session, drop the cache entry, optionally revoke the lease.

Surface a 401 and “Your session expired due to inactivity. Please sign in again.” (Do not use 503.)

Degradation Strategy (Never deny active):

If Vault is briefly unavailable but the cached connection string is still valid, keep serving.

If the DB creds expire mid-session, attempt a transparent refresh; if it fails, fall back to read-only if feasible, then prompt re-auth only as a last resort.

Deploy Modes:

Dev/single node: IMemoryCache.

Prod/multi-node: Valkey/Redis-compatible IDistributedCache (Valkey if you want permissive OSS; Redis if acceptable under RSAL/SSPL). 
linuxfoundation.org
+1

Background Jobs:

Use a separate Vault role (service principal) with its own lease/renewal, fully decoupled from user sessions.

Status Codes & UX

401 Unauthorized: session expired or auth missing → “Please sign in again.”

503 Service Unavailable: temporary outage/maintenance or dependency down (e.g., Vault unreachable) → “We’re doing maintenance / experiencing a temporary issue. Your work is safe; please try again shortly.”
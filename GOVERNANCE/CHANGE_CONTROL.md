# TruthDrop Production Change Control

## Required workflow
DISCOVER → BACK UP/RECOVERY PLAN → CHANGE → DEPLOY → VERIFY → RECORD.

## Stop Conditions
Stop before writing when:
- the authoritative repository or deployment target is uncertain;
- a route/domain dependency is unknown;
- the change could expose protected data;
- the requested action conflicts with the Constitution or approved manifest;
- rollback is not reasonably understood for a material change;
- an inferred email/contact would be promoted to verified without an authoritative source.

## Production Verification
For public-route changes verify, as applicable:
- destination loads;
- no unexpected automatic redirect;
- navigation remains usable;
- canonical/sitemap references are coherent;
- no legacy preview/expired domain is invoked;
- public page does not expose internal/admin data;
- mobile and accessibility-critical controls remain usable.

For operational/database changes verify:
- existing records remain intact;
- state transitions are correct;
- writes reach the intended datastore;
- preview does not equal send;
- do-not-send/hold records cannot accidentally enter a send queue;
- audit/provenance fields survive the change.

## Change Record Template
Date:
Purpose:
Authority:
Affected system(s):
Pre-change state:
Risk:
Rollback:
Commit/deployment reference:
Verification performed:
Result:
Follow-up:

## Current Temporary Containment
TruthDrop `/tips` may temporarily route to the main TruthDrop page while the governed DROP/intake module is rebuilt and the public-site safety status is investigated. This temporary routing is not the final architecture and must not be interpreted as decommissioning DROP.

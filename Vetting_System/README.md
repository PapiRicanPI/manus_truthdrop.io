# TruthDrop / Vault Vetting System

This folder contains all documentation exported from Manus for the TruthDrop vetting dashboard. It is the canonical record of how the current vetting panel works and how it was implemented.

## Contents

- `Vetting_Logic_Overview.md` – Full narrative of vetting criteria, examples, and limitations.
- `Enhanced-Vetting-System-User-Guide.md` – How to use the vetting dashboard UI.
- `Enhanced-Vetting-System-Installation-Guide.md` – How to install and run the system outside Manus.
- `Vetting_Email_Notifications_Detail.md` – When email is supposed to send and to whom.
- `Vetting-Application-Quick-Reference-Card.md` – One‑page cheat sheet for quick decisions.
- `TruthDrop_Vetting_Scorecard.md` – My own manual scoring rules and approval thresholds.

## Important Notes

- The current implementation was generated on the Manus platform and exported here for safekeeping.
- Manus sandbox has SMTP/network restrictions, so email delivery **cannot be fully tested** there. Email must be wired and tested on another host.
- All vetting decisions remain manual. The panel does not perform automated identity checks, risk scoring, or email verification.

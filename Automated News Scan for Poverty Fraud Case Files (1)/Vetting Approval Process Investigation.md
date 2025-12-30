# Vetting Approval Process Investigation

## Current State: VIEW-ONLY INTERFACE

The admin vetting page at https://truthdrop.io/admin/vetting is currently **VIEW-ONLY**.

### What Exists:
- ✓ Complete display of all applications
- ✓ All application details visible
- ✓ Review notes displayed
- ✓ Generated passwords shown
- ✓ Status badges (Approved/Rejected/Pending)

### What Does NOT Exist:
- ✗ No approve/reject buttons
- ✗ No input fields for review notes
- ✗ No forms for data entry
- ✗ No interactive controls

## How Approvals Currently Happen

Based on the evidence (existing approved/rejected applications with review notes and timestamps), approvals are happening through one of these methods:

### Possibility 1: Database Direct Access
The admin is directly accessing the database (e.g., through a database management tool) to:
- Update the status field (pending → approved/rejected)
- Add review notes
- Set the review timestamp

### Possibility 2: Backend Admin Panel
There may be a separate backend admin panel (not visible in the web interface) where approvals are processed.

### Possibility 3: API/tRPC Procedures
Similar to the news scan trigger, there may be tRPC procedures that can be called to approve/reject applications, but no UI buttons exist yet.

## What Needs to Be Built

To make the vetting system fully functional with a user-friendly interface, the following features need to be added:

1. **Approve Button** - For each pending application
2. **Reject Button** - For each pending application  
3. **Review Notes Input Field** - Text area to enter notes before approving/rejecting
4. **Email Notification** - Automatically send credentials to approved users
5. **Status Filter** - Filter applications by Pending/Approved/Rejected

## Recommendation

The user needs either:
A) Interactive UI buttons added to the admin vetting page
B) Instructions on how to use the current backend method (database or API)
C) Both - UI for ease of use, plus documentation of the backend method

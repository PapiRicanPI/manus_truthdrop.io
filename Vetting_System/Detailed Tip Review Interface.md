# Detailed Tip Review Interface

## Review Modal/Dialog

When clicking "Review" on a tip, a detailed review interface opens showing complete tip information and action options.

### Tip Information Displayed

1. **Organization Name** - "Test Fraud Organization"
2. **Submission Date** - "Submitted Dec 8, 2025, 07:14 PM"
3. **Location** - "Test City, Test State"
4. **Estimated Fraud Amount** - "$100,000"
5. **Tipster Name** - "Anonymous Tipster" (or actual name if provided)
6. **Tipster Email** - "test@example.com" (clickable link to send email)
7. **Description** - Full text: "This is a test tip submission for fraud investigation."
8. **Evidence Links** - Clickable URLs provided by tipster:
   - https://example.com/evidence1
   - https://example.com/evidence2

### Status Management

**Update Status Dropdown** - Allows changing tip status to:
- **Pending** - Initial status, awaiting review
- **Under Review** - Investigation in progress
- **Published** - Converted to published case file
- **Rejected** - Not credible or relevant

### Review Notes Section

**Review Notes Text Area** - Large text field where admins can:
- Add notes about the investigation
- Document why a tip was approved or rejected
- Record follow-up actions needed
- Note communications with the tipster

Placeholder text: "Add notes about this tip review..."

### Action Buttons

1. **Update Status** (Orange button) - Saves the status change and review notes
2. **Cancel** - Closes the review dialog without saving changes
3. **Close** (X button in corner) - Closes the review dialog

### Workflow Actions

**To Mark as Under Review:**
1. Select "Under Review" from status dropdown
2. Add notes explaining investigation plan
3. Click "Update Status"

**To Publish as Case File:**
1. Select "Published" from status dropdown
2. Add notes summarizing investigation findings
3. Click "Update Status"
4. The tip is converted to a full case file in the database

**To Reject:**
1. Select "Rejected" from status dropdown
2. Add notes explaining why (not credible, duplicate, insufficient evidence, etc.)
3. Click "Update Status"

### Contact Tipster

The email address is clickable, allowing admins to:
- Click to open email client
- Contact tipster for more information
- Request additional evidence
- Provide updates on investigation status

### Evidence Review

Evidence links are clickable, allowing admins to:
- Review supporting documentation
- Verify claims
- Gather information for case file creation

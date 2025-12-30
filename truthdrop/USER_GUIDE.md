# Enhanced Vetting System - User Guide

**For TruthDrop.io Administrators**

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing the Vetting Dashboard](#accessing-the-vetting-dashboard)
3. [Understanding the Dashboard](#understanding-the-dashboard)
4. [Reviewing Applications](#reviewing-applications)
5. [Approving Applications](#approving-applications)
6. [Rejecting Applications](#rejecting-applications)
7. [Email Notifications](#email-notifications)
8. [Best Practices](#best-practices)
9. [FAQ](#faq)

---

## Overview

The enhanced vetting system provides a streamlined interface for managing user access applications. With one-click approve/reject buttons and automated email notifications, you can now process applications efficiently without needing to access the database directly.

### New Features:

✅ **One-Click Approval** - Approve applications with a single button click  
✅ **One-Click Rejection** - Reject applications with a single button click  
✅ **Review Notes Field** - Type your notes directly on the page  
✅ **Automated Emails** - Applicants receive emails automatically  
✅ **Password Generation** - Secure passwords generated automatically  
✅ **User Account Creation** - Accounts created automatically upon approval  
✅ **Filter Applications** - View by status (All, Pending, Approved, Rejected)  

---

## Accessing the Vetting Dashboard

**URL:** https://truthdrop.io/admin/vetting

**Login Required:** You must be logged in as an administrator.

---

## Understanding the Dashboard

### Statistics Cards

At the top of the page, you'll see four statistics cards:

| Card | Description |
|------|-------------|
| **Total Applications** | Total number of applications ever received |
| **Pending Review** | Applications waiting for your decision (⚠️ Action Required) |
| **Approved** | Total approved applications |
| **Rejected** | Total rejected applications |

### Filter Buttons

Below the statistics, you'll find filter buttons:

- **All** - Show all applications
- **Pending** - Show only applications awaiting review
- **Approved** - Show only approved applications
- **Rejected** - Show only rejected applications

---

## Reviewing Applications

Each application card displays:

### Applicant Information:
- **Name** - Full name of the applicant
- **Email** - Contact email address
- **Organization** - Institution or company (if provided)
- **Role** - Professional role or title (if provided)
- **Application Date** - When the application was submitted

### Application Details:
- **Reason for Access** - Why they want access to the database
- **Intended Use** - How they plan to use the data

### Vetting Criteria to Consider:

When reviewing, ask yourself:

1. **Legitimate Purpose?**
   - Is this for research, journalism, education, or advocacy?
   - Does the reason make sense?

2. **Professional Affiliation?**
   - Is the organization verifiable?
   - Does the email domain match the organization?

3. **Responsible Use?**
   - Do they understand the terms of use?
   - Is their intended use ethical?

4. **Verifiable Identity?**
   - Is the email address professional?
   - Can you verify this person exists?

---

## Approving Applications

### Step-by-Step Process:

1. **Read the Application**
   - Review all applicant information
   - Read the reason for access carefully
   - Read the intended use thoroughly

2. **Enter Review Notes**
   - Type your notes in the "Review Notes" text field
   - Example: "Approved for academic research purposes"
   - **Required:** You must enter notes before approving

3. **Click the "✓ Approve" Button**
   - The button is green with a checkmark
   - A confirmation dialog will appear

4. **Confirm Your Decision**
   - Click "OK" to confirm approval

### What Happens After Approval:

1. ✅ Application status changes to "Approved"
2. 🔐 A secure random password is generated (16 characters)
3. 👤 A user account is created automatically
4. 📧 An email is sent to the applicant with:
   - Login URL
   - Their email address
   - Their generated password
   - Terms of use reminder
5. 📋 The password is displayed on your screen (you can copy it if needed)

### Example Approval Email (Sent Automatically):

```
Subject: Your Access to The Vault Investigates - Approved ✓

Dear [Name],

Your application for access to The Vault Investigates database has been approved.

Login Credentials:
- URL: https://truthdrop.io/login
- Email: [their email]
- Password: [generated password]

Please change your password after your first login.

Review Notes: [your notes]

Terms of Use Reminder:
- Use data responsibly and ethically
- Properly cite The Vault Investigates as a source
...

Best regards,
The Vault Investigates Team
```

---

## Rejecting Applications

### Step-by-Step Process:

1. **Read the Application**
   - Identify why it doesn't meet criteria

2. **Enter Review Notes**
   - Type a clear, polite explanation
   - Example: "Application lacks sufficient detail about intended use"
   - **Required:** You must enter notes before rejecting

3. **Click the "✗ Reject" Button**
   - The button is red with an X
   - A confirmation dialog will appear

4. **Confirm Your Decision**
   - Click "OK" to confirm rejection

### What Happens After Rejection:

1. ❌ Application status changes to "Rejected"
2. 📧 An email is sent to the applicant with:
   - Polite notification of rejection
   - Your review notes (reason for rejection)
   - Information about reapplying
3. 🚫 No user account is created

### Example Rejection Email (Sent Automatically):

```
Subject: Update on Your Application to The Vault Investigates

Dear [Name],

Thank you for your interest in The Vault Investigates.

After careful review, we are unable to approve your application at this time.

Review Notes: [your notes]

You are welcome to reapply in the future with a more detailed application.

Best regards,
The Vault Investigates Team
```

---

## Email Notifications

### Automated Emails:

The system automatically sends emails for:

1. **Approval** - Sent immediately when you click "Approve"
2. **Rejection** - Sent immediately when you click "Reject"

### Manual Emails (Optional):

You no longer need to manually send emails! The system handles this automatically.

However, if you want to send a custom email, you can:
1. Copy the applicant's email address
2. Compose a custom message in your email client

---

## Best Practices

### Review Notes Guidelines:

**Good Review Notes:**
- ✅ "Approved for academic research on poverty fraud patterns"
- ✅ "Approved for investigative journalism with major news outlet"
- ✅ "Rejected - intended use is too vague and lacks specific details"
- ✅ "Rejected - unable to verify professional affiliation"

**Poor Review Notes:**
- ❌ "OK"
- ❌ "Approved"
- ❌ "No"

### Security Tips:

1. **Verify Email Domains**
   - University emails: @university.edu
   - News organizations: @newsoutlet.com
   - Be cautious of generic emails (@gmail.com, @yahoo.com)

2. **Check for Red Flags**
   - Vague or generic reasons
   - No specific intended use
   - Suspicious organization names
   - Poor grammar or spelling (may indicate fraud)

3. **Document Your Decisions**
   - Always provide clear review notes
   - Explain your reasoning
   - This creates an audit trail

### Processing Speed:

- **Pending applications** should be reviewed within 24-48 hours
- Check the dashboard daily for new applications
- The "Pending Review" count shows how many need attention

---

## FAQ

### Q: What if I accidentally approve/reject an application?

**A:** Currently, once an application is approved or rejected, it cannot be undone through the UI. If you make a mistake, you'll need to:
- For wrongly approved: Manually deactivate the user account
- For wrongly rejected: Ask the applicant to reapply

### Q: Can I edit review notes after submitting?

**A:** No, review notes are final once submitted. Make sure to review your notes before clicking approve/reject.

### Q: What if the email fails to send?

**A:** The approval/rejection will still be processed, but the email may not be sent. Check your server logs for email errors. You can manually send the credentials to the user if needed.

### Q: How secure are the generated passwords?

**A:** Very secure! Passwords are:
- 16 characters long
- Include uppercase, lowercase, numbers, and special characters
- Randomly generated using cryptographic methods
- Hashed with bcrypt before storing in the database

### Q: Can I customize the email templates?

**A:** Yes! The email templates are in `src/server/lib/email.ts`. You can edit the HTML to match your branding.

### Q: Do I need to give the password to approved users?

**A:** No! The password is automatically emailed to them. However, it's also displayed on your screen in case you need to share it manually.

### Q: What happens if someone applies twice?

**A:** Each application is independent. You can approve or reject each one separately. Consider adding a note like "Duplicate application" if you reject the second one.

### Q: Can I bulk approve/reject applications?

**A:** Not yet. This feature can be added in the future if needed.

---

## Quick Reference Card

### Daily Routine:

1. ✅ Go to https://truthdrop.io/admin/vetting
2. ✅ Check "Pending Review" count
3. ✅ Click "Pending" filter button
4. ✅ Review each application
5. ✅ Enter review notes
6. ✅ Click "Approve" or "Reject"
7. ✅ Done! Email sent automatically

### Approval Checklist:

- [ ] Read applicant information
- [ ] Verify organization/affiliation
- [ ] Read reason for access
- [ ] Read intended use
- [ ] Enter clear review notes
- [ ] Click "✓ Approve"
- [ ] Confirm decision

### Rejection Checklist:

- [ ] Identify why application doesn't meet criteria
- [ ] Enter polite, clear review notes explaining why
- [ ] Click "✗ Reject"
- [ ] Confirm decision

---

**Need Help?**

If you encounter any issues or have questions, refer to the INSTALLATION_GUIDE.md or contact technical support.

---

**Version:** 1.0  
**Last Updated:** December 23, 2025  
**Created by:** Manus AI

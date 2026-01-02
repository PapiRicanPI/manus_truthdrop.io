# Email Notification System Investigation

## Current Status: NO AUTOMATED EMAIL SYSTEM

Based on the investigation, there is currently **NO automated email notification system** for the vetting application process.

### Evidence:
1. No email configuration visible in the admin interface
2. No tRPC procedures exist for sending approval emails
3. Generated passwords are displayed on the admin page, suggesting manual email is required
4. No "Send Email" buttons or email templates visible

## How Email Currently Works

### When a User Applies:
**What happens:** User fills out the form at https://truthdrop.io/apply and submits

**What does NOT happen automatically:**
- ✗ No email confirmation sent to the applicant
- ✗ No email notification sent to admin about new application
- ✗ Admin must manually check the vetting page for new applications

### When Admin Approves an Application:
**What happens:** Application status changes to "Approved" and a password is generated

**What does NOT happen automatically:**
- ✗ No email sent to the approved user with their credentials
- ✗ Admin must manually copy the generated password
- ✗ Admin must manually compose and send an email to the user

## Manual Email Process (Current Workflow)

Since there's no automated system, here's what the admin must do manually:

### Step 1: Check for New Applications
- Go to https://truthdrop.io/admin/vetting
- Look at the "Pending Review" count
- Manually review each pending application

### Step 2: Make Decision
- Read the application details
- Decide to approve or reject
- (Currently requires database access or backend tool to change status)

### Step 3: Send Email to Approved User
Admin must manually:
1. Copy the generated password from the admin page
2. Open their email client (Gmail, Outlook, etc.)
3. Compose an email to the applicant
4. Include the login credentials
5. Send the email

### Suggested Email Template:

```
Subject: Your Access to The Vault Investigates - Approved

Dear [Applicant Name],

Your application for access to The Vault Investigates database has been approved.

Login Credentials:
- URL: https://truthdrop.io/login
- Email: [applicant email]
- Password: [generated password]

Please change your password after your first login.

Terms of Use:
- Use data responsibly and ethically
- Properly cite The Vault Investigates as a source
- Do not misrepresent or manipulate findings
- Do not redistribute raw data without permission

If you have any questions, please contact us.

Best regards,
The Vault Investigates Team
```

## Recommendation

To improve the workflow, the following features should be built:

1. **Email Notification to Admin** - When a new application is submitted
2. **Email Confirmation to Applicant** - When they submit the form
3. **Automated Approval Email** - When admin approves, automatically send credentials
4. **Automated Rejection Email** - When admin rejects, send a polite notification
5. **Email Templates** - Pre-written templates for consistency

## Current Limitations

Without automated emails:
- Admin must manually check for new applications
- Admin must manually send credentials to approved users
- Risk of forgetting to notify users
- Time-consuming manual process
- No audit trail of emails sent

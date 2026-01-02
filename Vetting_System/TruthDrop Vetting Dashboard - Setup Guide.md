# TruthDrop Vetting Dashboard - Setup Guide

**Version:** 1.0  
**Date:** January 2, 2026  
**For:** Admin Use

---

## Overview

The TruthDrop Vetting Dashboard is a complete admin interface for managing access applications to the TruthDrop database. It features automated email notifications, secure password generation, and an elegant dark-themed interface.

### Key Features

✅ **Dashboard Statistics** - Real-time counts of total, pending, approved, and rejected applications  
✅ **Filter Functionality** - View applications by status (All, Pending, Approved, Rejected)  
✅ **Approve/Reject Buttons** - One-click approval or rejection with required review notes  
✅ **Automated Emails** - Beautiful HTML emails sent automatically to applicants  
✅ **Secure Passwords** - 16-character secure password generation for approved users  
✅ **User Account Creation** - Automatic user account creation upon approval  
✅ **Elegant Design** - Dark theme with gradient accents and smooth animations

---

## Prerequisites

Before deploying the vetting dashboard, ensure you have:

1. **Manus Account** - The project is hosted on Manus platform
2. **SMTP Email Service** - For sending automated emails (Gmail, Outlook, SendGrid, etc.)
3. **Database Access** - MySQL/TiDB database (provided by Manus)
4. **Admin Access** - You need admin role to approve/reject applications

---

## Installation Steps

### Step 1: Access Your Project

The project is already deployed at:
- **Project Name:** truthdrop-vetting-dashboard
- **Project Path:** `/home/ubuntu/truthdrop-vetting-dashboard`
- **Dev Server:** Running on port 3000

### Step 2: Configure Email Settings

Email configuration is **required** for automated notifications to work.

#### Option A: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "TruthDrop Vetting"
   - Copy the 16-character password

3. **Set Environment Variables**

Add these to your `.env` file or environment configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
SMTP_FROM=noreply@truthdrop.io
```

#### Option B: Outlook/Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=noreply@truthdrop.io
```

#### Option C: SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@truthdrop.io
```

#### Option D: Custom SMTP Server

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM=noreply@truthdrop.io
```

### Step 3: Restart the Server

After configuring email settings, restart the development server:

```bash
cd /home/ubuntu/truthdrop-vetting-dashboard
pnpm dev
```

Or if deployed, the server will automatically pick up the new environment variables.

---

## Database Schema

The vetting dashboard uses the following database table:

### `vetting_applications` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key (auto-increment) |
| `name` | TEXT | Applicant's full name |
| `email` | VARCHAR(320) | Applicant's email address |
| `organization` | TEXT | Organization name (optional) |
| `role` | TEXT | Applicant's role (optional) |
| `reason_for_access` | TEXT | Detailed reason for requesting access |
| `intended_use` | TEXT | How the data will be used |
| `status` | ENUM | 'pending', 'approved', or 'rejected' |
| `review_notes` | TEXT | Admin's review notes/feedback |
| `reviewed_at` | TIMESTAMP | When the application was reviewed |
| `reviewed_by` | INT | User ID of the reviewer |
| `generated_password` | VARCHAR(64) | Generated password (for approved) |
| `created_user_id` | INT | Created user account ID (for approved) |
| `applied_at` | TIMESTAMP | When the application was submitted |

The schema is automatically created when you run `pnpm db:push`.

---

## Testing the System

### Adding Sample Data

Sample applications have been added to the database for testing. You can add more using SQL:

```sql
INSERT INTO vetting_applications (name, email, organization, role, reason_for_access, intended_use, status, applied_at) 
VALUES (
  'Test User',
  'test@example.com',
  'Test Organization',
  'Researcher',
  'Testing the vetting system functionality',
  'Verify that approval and rejection workflows work correctly',
  'pending',
  NOW()
);
```

### Testing Approval Workflow

1. **Log in** to the dashboard (requires admin role)
2. **Find a pending application** in the list
3. **Click "Approve"** button
4. **Enter review notes** (required field)
5. **Click "Approve & Send Email"**
6. **Verify:**
   - Application status changes to "Approved"
   - Generated password is displayed
   - Email is sent to applicant
   - User account is created in database
   - Success toast notification appears

### Testing Rejection Workflow

1. **Find a pending application**
2. **Click "Reject"** button
3. **Enter feedback/review notes** (required field)
4. **Click "Reject & Send Email"**
5. **Verify:**
   - Application status changes to "Rejected"
   - Email is sent to applicant with feedback
   - Success toast notification appears

### Testing Filter Functionality

1. **Click "All Applications"** - Shows all applications
2. **Click "Pending"** - Shows only pending applications
3. **Click "Approved"** - Shows only approved applications
4. **Click "Rejected"** - Shows only rejected applications

---

## Troubleshooting

### Problem: Emails Not Sending

**Symptoms:**
- Approval/rejection works, but email notification fails
- Toast shows "Approved, but email failed to send"

**Solutions:**

1. **Check SMTP Configuration**
   - Verify all environment variables are set correctly
   - Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS are correct

2. **Gmail App Password Issues**
   - Make sure you're using an App Password, not your regular password
   - Verify 2-Step Verification is enabled
   - Generate a new App Password if needed

3. **Port Blocking**
   - Port 587 might be blocked by firewall
   - Try port 465 with `secure: true` setting
   - Contact your hosting provider

4. **Check Server Logs**
   - Look for email errors in the console
   - Check for authentication failures

### Problem: Applications Not Appearing

**Symptoms:**
- Dashboard shows "No applications found"
- Statistics show 0 for all counts

**Solutions:**

1. **Check Database Connection**
   - Verify DATABASE_URL environment variable is set
   - Test database connection

2. **Add Sample Data**
   - Use the SQL insert statement provided above
   - Verify data exists: `SELECT * FROM vetting_applications;`

3. **Check Authentication**
   - Make sure you're logged in
   - Verify your user has admin role

### Problem: Review Notes Required Error

**Symptoms:**
- Can't approve/reject without review notes
- Error toast appears

**Solution:**
- This is by design - review notes are **required**
- Enter meaningful feedback before approving or rejecting
- Review notes are sent to the applicant via email

### Problem: TypeScript Errors

**Symptoms:**
- Red underlines in code
- Build fails

**Solutions:**

1. **Install Dependencies**
   ```bash
   cd /home/ubuntu/truthdrop-vetting-dashboard
   pnpm install
   ```

2. **Restart TypeScript Server**
   - In VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

3. **Check for Missing Imports**
   - Ensure all components are properly imported

---

## Security Considerations

### Password Generation

- Passwords are 16 characters long
- Include uppercase, lowercase, numbers, and special characters
- Generated using cryptographically secure random methods
- Stored in database for admin reference only

### Email Security

- SMTP credentials should be kept secure
- Use App Passwords instead of regular passwords
- Never commit `.env` files to version control
- Rotate SMTP passwords regularly

### Access Control

- Only admin users can access the vetting dashboard
- All approve/reject actions are logged with reviewer ID
- Review notes are required for transparency

---

## Email Templates

### Approval Email

The approval email includes:
- Congratulations message
- Login credentials (email and generated password)
- Review notes from admin
- Link to login page
- Security notice to change password
- TruthDrop branding

### Rejection Email

The rejection email includes:
- Polite rejection message
- Detailed feedback from admin
- Option to submit new application
- Contact information for questions
- TruthDrop branding

Both emails are beautifully designed with:
- Responsive HTML layout
- Gradient headers
- Clear typography
- Professional styling
- Mobile-friendly design

---

## Maintenance

### Regular Tasks

1. **Monitor Pending Applications**
   - Check dashboard daily for new applications
   - Respond within 24-48 hours

2. **Review Email Delivery**
   - Verify emails are being sent successfully
   - Check spam folders if applicants report not receiving emails

3. **Database Backups**
   - Regularly backup the `vetting_applications` table
   - Keep records of all decisions

4. **Update SMTP Credentials**
   - Rotate passwords every 90 days
   - Update environment variables accordingly

### Scaling Considerations

As your application volume grows:

1. **Add Pagination**
   - Modify the list query to include pagination
   - Add page navigation controls

2. **Add Search Functionality**
   - Search by name, email, or organization
   - Filter by date range

3. **Add Bulk Actions**
   - Approve/reject multiple applications at once
   - Export applications to CSV

4. **Add Email Queue**
   - Use a job queue for email sending
   - Retry failed emails automatically

---

## Support

### Getting Help

If you encounter issues:

1. **Check this documentation first**
2. **Review the troubleshooting section**
3. **Check server logs for errors**
4. **Contact Manus support** at https://help.manus.im

### Reporting Bugs

When reporting issues, include:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Server logs or error messages

---

## Summary

**Setup Checklist:**

- [x] Project deployed on Manus
- [ ] SMTP email configured
- [ ] Environment variables set
- [ ] Server restarted
- [ ] Sample data added
- [ ] Approval workflow tested
- [ ] Rejection workflow tested
- [ ] Email delivery verified

**Next Steps:**

1. Configure SMTP email settings
2. Test approval and rejection workflows
3. Verify email delivery
4. Start reviewing real applications

**Key URLs:**

- Dashboard: https://3000-iwuh0o57gxopsdehq3brr-2cf659e1.manus-asia.computer
- Manus Support: https://help.manus.im

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Created by:** Manus AI for TruthDrop.io

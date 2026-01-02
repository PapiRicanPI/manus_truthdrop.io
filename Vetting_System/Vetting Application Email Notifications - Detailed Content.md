# Vetting Application Email Notifications - Detailed Content

**For TruthDrop.io Enhanced Vetting System**

---

## Overview

When an admin approves or rejects a vetting application, the system automatically sends a professionally formatted HTML email to the applicant. The emails are branded with The Vault Investigates styling and include all necessary information.

---

## Approval Email

### Email Header Information

**From:** "The Vault Investigates" <noreply@truthdrop.io>  
**To:** [Applicant's Email Address]  
**Subject:** Your Access to The Vault Investigates - Approved ✓

### Email Content

The approval email contains the following sections:

#### 1. Header Section
- **The Vault Investigates** logo/branding (dark background with orange accent)
- **"Access Approved"** subtitle

#### 2. Greeting
```
Dear [Applicant's Full Name],

Your application for access to The Vault Investigates database has been approved.
```

#### 3. Login Credentials Box
This section is highlighted with a special border and contains:

```
Your Login Credentials:

URL: https://truthdrop.io/login
Email: [Applicant's Email]
Password: [16-character randomly generated password]
```

**Note:** The password is displayed in a monospace font, large size, and bold for easy reading.

#### 4. Security Warning
```
⚠️ Important: Please change your password after your first login for security.
```

#### 5. Review Notes Section
```
Review Notes:
[Admin's review notes explaining why the application was approved]
```

This personalizes the email and provides context for the approval decision.

#### 6. Terms of Use Reminder

The email includes a reminder of the key terms:

- Use data responsibly and ethically
- Properly cite The Vault Investigates as a source
- Do not misrepresent or manipulate findings
- Do not redistribute raw data without permission
- Comply with all applicable laws and regulations

#### 7. Call-to-Action Button

A prominent orange button labeled **"Login Now"** that links directly to:  
https://truthdrop.io/login

#### 8. Closing Message
```
We look forward to seeing the results of your work.

Best regards,
The Vault Investigates Team
```

#### 9. Footer
```
This is an automated message. Please do not reply to this email.
© 2025 The Vault Investigates. All rights reserved.
```

---

## Rejection Email

### Email Header Information

**From:** "The Vault Investigates" <noreply@truthdrop.io>  
**To:** [Applicant's Email Address]  
**Subject:** Update on Your Application to The Vault Investigates

### Email Content

The rejection email contains the following sections:

#### 1. Header Section
- **The Vault Investigates** logo/branding (dark background with orange accent)
- **"Application Update"** subtitle

#### 2. Greeting
```
Dear [Applicant's Full Name],

Thank you for your interest in The Vault Investigates.
```

#### 3. Rejection Notice
```
After careful review, we are unable to approve your application at this time.
```

This is stated politely and professionally.

#### 4. Review Notes Section
```
Review Notes:
[Admin's review notes explaining why the application was rejected]
```

This provides transparency and helps the applicant understand the decision.

#### 5. Reapplication Information

The email encourages reapplication with improved details:

```
You are welcome to reapply in the future with a more detailed application that addresses our vetting criteria:

- Legitimate research, journalistic, or educational purpose
- Professional affiliation with a verifiable organization
- Clear commitment to responsible data use
- Verifiable identity
```

#### 6. Closing Message
```
We appreciate your understanding.

Best regards,
The Vault Investigates Team
```

#### 7. Footer
```
This is an automated message. Please do not reply to this email.
© 2025 The Vault Investigates. All rights reserved.
```

---

## Email Design & Styling

Both emails use professional HTML styling:

### Color Scheme
- **Background:** Light gray (#f9f9f9)
- **Header:** Dark black (#1a1a1a)
- **Accent Color:** Orange (#f59e0b) - matches TruthDrop.io branding
- **Text:** Dark gray (#333)

### Typography
- **Font:** Arial, sans-serif (web-safe)
- **Line Height:** 1.6 (for readability)
- **Password Display:** Monospace font, 18px, bold

### Layout
- **Max Width:** 600px (optimal for email clients)
- **Responsive:** Works on desktop and mobile devices
- **Padding:** Generous spacing for readability

### Special Elements
- **Credentials Box:** White background with orange left border (4px)
- **Button:** Orange background, black text, rounded corners
- **Links:** Clickable and properly formatted

---

## Example Email Scenarios

### Example 1: Approved Application

**Applicant:** Dr. Sarah Johnson  
**Email:** sjohnson@university.edu  
**Generated Password:** aB3$xK9mP2qL7nR5

**Email Preview:**
```
Subject: Your Access to The Vault Investigates - Approved ✓

Dear Dr. Sarah Johnson,

Your application for access to The Vault Investigates database has been approved.

Your Login Credentials:
URL: https://truthdrop.io/login
Email: sjohnson@university.edu
Password: aB3$xK9mP2qL7nR5

Review Notes:
Approved for academic research on poverty fraud patterns in urban areas. 
Dr. Johnson's credentials and research proposal demonstrate legitimate scholarly purpose.

[Terms of Use section]
[Login Now button]

Best regards,
The Vault Investigates Team
```

### Example 2: Rejected Application

**Applicant:** John Doe  
**Email:** johndoe123@gmail.com

**Email Preview:**
```
Subject: Update on Your Application to The Vault Investigates

Dear John Doe,

Thank you for your interest in The Vault Investigates.

After careful review, we are unable to approve your application at this time.

Review Notes:
Application lacks sufficient detail about intended use and professional affiliation. 
Please reapply with more specific information about your research purpose and 
verifiable organizational credentials.

You are welcome to reapply in the future with a more detailed application...

Best regards,
The Vault Investigates Team
```

---

## Technical Details

### Email Delivery
- **Protocol:** SMTP
- **Port:** 587 (TLS)
- **Authentication:** Username/password
- **Format:** HTML with plain text fallback

### Configuration
Emails are configured via environment variables:
- `SMTP_HOST` - Email server hostname
- `SMTP_PORT` - Server port (default: 587)
- `SMTP_USER` - Authentication username
- `SMTP_PASS` - Authentication password
- `SMTP_FROM` - Sender email address

### Reliability
- Emails are sent asynchronously
- If email sending fails, the approval/rejection still processes
- Errors are logged for admin review
- Admins can manually send credentials if needed

---

## Customization Options

The email templates can be customized by editing `/home/ubuntu/truthdrop/src/server/lib/email.ts`:

### What You Can Customize:
1. **Colors** - Change the color scheme to match branding
2. **Logo** - Add an image logo instead of text
3. **Footer Text** - Update copyright or contact information
4. **Terms of Use** - Modify the terms list
5. **Button Text** - Change "Login Now" to something else
6. **Subject Lines** - Adjust email subject text
7. **Sender Name** - Change "The Vault Investigates" to another name

### What You Should NOT Change:
- The password display (must remain clear and readable)
- The login URL (must be accurate)
- The review notes section (provides transparency)
- The basic structure (ensures compatibility with email clients)

---

## Best Practices for Admin Review Notes

When approving or rejecting applications, your review notes will be included in the email. Follow these guidelines:

### Good Review Notes (Approval):
- ✅ "Approved for academic research on poverty fraud patterns"
- ✅ "Approved for investigative journalism with major news outlet"
- ✅ "Approved for nonprofit advocacy work on behalf of fraud victims"

### Good Review Notes (Rejection):
- ✅ "Application lacks sufficient detail about intended use"
- ✅ "Unable to verify professional affiliation with stated organization"
- ✅ "Intended use does not align with database purpose"

### Poor Review Notes:
- ❌ "OK"
- ❌ "Approved"
- ❌ "No"
- ❌ "Rejected because I said so"

**Remember:** Your review notes are visible to the applicant, so be professional, clear, and constructive.

---

**Version:** 1.0  
**Last Updated:** December 23, 2025  
**Created by:** Manus AI

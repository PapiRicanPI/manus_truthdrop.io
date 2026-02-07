# Enhanced Vetting System - Installation Guide

## Overview

This package contains the enhanced vetting system for TruthDrop.io with the following features:

✅ **Approve/Reject Buttons** - One-click approval or rejection from the admin interface  
✅ **Review Notes Input** - Add notes directly on the admin page  
✅ **Automated Email Notifications** - Automatic emails to applicants upon approval/rejection  
✅ **Password Generation** - Secure random passwords generated for approved users  
✅ **User Account Creation** - Automatically creates user accounts for approved applicants  

---

## Files Included

```
src/
├── server/
│   ├── api/
│   │   └── routers/
│   │       └── vetting.ts          # tRPC router with approve/reject procedures
│   └── lib/
│       └── email.ts                # Email service for notifications
├── components/
│   └── admin/
│       └── VettingApplications.tsx # React component with UI buttons
prisma/
└── schema-vetting.prisma           # Database schema
.env.example                        # Environment variables template
```

---

## Installation Steps

### Step 1: Backup Your Current Site

Before making any changes, create a backup of your current TruthDrop.io site.

### Step 2: Update Database Schema

1. Open your `prisma/schema.prisma` file
2. Add the contents from `prisma/schema-vetting.prisma` to your schema
3. Run the migration:

```bash
npx prisma migrate dev --name add_vetting_system
```

### Step 3: Install Dependencies

Install the required npm packages:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### Step 4: Copy Files to Your Project

Copy the following files to your project:

1. **Copy `src/server/api/routers/vetting.ts`** to your project's router directory
2. **Copy `src/server/lib/email.ts`** to your project's lib directory
3. **Copy `src/components/admin/VettingApplications.tsx`** to your components directory

### Step 5: Register the Router

In your `src/server/api/root.ts` file, add the vetting router:

```typescript
import { vettingRouter } from "./routers/vetting";

export const appRouter = createTRPCRouter({
  // ... your existing routers
  vetting: vettingRouter,
});
```

### Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your SMTP email settings:

```env
# For Gmail:
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"  # Use App Password, not regular password
SMTP_FROM="noreply@truthdrop.io"
ADMIN_EMAIL="tainorican2n@gmail.com"
```

**Important:** For Gmail, you need to create an "App Password":
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App Passwords → Generate new app password
4. Use that password in `SMTP_PASS`

### Step 7: Update Your Admin Page

Replace your current admin vetting page with the new component:

```typescript
// In your admin vetting page file (e.g., pages/admin/vetting.tsx)
import VettingApplications from "~/components/admin/VettingApplications";

export default function AdminVettingPage() {
  return <VettingApplications />;
}
```

### Step 8: Deploy

1. Commit your changes to Git:
```bash
git add .
git commit -m "Add enhanced vetting system with approve/reject buttons"
git push
```

2. Deploy to your hosting platform (Vercel, Netlify, etc.)

---

## Testing the System

### Test Approval Flow:

1. Go to https://truthdrop.io/apply
2. Submit a test application
3. Go to https://truthdrop.io/admin/vetting
4. You should see the application with:
   - ✓ Approve button
   - ✗ Reject button
   - Review notes input field
5. Enter review notes and click "Approve"
6. Check that:
   - Application status changes to "Approved"
   - Password is generated and displayed
   - Email is sent to the applicant

### Test Rejection Flow:

1. Submit another test application
2. Enter review notes and click "Reject"
3. Check that:
   - Application status changes to "Rejected"
   - Email is sent to the applicant

---

## Email Configuration Tips

### Using Gmail:

1. Enable 2-Step Verification
2. Generate an App Password
3. Use the App Password in your `.env` file

### Using Other Email Providers:

**Outlook/Office 365:**
```env
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
```

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

**Mailgun:**
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
```

---

## Troubleshooting

### Email Not Sending:

1. Check your SMTP credentials in `.env`
2. Make sure you're using an App Password (for Gmail)
3. Check server logs for error messages
4. Test SMTP connection:

```bash
node -e "require('./src/server/lib/email').sendApprovalEmail({to:'test@example.com',name:'Test',password:'test123',reviewNotes:'Test'})"
```

### Buttons Not Appearing:

1. Make sure you imported the new component
2. Check browser console for errors
3. Verify tRPC router is registered

### Database Errors:

1. Make sure you ran the Prisma migration
2. Check that your `DATABASE_URL` is correct
3. Run `npx prisma generate` to regenerate the Prisma client

---

## Security Notes

- ✅ Passwords are hashed with bcrypt before storing
- ✅ Only admins can approve/reject applications
- ✅ Review notes are required for all decisions
- ✅ Email credentials are stored in environment variables (never in code)
- ✅ Generated passwords are 16 characters with special characters

---

## Support

If you encounter any issues during installation:

1. Check the troubleshooting section above
2. Review the error messages in your server logs
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

---

## What's Next?

After successful installation, you can:

1. **Customize email templates** in `src/server/lib/email.ts`
2. **Adjust vetting criteria** in the application form
3. **Add more admin features** like bulk approval
4. **Set up email notifications** for new applications

---

**Version:** 1.0  
**Last Updated:** December 23, 2025  
**Created by:** Manus AI

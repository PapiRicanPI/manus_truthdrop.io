# Enhanced Vetting System - Deployment Guide

**For TruthDrop.io**

---

## Quick Deployment Steps

Since I cannot push directly to GitHub (requires authentication), here's how you can deploy the enhanced vetting system:

### Option 1: Upload via GitHub Web Interface (Easiest)

**Step 1: Download the ZIP file**
- The file `truthdrop-enhanced-vetting.zip` is attached to this message
- Download it to your computer
- Extract the ZIP file

**Step 2: Go to your GitHub repository**
- Visit: https://github.com/PapiRicanPI/manus_truthdrop.io

**Step 3: Upload files**
- Click "Add file" → "Upload files"
- Drag and drop ALL the extracted files
- Or click "choose your files" and select them
- Add commit message: "Add enhanced vetting system with approve/reject buttons"
- Click "Commit changes"

**Step 4: Deploy to Manus**
- Contact Manus support or use the deployment interface
- Tell them to deploy from your GitHub repository
- The system will automatically install dependencies and deploy

---

### Option 2: Use Git Command Line (If You Have Git Installed)

**Step 1: Clone the repository**
```bash
git clone https://github.com/PapiRicanPI/manus_truthdrop.io.git
cd manus_truthdrop.io
```

**Step 2: Extract and copy files**
- Extract `truthdrop-enhanced-vetting.zip`
- Copy all files into the cloned repository folder

**Step 3: Commit and push**
```bash
git add .
git commit -m "Add enhanced vetting system"
git push origin main
```

---

### Option 3: Ask Manus to Deploy Directly

If TruthDrop.io was originally created by Manus, you can:

1. Share the `truthdrop-enhanced-vetting.zip` file with Manus support
2. Ask them to integrate it into your existing deployment
3. They can merge the code with your current site

---

## What's Included in the Package

### Core Files:

1. **src/server/api/routers/vetting.ts** - tRPC procedures for approve/reject
2. **src/server/lib/email.ts** - Email service with templates
3. **src/components/admin/VettingApplications.tsx** - Enhanced UI component
4. **prisma/schema-vetting.prisma** - Database schema
5. **.env.example** - Environment variables template

### Documentation:

1. **README.md** - Overview and quick start
2. **INSTALLATION_GUIDE.md** - Detailed setup instructions
3. **USER_GUIDE.md** - How to use the system
4. **package.json** - Dependencies list

---

## After Deployment: Configuration Required

### 1. Set Up Email (SMTP)

You need to configure email settings for automated notifications.

**For Gmail (Recommended):**

1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "TruthDrop Vetting"
   - Copy the generated password

3. Add to your environment variables (`.env` file):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
SMTP_FROM=noreply@truthdrop.io
```

**For Other Email Services:**

See the INSTALLATION_GUIDE.md for configuration details for:
- Outlook/Office 365
- SendGrid
- Mailgun
- Amazon SES

### 2. Run Database Migration

After deployment, run this command to update the database:

```bash
npx prisma migrate dev
```

This creates the necessary database tables for the vetting system.

### 3. Install Dependencies

If not done automatically, run:

```bash
npm install
```

This installs all required packages including:
- nodemailer (for emails)
- Other dependencies

---

## Testing the Deployment

### Test 1: Check the Vetting Page

1. Go to: https://truthdrop.io/admin/vetting
2. You should see the enhanced interface with:
   - Approve and Reject buttons
   - Review notes input field
   - Application statistics

### Test 2: Test Approval Email

1. Find a pending application
2. Enter review notes
3. Click "Approve"
4. Check that:
   - Status changes to "Approved"
   - Email is sent to applicant
   - Password is generated

### Test 3: Test Rejection Email

1. Find a pending application
2. Enter review notes explaining rejection
3. Click "Reject"
4. Check that:
   - Status changes to "Rejected"
   - Email is sent to applicant

---

## Troubleshooting

### Problem: Buttons Don't Appear

**Solution:** Clear browser cache and refresh the page

### Problem: Emails Not Sending

**Possible Causes:**
- SMTP credentials not configured
- App password incorrect
- Firewall blocking port 587

**Solution:** Check environment variables and test SMTP connection

### Problem: Database Errors

**Solution:** Run the database migration:
```bash
npx prisma migrate dev
```

### Problem: "Module not found" Errors

**Solution:** Install dependencies:
```bash
npm install
```

---

## Getting Help

### If You Need Assistance:

1. **Check the documentation** in the package
2. **Review error messages** in the browser console
3. **Ask me for help** - I can guide you through any issues

### Common Questions:

**Q: Can I customize the email templates?**  
A: Yes! Edit `/src/server/lib/email.ts`

**Q: Can I change the approval workflow?**  
A: Yes! Edit `/src/server/api/routers/vetting.ts`

**Q: Can I add more fields to the vetting form?**  
A: Yes! Update the database schema and UI component

---

## Next Steps After Deployment

1. **Test the system thoroughly**
2. **Configure email settings**
3. **Train your moderators** on the new interface
4. **Review pending applications** using the new buttons
5. **Monitor email delivery** to ensure notifications work

---

## Summary

**What You're Deploying:**
- Enhanced vetting page with approve/reject buttons
- Automated email notifications (approval & rejection)
- Review notes system
- Password generation for approved users
- User account creation on approval

**What You Need to Do:**
1. Upload files to GitHub (or use one of the deployment options)
2. Configure SMTP email settings
3. Run database migration
4. Test the system

---

**Need Help?** Just ask me and I'll guide you through any step!

**Created by:** Manus AI  
**For:** Papi Rican Blue / TruthDrop.io

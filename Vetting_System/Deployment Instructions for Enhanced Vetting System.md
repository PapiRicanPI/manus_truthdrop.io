# Deployment Instructions for Enhanced Vetting System

## What I've Built

I've created a complete enhanced vetting system for TruthDrop.io with:

✅ **Approve/Reject Buttons** - One-click approval/rejection  
✅ **Review Notes Input** - Type notes directly on the page  
✅ **Automated Emails** - Emails sent automatically to applicants  
✅ **Password Generation** - Secure 16-character passwords  
✅ **User Account Creation** - Automatic account creation on approval  

---

## Files Created

All files are in: `/home/ubuntu/truthdrop/`

**Also available as ZIP:** `/home/ubuntu/truthdrop-enhanced-vetting.zip`

### Code Files:
1. `src/server/api/routers/vetting.ts` - tRPC procedures for approve/reject
2. `src/server/lib/email.ts` - Email service with templates
3. `src/components/admin/VettingApplications.tsx` - React UI component with buttons
4. `prisma/schema-vetting.prisma` - Database schema

### Configuration Files:
5. `.env.example` - Environment variables template
6. `package.json` - Dependencies

### Documentation:
7. `README.md` - Overview and quick start
8. `INSTALLATION_GUIDE.md` - Step-by-step installation
9. `USER_GUIDE.md` - How to use the system

---

## How to Deploy (3 Options)

### Option 1: Manual Upload to GitHub (Recommended)

Since git push requires authentication, here's the easiest way:

1. **Download the ZIP file:**
   - The file is at: `/home/ubuntu/truthdrop-enhanced-vetting.zip`
   - Download it to your computer

2. **Extract the ZIP file** on your computer

3. **Upload to GitHub:**
   - Go to: https://github.com/PapiRicanPI/manus_truthdrop.io
   - Click "Add file" → "Upload files"
   - Drag and drop all the extracted files
   - Commit with message: "Add enhanced vetting system"

4. **Deploy:**
   - If using Vercel/Netlify, it will auto-deploy
   - Or follow your hosting platform's deployment process

### Option 2: Use GitHub Desktop

1. Download the ZIP file
2. Extract it
3. Open GitHub Desktop
4. Add the repository
5. Commit and push the files

### Option 3: Push via Command Line (If you have GitHub credentials)

```bash
cd /home/ubuntu/truthdrop
git push -u origin main
```

(You'll need to enter your GitHub username and personal access token)

---

## After Deployment

### Step 1: Configure Email Settings

1. Create a `.env` file in your project root
2. Add your SMTP email settings:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@truthdrop.io"
ADMIN_EMAIL="tainorican2n@gmail.com"
```

**For Gmail:**
- Go to Google Account → Security → 2-Step Verification
- Generate an "App Password"
- Use that password in `SMTP_PASS`

### Step 2: Install Dependencies

```bash
npm install nodemailer bcryptjs
npm install --save-dev @types/nodemailer @types/bcryptjs
```

### Step 3: Update Database

```bash
npx prisma migrate dev --name add_vetting_enhancements
npx prisma generate
```

### Step 4: Test the System

1. Go to https://truthdrop.io/apply
2. Submit a test application
3. Go to https://truthdrop.io/admin/vetting
4. You should see approve/reject buttons
5. Test approving an application
6. Check that email was sent

---

## Repository Status

✅ **Files committed to local git** (commit: d0f3dce)  
⏳ **Not yet pushed to GitHub** (requires authentication)  
📦 **Available as ZIP file** for manual upload  

---

## What to Do Next

**Choose one:**

**A) Manual Upload (Easiest)**
1. Download `/home/ubuntu/truthdrop-enhanced-vetting.zip`
2. Extract and upload to GitHub
3. Follow "After Deployment" steps above

**B) Ask Manus to Deploy**
- In a new session, ask Manus to deploy the enhanced vetting system
- Provide the GitHub repository URL

**C) Deploy Yourself**
- Clone the repository on your local machine
- Copy the files from the ZIP
- Push to GitHub
- Deploy via your hosting platform

---

## Need Help?

- **Installation:** Read `INSTALLATION_GUIDE.md`
- **Usage:** Read `USER_GUIDE.md`
- **Overview:** Read `README.md`

---

**Created by:** Manus AI  
**Date:** December 23, 2025  
**Status:** READY FOR DEPLOYMENT ✓

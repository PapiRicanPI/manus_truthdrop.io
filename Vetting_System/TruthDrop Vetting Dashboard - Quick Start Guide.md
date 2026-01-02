# TruthDrop Vetting Dashboard - Quick Start Guide

**Get started in 5 minutes!**

---

## What is This?

The TruthDrop Vetting Dashboard is your admin interface for reviewing and managing access applications to the TruthDrop database. It features:

✅ **One-click approve/reject** with automated emails  
✅ **Real-time statistics** showing pending, approved, and rejected counts  
✅ **Beautiful interface** with dark theme and smooth animations  
✅ **Secure passwords** automatically generated for approved users  

---

## Step 1: Access the Dashboard

**URL:** https://3000-iwuh0o57gxopsdehq3brr-2cf659e1.manus-asia.computer

1. Click the link above
2. Sign in with your admin credentials
3. You'll see the main dashboard

---

## Step 2: Configure Email (Required)

For automated emails to work, you need to set up SMTP.

### Using Gmail (Easiest)

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Copy the 16-character password

3. **Add to Environment Variables**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@truthdrop.io
```

4. **Restart the server** to apply changes

---

## Step 3: Review Applications

### Understanding the Dashboard

**Top Section - Statistics:**
- **Total Applications** - All applications ever submitted
- **Pending Review** (Orange) - Need your attention!
- **Approved** (Green) - Access granted
- **Rejected** (Red) - Access denied

**Filter Buttons:**
- Click "Pending" to see what needs review
- Click "Approved" to see past approvals
- Click "Rejected" to see past rejections
- Click "All Applications" to see everything

**Application Cards:**
Each card shows:
- Applicant name and email
- Organization and role
- Reason for access
- Intended use
- Current status

---

## Step 4: Approve an Application

1. **Find a pending application** (orange badge)
2. **Read the application carefully**
   - Check the reason for access
   - Check the intended use
   - Verify it's legitimate

3. **Click the green "Approve" button**

4. **Enter review notes** (required)
   - Example: "Approved for academic research purposes"
   - Be specific and professional

5. **Click "Approve & Send Email"**

6. **Done!** The system automatically:
   - ✅ Generates a secure password
   - ✅ Creates a user account
   - ✅ Sends email with login credentials
   - ✅ Updates the application status

---

## Step 5: Reject an Application

1. **Find a pending application**

2. **Click the red "Reject" button**

3. **Enter feedback** (required)
   - Explain why you're rejecting it
   - Be constructive and professional
   - Example: "Insufficient detail about research methodology. Please reapply with more specific information."

4. **Click "Reject & Send Email"**

5. **Done!** The system automatically:
   - ✅ Sends email with your feedback
   - ✅ Updates the application status

---

## Common Questions

### Q: What if I don't have any applications?

**A:** Sample applications have been added for testing. You can also add more using SQL or wait for real applications to come in.

### Q: What if the email fails to send?

**A:** You'll see a warning message. The application is still approved/rejected, but you'll need to manually send the credentials. Check your SMTP settings.

### Q: Can I undo an approval or rejection?

**A:** No, decisions are final. The applicant has already received an email. Be careful before clicking the final button!

### Q: How long are the passwords?

**A:** All passwords are exactly 16 characters long and include uppercase, lowercase, numbers, and special characters for security.

### Q: Can I approve without review notes?

**A:** No, review notes are required for both approval and rejection. This ensures transparency and provides feedback to applicants.

---

## Tips for Success

### ✅ DO:
- Review applications thoroughly
- Provide detailed review notes
- Respond within 24-48 hours
- Be professional and respectful
- Verify credentials when possible

### ❌ DON'T:
- Rush through reviews
- Use vague review notes ("OK", "Approved")
- Ignore red flags
- Share generated passwords outside the system
- Approve suspicious applications

---

## Sample Review Notes

### Good Approval Notes:
✅ "Approved for PhD research on poverty fraud patterns. Academic credentials verified."  
✅ "Legitimate investigative journalist with verified media credentials. Approved for investigative reporting."  
✅ "Policy analyst from reputable NGO. Approved for advocacy and policy research."

### Good Rejection Notes:
✅ "Insufficient detail provided about intended use. Please reapply with more specific information about your research methodology."  
✅ "Unable to verify organizational affiliation. Please provide additional credentials."  
✅ "The intended use does not align with TruthDrop's mission."

---

## Troubleshooting

### Problem: Can't log in

**Solution:**
- Verify you have admin credentials
- Check that you're using the correct URL
- Clear browser cache and try again

### Problem: No applications showing

**Solution:**
- Sample data has been added - refresh the page
- Check that you're logged in
- Try clicking "All Applications" filter

### Problem: Emails not sending

**Solution:**
- Check SMTP configuration
- Verify Gmail App Password is correct
- Check server logs for errors
- See full Setup Guide for detailed troubleshooting

---

## Next Steps

1. **Test the system** with sample applications
2. **Verify email delivery** by checking your inbox
3. **Read the full Admin Manual** for detailed guidance
4. **Start reviewing real applications** as they come in

---

## Important Links

- **Dashboard:** https://3000-iwuh0o57gxopsdehq3brr-2cf659e1.manus-asia.computer
- **Full Setup Guide:** TruthDrop_Vetting_Dashboard_Setup_Guide.md
- **Admin Manual:** TruthDrop_Vetting_Dashboard_Admin_Manual.md
- **Technical Docs:** TruthDrop_Vetting_Dashboard_Technical_Documentation.md
- **Manus Support:** https://help.manus.im

---

## Need Help?

- **For setup issues:** Read the Setup Guide
- **For daily operations:** Read the Admin Manual
- **For technical issues:** Contact Manus support at https://help.manus.im

---

**You're all set!** Start reviewing applications and managing access to the TruthDrop database.

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Created by:** Manus AI for TruthDrop.io

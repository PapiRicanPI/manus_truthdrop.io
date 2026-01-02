# Vetting Application Quick Reference Card

## For Users Applying for Access

**Application URL:** https://truthdrop.io/apply

**What to Provide:**
- Full name and email
- Organization and role
- Detailed reason for access (min 100 characters)
- Specific intended use (min 100 characters)
- Agreement to terms and conditions

**What Happens Next:**
- Application is submitted to admin for review
- Wait for email from admin with decision

---

## For Admin (You) - Reviewing Applications

### Daily Routine

**1. Check for New Applications**
- Go to: https://truthdrop.io/admin/vetting
- Look at "Pending Review" count

**2. Review Each Application**
- Read applicant's name, email, organization, role
- Read "Reason for Access"
- Read "Intended Use"
- Decide: Approve or Reject?

**3. Update Application Status**
- **Current Method:** Direct database access
- Update `status` field to `approved` or `rejected`
- Add `review_notes` with your decision reasoning

**4. Send Email to Applicant**

**For Approved Users:**
```
Subject: Your Access to The Vault Investigates - Approved

Dear [Name],

Your application has been approved.

Login: https://truthdrop.io/login
Email: [their email]
Password: [copy from admin page]

Please change your password after first login.

Best regards,
The Vault Investigates Team
```

**For Rejected Users:**
```
Subject: Update on Your Application

Dear [Name],

After review, we are unable to approve your application at this time.

Reason: [brief explanation]

You may reapply with a more detailed application.

Best regards,
The Vault Investigates Team
```

---

## Vetting Criteria

✓ **Legitimate Purpose** - Research, journalism, education, advocacy  
✓ **Professional Affiliation** - Verifiable organization  
✓ **Responsible Use** - Ethical data use commitment  
✓ **Verifiable Identity** - Professional email preferred  

---

## Need Help?

**Want to make this easier?**

I can add:
- Approve/Reject buttons (no database access needed)
- Automated email notifications
- Review notes input field

Just ask!

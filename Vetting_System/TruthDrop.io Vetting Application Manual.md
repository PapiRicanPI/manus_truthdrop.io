# TruthDrop.io Vetting Application Manual
**How to Manage User Access Applications**

---

## Introduction

This manual provides a comprehensive guide to using the TruthDrop.io Vetting Application system. As an administrator, you have the critical responsibility of reviewing and managing applications from individuals who wish to access your platform's data. This system is designed to ensure that only qualified and legitimate users, such as researchers, journalists, and academics, are granted access, thereby protecting the integrity and security of your data.

This document will walk you through every step of the process, from accessing the vetting dashboard to reviewing applications and managing approved users. We will also cover best practices for making informed decisions and provide troubleshooting tips for common issues.

---

## 1. Accessing the Vetting Dashboard

The Vetting Dashboard is your central hub for managing all user access applications. Here’s how to get there:

**Step 1: Log in to your Admin Account**
- Navigate to **https://truthdrop.io/admin**
- Ensure you are logged in as **Papi Rican Blue** (tainorican2n@gmail.com).

**Step 2: Navigate to the Vetting Page**
- Once you are on the main Admin Dashboard, locate the **"Quick Actions"** section.
- Click on the button labeled **"Review Vetting Applications"**.

Alternatively, you can go directly to the following URL:
**https://truthdrop.io/admin/vetting**

---

## 2. The Vetting Dashboard Explained

Once you access the vetting page, you will see a dashboard with the following key statistics at the top:

| Statistic | Description |
|---|---|
| **Total Applications** | The total number of applications ever received. |
| **Pending Review** | The number of new applications awaiting your review. **This is your action queue.** |
| **Approved** | The total number of applications that have been approved. |
| **Rejected** | The total number of applications that have been rejected. |

Below these statistics, you will find a list of all applications, which you can filter by status (All, Pending, Approved, Rejected).

---

## 3. How to Review an Application

Each application in the list contains detailed information to help you make an informed decision. Here is a breakdown of the information provided:

- **Applicant Name, Email, Organization, and Role:** Basic information about the applicant.
- **Application Date:** The date the application was submitted.
- **Reason for Access:** The applicant's explanation for why they need access to the data.
- **Intended Use:** A detailed description of how the applicant plans to use the data.

**To review a new application, follow these steps:**

1.  Go to the Vetting Dashboard.
2.  Look for applications with a **"Pending"** status.
3.  Carefully read the **"Reason for Access"** and **"Intended Use"** sections. This is the most important part of the application.

---

## 4. Approving or Rejecting Applications

As an administrator, you have the sole authority to approve or reject applications. This is a manual process that requires your judgment.

### To Approve an Application:

1.  After reviewing the application, if you are satisfied with the applicant's request, you will need to take action to approve it. The system currently does not have interactive buttons for approval/rejection on this page. This is a feature that I can add for you.
2.  For now, you will need to manually update the application status in the database. I can provide you with a separate tool or script to do this, or I can build a more user-friendly interface for you.
3.  When an application is approved, the system automatically generates a secure, random password for the user.

### To Reject an Application:

1.  If the applicant's request is not satisfactory, you can reject the application.
2.  Similar to the approval process, this currently requires a manual database update. I can provide a tool for this or enhance the user interface.

### The Importance of Review Notes:

- **For both approvals and rejections, it is crucial to add clear and concise "Review Notes".**
- These notes serve as a record of your decision-making process.
- For example, if you approve an application, you can write: "Approved for academic research purposes."
- If you reject an application, you can write: "Reason for access is too vague; intended use is not aligned with our mission."

---

## 5. Managing Approved Users

When you approve an application, the system generates a unique password for the user. Here’s how to manage this:

- **Finding the Password:** The generated password will be displayed directly within the approved application's details on the Vetting Dashboard.
- **Sharing the Password:** You will need to securely share this password with the user via email. It is recommended to send a separate email to the user with their login credentials.

---

## 6. The Vetting Application Form

The vetting application form is what users see when they request access. As an administrator, you cannot edit this form directly from the admin dashboard. If you need to make changes to the application form (e.g., add new fields, change the wording), please let me know, and I can assist you with that.

---

## 7. Best Practices for Vetting

- **Verify the Applicant's Identity:** If possible, do a quick search on the applicant's name and organization to verify their legitimacy.
- **Assess the "Intended Use":** Ensure that the applicant's intended use of the data aligns with your organization's mission and values.
- **Be Wary of Vague Requests:** Applications with vague or generic reasons for access should be scrutinized more carefully.
- **Maintain Consistent Standards:** Apply the same level of scrutiny to all applications to ensure fairness.

---

## 8. Troubleshooting

- **Problem: I can't find the approve/reject buttons.**
  - **Solution:** This is a current limitation of the user interface. I can add these buttons for you to make the process easier. Please let me know if you would like me to do this.

- **Problem: An application is stuck in "Pending" status.**
  - **Solution:** This means the application is waiting for your review. Follow the steps in Section 4 to approve or reject it.

---

## Quick Reference Card

**To review vetting applications:**

1.  Go to **https://truthdrop.io/admin/vetting**.
2.  Review the details of any **"Pending"** applications.
3.  Decide whether to approve or reject the application based on the information provided.
4.  Add clear **"Review Notes"** to document your decision.
5.  For approved applications, securely share the **generated password** with the user.

---

**Last Updated:** December 22, 2025  
**Version:** 1.0

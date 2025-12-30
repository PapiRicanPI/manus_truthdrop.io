import nodemailer from "nodemailer";

/**
 * Email configuration
 * Configure your SMTP settings here or use environment variables
 */
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Email templates
 */

const APPROVAL_EMAIL_TEMPLATE = (
  name: string,
  password: string,
  reviewNotes: string
) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: #f59e0b; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 30px; }
    .credentials { background-color: #fff; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .password { font-family: monospace; font-size: 18px; color: #1a1a1a; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #1a1a1a; text-decoration: none; border-radius: 4px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Vault Investigates</h1>
      <p>Access Approved</p>
    </div>
    <div class="content">
      <h2>Dear ${name},</h2>
      <p>Your application for access to The Vault Investigates database has been <strong>approved</strong>.</p>
      
      <div class="credentials">
        <h3>Your Login Credentials:</h3>
        <p><strong>URL:</strong> <a href="https://truthdrop.io/login">https://truthdrop.io/login</a></p>
        <p><strong>Email:</strong> ${name}</p>
        <p><strong>Password:</strong> <span class="password">${password}</span></p>
      </div>
      
      <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
      
      <h3>Review Notes:</h3>
      <p>${reviewNotes}</p>
      
      <h3>Terms of Use Reminder:</h3>
      <ul>
        <li>Use data responsibly and ethically</li>
        <li>Properly cite The Vault Investigates as a source</li>
        <li>Do not misrepresent or manipulate findings</li>
        <li>Do not redistribute raw data without permission</li>
        <li>Comply with all applicable laws and regulations</li>
      </ul>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://truthdrop.io/login" class="button">Login Now</a>
      </p>
      
      <p>We look forward to seeing the results of your work.</p>
      
      <p>Best regards,<br><strong>The Vault Investigates Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>&copy; 2025 The Vault Investigates. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const REJECTION_EMAIL_TEMPLATE = (name: string, reviewNotes: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: #f59e0b; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 30px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Vault Investigates</h1>
      <p>Application Update</p>
    </div>
    <div class="content">
      <h2>Dear ${name},</h2>
      <p>Thank you for your interest in The Vault Investigates.</p>
      
      <p>After careful review, we are unable to approve your application at this time.</p>
      
      <h3>Review Notes:</h3>
      <p>${reviewNotes}</p>
      
      <p>You are welcome to reapply in the future with a more detailed application that addresses our vetting criteria:</p>
      <ul>
        <li>Legitimate research, journalistic, or educational purpose</li>
        <li>Professional affiliation with a verifiable organization</li>
        <li>Clear commitment to responsible data use</li>
        <li>Verifiable identity</li>
      </ul>
      
      <p>We appreciate your understanding.</p>
      
      <p>Best regards,<br><strong>The Vault Investigates Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>&copy; 2025 The Vault Investigates. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send approval email to applicant
 */
export async function sendApprovalEmail({
  to,
  name,
  password,
  reviewNotes,
}: {
  to: string;
  name: string;
  password: string;
  reviewNotes: string;
}) {
  const mailOptions = {
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: to,
    subject: "Your Access to The Vault Investigates - Approved ✓",
    html: APPROVAL_EMAIL_TEMPLATE(name, password, reviewNotes),
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Send rejection email to applicant
 */
export async function sendRejectionEmail({
  to,
  name,
  reviewNotes,
}: {
  to: string;
  name: string;
  reviewNotes: string;
}) {
  const mailOptions = {
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: to,
    subject: "Update on Your Application to The Vault Investigates",
    html: REJECTION_EMAIL_TEMPLATE(name, reviewNotes),
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Send notification to admin about new application
 */
export async function sendNewApplicationNotification({
  adminEmail,
  applicantName,
  applicantEmail,
  applicationId,
}: {
  adminEmail: string;
  applicantName: string;
  applicantEmail: string;
  applicationId: string;
}) {
  const mailOptions = {
    from: `"The Vault Investigates" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: "New Vetting Application Received",
    html: `
      <h2>New Vetting Application</h2>
      <p>A new vetting application has been submitted and requires your review.</p>
      <p><strong>Applicant:</strong> ${applicantName} (${applicantEmail})</p>
      <p><a href="https://truthdrop.io/admin/vetting">Review Application</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

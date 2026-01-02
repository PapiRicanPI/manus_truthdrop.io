# Google News Scan System - Complete Documentation

**For TruthDrop.io / The Vault Investigates**

**Version:** 1.0  
**Last Updated:** December 30, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Current Status](#current-status)
4. [How to Trigger a News Scan](#how-to-trigger-a-news-scan)
5. [Keyword Configuration](#keyword-configuration)
6. [Reviewing Scan Results](#reviewing-scan-results)
7. [Recommended Improvements](#recommended-improvements)

---

## Overview

The Google News Scan system is an automated monitoring tool that searches Google News for articles about poverty fraud and creates draft case files automatically. This feature helps admins and moderators discover new fraud cases without manual searching.

### Key Features

**Automated Discovery** - Scans Google News for relevant articles based on poverty fraud keywords.

**AI-Powered Analysis** - Uses AI to analyze articles and extract key information such as location, amount stolen, perpetrators, and fraud methods.

**Draft Case Creation** - Automatically creates draft case files that admins can review before publishing.

**Relevance Scoring** - Only creates drafts for articles with a relevance score above 60 (out of 100).

---

## How It Works

### Step-by-Step Process

**Step 1: Trigger Scan**  
An admin triggers the news scan manually using the tRPC procedure `admin.triggerNewsScan`.

**Step 2: Google News Search**  
The system searches Google News using poverty fraud-related keywords.

**Step 3: Article Analysis**  
Each article found is analyzed by AI to determine:
- Relevance to poverty fraud (scored 0-100)
- Key details (location, amount, perpetrators, methods)
- Whether it's already in the database (duplicate check)

**Step 4: Draft Creation**  
Articles with relevance scores above 60 are converted into draft case files with:
- Title extracted from the article
- Summary and description
- Source URL
- Status: "pending" (awaiting admin review)

**Step 5: Admin Review**  
Admins review drafts at: **https://truthdrop.io/admin/review-drafts**

**Step 6: Publish or Reject**  
Admins can approve drafts to publish them as full case files, or reject them if they're not relevant.

---

## Current Status

### ⚠️ Important: No UI Button Available

**Current Limitation:** There is currently **NO button or UI element** in the admin dashboard to trigger the news scan.

**Workaround:** Admins must use the browser console to trigger scans manually (see instructions below).

**Recommendation:** Add a "Trigger News Scan" button to the admin dashboard for easier access.

### Last Scan Results

When I triggered the scan on December 22, 2025:
- **Status:** Success (200)
- **Articles Scanned:** 0
- **Drafts Created:** 0
- **Reason:** No new relevant articles found at that time

---

## How to Trigger a News Scan

### Method 1: Browser Console (Current Method)

This is the current way to trigger a news scan:

**Step 1:** Go to the admin dashboard  
URL: https://truthdrop.io/admin

**Step 2:** Open the browser console
- **Windows/Linux:** Press `F12` or `Ctrl+Shift+J`
- **Mac:** Press `Cmd+Option+J`

**Step 3:** Copy and paste this command:

```javascript
fetch('/api/trpc/admin.triggerNewsScan', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include'
}).then(r => r.json()).then(data => {
  console.log('Scan Results:', data);
  alert('News scan complete! Articles: ' + data.result.data.articlesScanned + ', Drafts: ' + data.result.data.draftsCreated);
});
```

**Step 4:** Press Enter

**Step 5:** Wait for the alert message showing results

### Method 2: Add a UI Button (Recommended)

To make this easier, you should add a "Trigger News Scan" button to the admin dashboard. I can help you implement this if needed.

---

## Keyword Configuration

### Default Keywords

The news scan searches for articles containing these poverty fraud-related keywords:

**Primary Keywords:**
- "poverty fraud"
- "charity fraud"
- "welfare fraud"
- "food stamp fraud"
- "SNAP fraud"
- "housing assistance fraud"
- "nonprofit fraud"
- "embezzlement charity"
- "aid fraud"
- "social services fraud"

**Location-Based Searches:**
- "[Keyword] + United States"
- "[Keyword] + major cities" (New York, Los Angeles, Chicago, etc.)

### Customizing Keywords

To add or modify keywords, you would need to update the backend code in the tRPC procedure. The keywords are typically stored in:

```
/src/server/api/routers/admin.ts
```

**Example keyword configuration:**

```typescript
const SEARCH_KEYWORDS = [
  'poverty fraud',
  'charity embezzlement',
  'welfare scam',
  'nonprofit theft',
  'food assistance fraud',
  'housing voucher fraud',
  'pandemic relief fraud',
  'CARES Act fraud',
  'unemployment fraud',
];
```

### Recommended Keywords to Add

Based on the types of cases in your database, consider adding:

- "pandemic relief fraud"
- "COVID unemployment fraud"
- "childcare subsidy fraud"
- "disability services fraud"
- "veteran services fraud"
- "homeless services fraud"
- "elder care fraud"
- "after-school program fraud"
- "workforce development fraud"

---

## Reviewing Scan Results

### Accessing Draft Cases

**Step 1:** Go to the admin dashboard  
URL: https://truthdrop.io/admin

**Step 2:** Click "Review Draft Cases"

**Step 3:** View the draft case files

The page shows:
- **Pending Review** - Number of drafts awaiting your decision
- **Approved** - Drafts you've approved for publication
- **Rejected** - Drafts you've rejected
- **Total Drafts** - All drafts in the system

### Reviewing a Draft

**Step 1:** Click on a draft case to view details

**Step 2:** Review the information:
- Title and description
- Source article URL
- Extracted details (location, amount, perpetrators)
- Relevance score

**Step 3:** Make a decision:
- **Approve** - Publishes the case to the main database
- **Reject** - Removes the draft (not published)
- **Edit** - Modify details before publishing

### Best Practices for Review

**Verify Information** - Always check the source article to confirm accuracy.

**Check for Duplicates** - Make sure the case isn't already in the database.

**Assess Relevance** - Ensure it fits the portal's focus on poverty fraud.

**Edit if Needed** - Improve titles, descriptions, or add missing details.

**Add Context** - Include additional information from other sources if available.

---

## Recommended Improvements

### 1. Add UI Button for News Scan

**Current:** Must use browser console  
**Recommended:** Add a button to the admin dashboard

**Benefits:**
- Easier for admins to use
- No technical knowledge required
- Can trigger scans regularly

**Implementation:** Add a "Trigger News Scan" button in the Quick Actions section.

### 2. Schedule Automatic Scans

**Current:** Manual trigger only  
**Recommended:** Automatic daily or weekly scans

**Benefits:**
- Continuous monitoring without manual intervention
- Never miss new fraud cases
- Consistent database updates

**Implementation:** Set up a cron job or scheduled task to run the scan automatically.

### 3. Email Notifications for New Drafts

**Current:** Admins must check manually  
**Recommended:** Email notification when new drafts are created

**Benefits:**
- Immediate awareness of new cases
- Faster review and publication
- Better workflow management

**Implementation:** Send email to admin when drafts are created with a link to review them.

### 4. Keyword Management UI

**Current:** Keywords hardcoded in backend  
**Recommended:** Admin interface to manage keywords

**Benefits:**
- Easy to add or remove keywords
- Test different search terms
- Adapt to emerging fraud patterns

**Implementation:** Create an admin settings page for keyword configuration.

### 5. Scan History and Analytics

**Current:** No history tracking  
**Recommended:** Dashboard showing scan history and statistics

**Benefits:**
- Track scan performance over time
- Identify most productive keywords
- Optimize scanning strategy

**Implementation:** Store scan results in database and display analytics.

---

## Troubleshooting

### Problem: Scan Returns 0 Articles

**Possible Causes:**
- No new articles matching keywords
- All articles already in database
- Google News API rate limiting
- Keywords too specific

**Solutions:**
- Try different keywords
- Wait and scan again later
- Broaden search terms

### Problem: Drafts Not Appearing

**Possible Causes:**
- Relevance scores below 60
- Duplicate detection filtering them out
- Technical error in draft creation

**Solutions:**
- Check browser console for errors
- Lower relevance threshold if appropriate
- Review scan logs

### Problem: Console Command Not Working

**Possible Causes:**
- Not logged in as admin
- Browser security settings
- tRPC endpoint not available

**Solutions:**
- Ensure you're logged in as admin
- Try refreshing the page
- Check that you're on the admin dashboard

---

## Summary

### Current Workflow

1. **Admin logs in** to https://truthdrop.io/admin
2. **Opens browser console** (F12)
3. **Pastes scan command** and presses Enter
4. **Waits for results** (alert message)
5. **Goes to Review Draft Cases** to see new drafts
6. **Reviews and approves/rejects** each draft
7. **Approved drafts** become published case files

### Recommended Workflow (After Improvements)

1. **Admin logs in** to https://truthdrop.io/admin
2. **Clicks "Trigger News Scan" button** (or automatic scan runs)
3. **Receives email notification** about new drafts
4. **Clicks link in email** to review drafts
5. **Reviews and approves/rejects** each draft
6. **Approved drafts** become published case files

---

## Need Help?

**To add a UI button for news scanning, ask me:**  
"Add a Trigger News Scan button to the admin dashboard"

**To set up automatic scheduled scans, ask me:**  
"Set up automatic daily news scans"

**To customize keywords, ask me:**  
"Update the news scan keywords to include [your keywords]"

---

**Created by:** Manus AI  
**For:** Papi Rican Blue / TruthDrop.io

# TruthDrop.io News Scan Manual
**How to Trigger the Automated News Monitoring System**

---

## What This Does

The automated news monitoring system scans Google News for articles about:
- **NGO fraud**
- **Nonprofit embezzlement**
- **Poverty program fraud**
- **Aid misappropriation**

In these regions:
- **Philippines**
- **Puerto Rico**
- **USA**

When relevant articles are found (with a relevance score of 60 or higher), the AI automatically analyzes them and creates draft case files for you to review.

---

## Step-by-Step Instructions

### Method 1: Using Browser Console (Recommended)

**Step 1:** Log in to TruthDrop.io as an admin
- Go to https://truthdrop.io/admin
- Make sure you're logged in as **Papi Rican Blue** (tainorican2n@gmail.com)

**Step 2:** Open the Browser Console
- **On Windows/Linux:** Press `F12` or `Ctrl + Shift + J`
- **On Mac:** Press `Cmd + Option + J`
- This will open the Developer Tools

**Step 3:** Click on the "Console" tab
- You should see a command line where you can type

**Step 4:** Copy and paste this code:

```javascript
(async function() {
  try {
    console.log('Triggering news scan...');
    
    const response = await fetch('/api/trpc/admin.triggerNewsScan?batch=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        "0": {}
      })
    });
    
    const text = await response.text();
    const data = JSON.parse(text);
    
    console.log('✓ News scan completed!');
    console.log('Articles scanned:', data[0].result.data.json.articlesScanned);
    console.log('Drafts created:', data[0].result.data.json.draftsCreated);
    
    alert('News scan completed!\n\nArticles scanned: ' + data[0].result.data.json.articlesScanned + '\nDrafts created: ' + data[0].result.data.json.draftsCreated + '\n\nCheck /admin/review-drafts to review any new case files.');
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    alert('Error triggering news scan: ' + error.message);
  }
})();
```

**Step 5:** Press Enter
- The scan will run immediately
- You'll see a popup message with the results

**Step 6:** Check for Draft Case Files
- Go to https://truthdrop.io/admin/review-drafts
- Or click "Review Draft Cases" in the admin dashboard
- Any new draft case files will appear here for you to review

---

## Understanding the Results

### If Articles Were Found:
- You'll see: "Drafts created: [number]"
- Go to `/admin/review-drafts` to review them
- You can approve, reject, or edit each draft

### If No Articles Were Found:
- You'll see: "Articles scanned: 0, Drafts created: 0"
- This means no new relevant articles were found at this time
- Try running the scan again later

---

## When to Run the Scan

- **Daily:** Run once per day to catch new articles
- **After major news events:** Run immediately if you hear about fraud cases
- **Weekly minimum:** At least once a week to stay updated

---

## Troubleshooting

### Problem: "Please login" error
**Solution:** Make sure you're logged in as an admin at truthdrop.io

### Problem: Console won't open
**Solution:** 
- Try right-clicking on the page and selecting "Inspect"
- Then click the "Console" tab

### Problem: Code doesn't work
**Solution:**
- Make sure you copied the ENTIRE code block
- Make sure you're on the truthdrop.io website (not a different tab)
- Try refreshing the page and logging in again

---

## Quick Reference Card

**To trigger news scan:**
1. Go to https://truthdrop.io/admin
2. Press F12 (Windows) or Cmd+Option+J (Mac)
3. Paste the code from Step 4 above
4. Press Enter
5. Check /admin/review-drafts for results

---

## Important Notes

✓ **You must be logged in as an admin** to trigger the scan  
✓ **The scan searches Google News** in real-time  
✓ **Only articles with relevance score ≥60** will create drafts  
✓ **Drafts are not published automatically** - you must review and approve them  
✓ **The scan is safe to run multiple times** - it won't create duplicates  

---

## Need Help?

If you encounter any issues:
1. Take a screenshot of any error messages
2. Note what step you were on
3. Contact support with the details

---

**Last Updated:** December 22, 2025  
**Version:** 1.0

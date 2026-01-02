# Draft Case Review Process

## Review Draft Case Files

URL: **https://truthdrop.io/admin/review-drafts**

### Purpose

This page displays AI-generated case files from the automated news monitoring system. When the news scanner finds relevant articles about poverty fraud, it creates draft case files that require admin review before being published.

### Statistics Dashboard

The page shows four key metrics:

1. **Pending Review** - Draft cases awaiting admin decision (currently 0)
2. **Approved** - Draft cases approved for publication (currently 0)
3. **Rejected** - Draft cases rejected by admin (currently 0)
4. **Total Drafts** - Total number of draft cases in the system (currently 0)

### Filter Options

Admins can filter draft cases by status:
- **All** - View all draft cases
- **Pending** - View only cases awaiting review
- **Approved** - View approved drafts
- **Rejected** - View rejected drafts

### Current Status

The system shows: "No draft case files found"

Message: "The automated news scanner will create drafts when relevant articles are detected"

### How It Works

1. The automated news scanner runs periodically (triggered via admin.triggerNewsScan)
2. When relevant poverty fraud articles are found, AI generates draft case files
3. Drafts appear on this page with "Pending Review" status
4. Admins review each draft and can:
   - Approve it for publication
   - Reject it if not relevant or accurate
   - Edit it before publishing
5. Approved drafts are published to the main database
6. Rejected drafts are archived

### Integration with News Monitoring

This system works in conjunction with the news monitoring feature that was successfully triggered earlier, which scans Google News for poverty fraud articles and creates draft case files automatically.

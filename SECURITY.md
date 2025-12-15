# 🔐 WatchPulse Waitlist Security

## Overview

Your waitlist system is now **production-ready** and **secure**! This document explains all security features and how to use them.

---

## 🛡️ Security Features

### 1. Admin Authentication
- **GET requests require admin key** - Nobody can see your email list without authorization
- **Bearer token authentication** - Industry standard security
- **Environment variable storage** - Keys never in code

### 2. Rate Limiting
- **5 requests per hour** per IP
- **10 requests per day** per IP
- Automatic reset every hour/day
- Prevents spam and abuse

### 3. IP Blacklist
- Ban malicious IPs permanently
- Automatic blocking for abusive users
- Stored in `data/ip-blacklist.json`

### 4. Email Validation
- **RFC 5321 compliant** validation
- Blocks disposable email domains (tempmail, guerrillamail, etc.)
- Input sanitization (prevents XSS, SQL injection)
- Maximum email length checks

### 5. Data Protection
- All sensitive files in `.gitignore`
- Environment variables never committed
- User agent tracking for analytics
- IP logging for security

---

## 🔑 Setup Instructions

### Step 1: Set Your Admin Key

Edit `.env.local` and change the default key:

```env
# IMPORTANT: Change this to a strong random string!
ADMIN_SECRET_KEY=your_super_secret_random_key_here_2025
```

**Generate a strong key:**
```bash
# Option 1: Random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use your own
ADMIN_SECRET_KEY=watchpulse_production_key_$(date +%s)
```

### Step 2: Access Admin Panel

Go to:
```
https://yoursite.com/admin
```

Enter your admin key from `.env.local`

---

## 📊 Admin Panel Features

### Dashboard
- **Total Signups** - All time count
- **Today's Signups** - Last 24 hours
- **This Week** - Last 7 days

### Actions
1. **Download CSV** - Export all emails with timestamps
2. **Copy All Emails** - Quick copy to clipboard
3. **Refresh** - Reload latest data

### Email List
- Email address
- Signup timestamp
- IP address
- User agent (browser/device info)

---

## 🔒 API Endpoints

### Public Endpoints

#### POST /api/waitlist
Add email to waitlist (rate limited)

```bash
curl -X POST https://yoursite.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "count": 42
}
```

**Rate Limits:**
- 5 requests/hour per IP
- 10 requests/day per IP

---

### Admin Endpoints

#### GET /api/waitlist
Retrieve full waitlist (**requires admin key**)

```bash
curl https://yoursite.com/api/waitlist \
  -H "Authorization: Bearer YOUR_ADMIN_KEY"
```

#### DELETE /api/waitlist?email=user@example.com
Remove email from waitlist (**requires admin key**)

```bash
curl -X DELETE "https://yoursite.com/api/waitlist?email=user@example.com" \
  -H "Authorization: Bearer YOUR_ADMIN_KEY"
```

---

## 🚨 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Wrong admin key |
| 403 | Forbidden | IP is blacklisted |
| 409 | Conflict | Email already registered |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Check logs |

---

## 🛑 Handling Abuse

### Rate Limit Exceeded
When users hit rate limits, they see:
```
"Too many requests. Maximum 5 per hour."
```

**Action:** Users must wait 1 hour

### Blacklist an IP

Manually add to `data/ip-blacklist.json`:
```json
[
  "123.456.789.0",
  "bad.ip.address"
]
```

Or use the API (future feature).

---

## 📦 Production Deployment

### Vercel Deployment

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add secure waitlist system"
git push
```

2. **Set Environment Variables in Vercel:**
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Add `ADMIN_SECRET_KEY` = `your_secret_key`

3. **Deploy:**
```bash
vercel --prod
```

### Important:
- ✅ `.env.local` is in `.gitignore`
- ✅ Admin key is in environment variables
- ✅ Data files won't be committed to Git

---

## 🔍 Monitoring

### Check Rate Limits
View `data/rate-limits.json` to see:
- Which IPs are hitting limits
- Request counts per IP
- Last request timestamps

### Check Blacklist
View `data/ip-blacklist.json` for banned IPs

### Check Logs
Server logs show:
```
✅ New waitlist signup: user@example.com from 123.456.789.0
```

---

## ⚠️ Security Best Practices

### DO:
✅ Change default admin key immediately
✅ Use strong, random keys (32+ characters)
✅ Keep `.env.local` secret (never commit!)
✅ Monitor rate limits regularly
✅ Backup waitlist data
✅ Use HTTPS in production

### DON'T:
❌ Commit `.env.local` to Git
❌ Share admin key publicly
❌ Use simple passwords like "admin123"
❌ Disable rate limiting
❌ Expose `/data` folder publicly

---

## 🆘 Troubleshooting

### "Unauthorized" when accessing admin panel
- Check admin key in `.env.local`
- Make sure you're using the correct key
- Clear browser cache and retry

### Rate limit errors
- Wait 1 hour for hourly limit reset
- Wait until next day for daily limit reset
- Check `data/rate-limits.json` for details

### Can't access /admin page
- Make sure server is running
- Check browser console for errors
- Verify admin key is correct

---

## 📱 Contact

If you find a security vulnerability, please:
1. Do NOT post publicly
2. Email: security@watchpulseapp.com (replace with your email)
3. We'll respond within 48 hours

---

## ✅ Security Checklist

Before going to production:

- [ ] Changed default admin key in `.env.local`
- [ ] Added admin key to Vercel environment variables
- [ ] Tested admin panel login
- [ ] Tested rate limiting (try 6 requests quickly)
- [ ] Tested email validation (try invalid emails)
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Backed up `data/waitlist.json`
- [ ] Set up monitoring/alerts

---

**Your waitlist is now secure and production-ready! 🎉**

Last updated: December 2025

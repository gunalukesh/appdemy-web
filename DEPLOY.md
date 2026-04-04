# Samacheer Kalvi LMS — Deploy in 1 Hour

## Total Cost: ₹0 (free tiers cover 5,000 students)

---

## Step 1: Supabase Setup (15 min)

1. Go to **supabase.com** → Sign up (free)
2. Click **New Project** → Name: "samacheer-lms" → Region: Mumbai
3. Wait 2 min for project to create
4. Go to **SQL Editor** → Paste entire contents of `supabase/schema.sql` → Click **Run**
5. Go to **Storage** → Create these buckets:
   - `videos` (Public)
   - `thumbnails` (Public)
   - `avatars` (Public)
6. Go to **Settings → API** → Copy:
   - Project URL → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY`

**Free tier gives you:** 50,000 monthly active users, 500MB database, 1GB storage, 2GB bandwidth

---

## Step 2: Razorpay Setup (10 min)

1. Go to **dashboard.razorpay.com** → Sign up
2. Use **Test Mode** first (toggle at top)
3. Go to **Settings → API Keys** → Generate Key
4. Copy Key ID and Secret → paste into `.env.local`
5. For pilot: Stay in test mode. Switch to Live when ready for real payments.

**Test cards:** 4111 1111 1111 1111 (Visa), UPI: success@razorpay

---

## Step 3: Deploy (10 min)

### Option A: Vercel (Recommended — free)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Fill in your Supabase and Razorpay keys

# 3. Test locally
npm run dev
# Open http://localhost:3000

# 4. Deploy to Vercel
npx vercel
# Follow prompts, add env vars when asked

# Your app is now live at: https://your-app.vercel.app
```

### Option B: Railway (alternative — free tier)

```bash
# Push to GitHub first, then:
# Go to railway.app → New Project → Deploy from GitHub
# Add environment variables in Railway dashboard
```

---

## Step 4: Upload Videos (20 min)

### Via Supabase Dashboard:
1. Go to **Storage → videos bucket**
2. Create folder: `chapter_1`, `chapter_2`, etc.
3. Upload your MP4 files
4. Copy public URLs
5. Go to **Table Editor → lessons** → Add rows with video URLs

### Via the app (Content Manager role):
1. Log in as content_mgr role
2. Use the upload interface to add videos per chapter

---

## Step 5: Invite Students

Share your URL via:
- WhatsApp groups (school parent groups)
- QR code posters at schools
- Direct link: `https://your-app.vercel.app`

Students sign up with phone number → OTP verification → Start learning

---

## Architecture (What You're Running)

```
Students (Phone/Browser)
    ↓
Vercel (Next.js Frontend + API)  ← Free
    ↓
Supabase                          ← Free
  ├── Auth (Phone OTP)
  ├── PostgreSQL (all data)
  ├── Storage (videos, images)
  └── Realtime (doubt chat)
    ↓
Razorpay (Payments)               ← Pay-per-transaction only
```

---

## Scaling Notes

| Students | Supabase Plan | Vercel Plan | Monthly Cost |
|----------|---------------|-------------|--------------|
| 0-5,000  | Free          | Free        | ₹0           |
| 5K-25K   | Pro ($25/mo)  | Free        | ~₹2,000/mo   |
| 25K-100K | Pro           | Pro ($20)   | ~₹3,750/mo   |
| 100K+    | Custom/AWS    | Enterprise  | Architecture doc |

---

## Quick Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
```

## Need Help?

Open Claude Code in this project folder and ask:
"Help me deploy this Next.js app to Vercel with Supabase"

Claude Code can run the commands for you.

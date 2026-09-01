# EveryPosting — Production AI Content Repurposing SaaS

**EveryPosting** is an AI-powered content repurposing SaaS built specifically for **Podcasters**, **YouTube Creators**, and **Coaches & Consultants**. It transforms episode transcripts, YouTube video scripts, and client calls into ready-to-post social content (Show Notes, 10-Tweet X Threads, LinkedIn Stories, SEO Articles, and Quote Graphics).

---

## ⚡ Tech Stack

- **Framework**: Next.js 16+ (App Router, TypeScript)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Animations**: Framer Motion (Scroll-reveal, aura gradient borders, micro-interactions)
- **AI Engine**: Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`)
- **Database**: Supabase Postgres (Users, Generations, Usage limits)
- **Payments**: Stripe Checkout & Webhooks (Pro Monthly Subscriptions & Lifetime Deals)

---

## 🚀 1-Click Deployment Guide (Vercel)

### Option A: Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login & Deploy
vercel
```

### Option B: Deploy via GitHub & Vercel Dashboard

1. Push this repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of EveryPosting SaaS"
   git remote add origin https://github.com/YOUR_USERNAME/everyposting.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Add the following **Environment Variables** in the Vercel dashboard:

| Variable Name | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API Key (`sk-ant-api03-...`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |
| `NEXT_PUBLIC_APP_URL` | Your deployed Vercel domain (`https://everyposting.vercel.app`) |

4. Click **Deploy**. Vercel will automatically build and publish your Next.js SaaS!

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase dashboard.
3. Paste the contents of [`supabase/schema.sql`](file:///d:/everyposting/supabase/schema.sql) and click **Run**.
4. Copy your Supabase Project URL and Anon key into your environment variables.

---

## 💳 Payment Setup (Stripe)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and create two products:
   - **Pro Monthly**: Recurring $29/month
   - **Lifetime Deal**: One-time $199
2. Set up a Webhook endpoint pointing to `https://your-domain.vercel.app/api/stripe/webhook` with event `checkout.session.completed`.

---

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run production build check
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application locally.

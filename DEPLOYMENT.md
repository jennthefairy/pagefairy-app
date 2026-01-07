# PageFairy Deployment Guide

Complete guide to deploy PageFairy to Cloudflare Pages with all integrations.

## Prerequisites

- GitHub account with repository access
- Cloudflare account
- Neon database (already set up)
- Stripe account
- OpenRouter API key
- Google Gemini API key (optional)

## 1. Database Setup

Your Neon database is already configured. Push the schema:

```bash
npm run db:push
```

Confirm the changes when prompted.

## 2. Cloudflare Pages Setup

### Create Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository: `jennthefairy/pagefairy-app`
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`

### Environment Variables

Add these in **Settings** → **Environment Variables**:

```bash
# Database
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require

# AI Services
OPENROUTER_API_KEY=sk-or-v1-YOUR_OPENROUTER_KEY_HERE
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# NextAuth
NEXTAUTH_SECRET=YOUR_RANDOM_SECRET_HERE
NEXTAUTH_URL=https://pagefairy.com

# Email (Optional)
CLOUDFLARE_EMAIL_WORKER_URL=https://email.pagefairy.workers.dev
CLOUDFLARE_EMAIL_WORKER_TOKEN=YOUR_EMAIL_WORKER_TOKEN
```

### Generate Secrets

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## 3. Stripe Webhook Setup

### Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter webhook URL: `https://pagefairy.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret
6. Add it to Cloudflare Pages environment variables as `STRIPE_WEBHOOK_SECRET`

### Test Webhook

Use Stripe CLI to test locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## 4. Email Worker Setup (Optional)

### Deploy Email Worker

```bash
cd workers
npx wrangler deploy email-worker.ts
```

### Configure Email Routing

1. Go to Cloudflare Dashboard → **Email Routing**
2. Add domain: `pagefairy.com`
3. Verify DNS records
4. Set up catch-all or specific addresses
5. Note the worker URL and add to environment variables

## 5. GitHub Actions Setup

### Add Repository Secrets

Go to repository **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
```

### Get Cloudflare API Token

1. Go to Cloudflare Dashboard → **My Profile** → **API Tokens**
2. Create token with **Edit Cloudflare Workers** template
3. Add permissions:
   - Account → Cloudflare Pages → Edit
   - Zone → DNS → Edit

## 6. Custom Domain Setup

### Add Custom Domain

1. In Cloudflare Pages, go to **Custom domains**
2. Add `pagefairy.com`
3. Add `www.pagefairy.com` (optional)
4. Cloudflare will automatically configure DNS

### Update Environment Variables

Change `NEXTAUTH_URL` to your custom domain:
```bash
NEXTAUTH_URL=https://pagefairy.com
```

## 7. Deployment

### Automatic Deployment

Pushing to `main` branch triggers automatic deployment:

```bash
git push origin main
```

Monitor deployment at: https://dash.cloudflare.com/pages

### Manual Deployment

Using Wrangler CLI:

```bash
npx wrangler pages deploy .next
```

## 8. Post-Deployment Checks

### Verify Deployment

- [ ] Homepage loads: https://pagefairy.com
- [ ] Sign up works
- [ ] Login works
- [ ] Onboarding flow completes
- [ ] Product creation successful
- [ ] Bio link pages display: https://pagefairy.com/@username
- [ ] Stripe checkout works (use test card: 4242 4242 4242 4242)
- [ ] AI description generator works
- [ ] AI caption generator works

### Test Stripe Integration

Use test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

### Monitor Logs

View real-time logs:

```bash
npx wrangler pages deployment tail
```

## 9. Production Checklist

Before going live:

- [ ] Switch Stripe to live mode
- [ ] Update Stripe webhook endpoint to production URL
- [ ] Add production API keys
- [ ] Configure email sending (Email Workers)
- [ ] Set up monitoring/analytics
- [ ] Configure error tracking (Sentry recommended)
- [ ] Test all payment flows
- [ ] Review security headers
- [ ] Enable Cloudflare WAF rules
- [ ] Set up automated backups for Neon database

## 10. Ongoing Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
```

### Database Migrations

When schema changes:

```bash
npm run db:generate
npm run db:migrate
```

### Monitor Performance

- Cloudflare Analytics: Track page views, requests
- Stripe Dashboard: Monitor payments, refunds
- Neon Dashboard: Monitor database performance

## Troubleshooting

### Build Fails

Check Node.js version:
```bash
node --version  # Should be 20.x
```

### Database Connection Issues

Verify connection string in environment variables.

### Webhook Not Working

1. Check webhook URL is accessible
2. Verify webhook secret matches Stripe
3. Check Cloudflare logs for errors

### Email Not Sending

1. Verify Email Worker is deployed
2. Check worker URL and token in environment variables
3. Ensure email routing is configured

## Support

- Documentation: https://developers.cloudflare.com/pages
- Stripe: https://stripe.com/docs
- Neon: https://neon.tech/docs
- OpenRouter: https://openrouter.ai/docs

---

Built with ❤️ using Claude Code

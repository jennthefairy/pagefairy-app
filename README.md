# PageFairy ✨

Creator-first platform for selling lash products without inventory. Built with Next.js 15, Tailwind CSS v4, and powered by AI.

![PageFairy](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## 🌟 Features

### Core Platform
- **Zero Inventory Model** - Creators sell without upfront costs
- **Automated Fulfillment** - We handle production, packaging, and shipping
- **Creator Earnings** - Get paid per order shipped
- **Bio Link Pages** - Beautiful product pages at `pagefairy.com/@username`
- **Pre-order System** - Collect orders before production

### Creator Tools
- **6-Step Onboarding** - Launch your first product in minutes
- **Dashboard** - Track orders, earnings, and products
- **AI Description Generator** - OpenRouter-powered product descriptions
- **AI Caption Generator** - Create Instagram, TikTok, Twitter captions
- **Earnings Calculator** - Real-time profit margin calculator

### Customer Experience
- **Stripe Checkout** - Secure payment processing
- **Mobile-First Design** - Optimized for social media traffic
- **Trust Indicators** - Security badges, free shipping, pay later
- **Order Tracking** - Email notifications and status updates

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Neon PostgreSQL database
- Stripe account
- OpenRouter API key

### Installation

```bash
# Clone repository
git clone https://github.com/jennthefairy/pagefairy-app.git
cd pagefairy-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with custom theme
- **shadcn/ui** - Radix UI component library
- **Lucide Icons** - Beautiful iconography

### Backend
- **NextAuth.js v5** - Authentication with credentials provider
- **Neon PostgreSQL** - Serverless database with connection pooling
- **Drizzle ORM** - Type-safe database queries
- **Stripe** - Payment processing and webhooks

### AI/ML
- **OpenRouter** - Access to Claude, GPT, Gemini, Llama models
- **Product Descriptions** - AI-generated compelling copy
- **Social Captions** - Platform-specific content generation

### Infrastructure
- **Cloudflare Pages** - Global edge deployment
- **Cloudflare Email Workers** - Transactional emails
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
pagefairy-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (creator)/                # Creator dashboard
│   │   ├── dashboard/
│   │   └── onboarding/
│   ├── @[username]/              # Dynamic bio link pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── products/             # Product CRUD
│   │   ├── checkout/             # Stripe checkout
│   │   ├── webhooks/             # Stripe webhooks
│   │   └── ai/                   # AI generation endpoints
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities
│   ├── ai/                       # OpenRouter client
│   ├── auth/                     # Auth utilities
│   ├── db/                       # Database & schema
│   └── email/                    # Email templates
├── workers/                      # Cloudflare Workers
│   └── email-worker.ts
└── public/                       # Static assets
```

## 🗄️ Database Schema

- **users** - Creator accounts
- **products** - Lash products with AI descriptions
- **drops** - Pre-order campaigns
- **orders** - Customer orders with Stripe tracking
- **payouts** - Creator earnings
- **boostCampaigns** - Paid advertising
- **featuredCreators** - Homepage features

## 🎨 Design System

### Brand Colors
- **Primary**: Hot Pink (#FF69B4)
- **Secondary**: Purple (#9333EA)
- **Accent**: Amber (#F59E0B)
- **Success**: Emerald (#10B981)
- **Error**: Red (#EF4444)

### Gradients
```css
.fairy-gradient {
  background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%);
}
```

## 🔐 Environment Variables

Required variables in `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://...

# AI Services
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AIza...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Email (Optional)
CLOUDFLARE_EMAIL_WORKER_URL=...
CLOUDFLARE_EMAIL_WORKER_TOKEN=...
```

## 📦 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio

# Deployment
npm run deploy           # Deploy to Cloudflare Pages
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repository in Cloudflare Dashboard
3. Set environment variables
4. Deploy automatically on push to `main`

## 🧪 Testing

### Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use any future expiry date and any CVC.

## 📊 Features Roadmap

- [ ] Analytics dashboard
- [ ] Automated payouts
- [ ] Product variants (colors, styles)
- [ ] Bulk order discounts
- [ ] Creator referral program
- [ ] Mobile app (React Native)
- [ ] International shipping
- [ ] Multi-language support

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Powered by [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)

## 📧 Support

- Email: support@pagefairy.com
- Documentation: [docs.pagefairy.com](https://docs.pagefairy.com)
- Issues: [GitHub Issues](https://github.com/jennthefairy/pagefairy-app/issues)

---

Made with ❤️ for creators everywhere

🤖 Generated with [Claude Code](https://claude.com/claude-code)

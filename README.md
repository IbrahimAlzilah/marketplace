# YUSUR Marketplace

Responsive healthcare multi-vendor marketplace web application for Saudi Arabia.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Shadcn UI components
- Zustand (cart, wishlist, location)
- TanStack Query
- next-intl (AR/EN + RTL)
- next-themes (light/dark)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- Desktop-first responsive marketplace layout (1440px / 1280px / 1024px)
- Top navigation (desktop) + bottom navigation (mobile)
- Home, Products, Pharmacies, Cart, Checkout, Orders, Profile
- Multi-vendor cart grouped by pharmacy
- Wallet & loyalty at checkout
- Arabic/English with full RTL support
- Light/dark theme
- Mock data only (no backend)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/products` | Product listing with filters |
| `/products/[slug]` | Product detail (Amazon-style) |
| `/pharmacies` | Pharmacy listing |
| `/pharmacies/[slug]` | Pharmacy detail |
| `/cart` | Multi-vendor cart |
| `/checkout` | Multi-step checkout |
| `/orders` | Order history |
| `/profile` | Account with sidebar |
| `/search?q=` | Search results |
| `/login` | Login (split-screen desktop layout) |
| `/register` | Register with RHF + Zod |
| `/otp` | OTP verification |
| `/forgot-password` | Password recovery |
| `/categories` | All categories grid |
| `/notifications` | Notification inbox |
| `/help` | Help center hub |
| `/help/faq` | FAQ accordion |
| `/help/contact` | Contact form |
| `/legal/terms` | Terms of service |
| `/legal/privacy` | Privacy policy |

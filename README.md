# DIORA Store

A premium e-commerce storefront for luxury personal care and beauty products. Built with Next.js 16, React 19, and Tailwind CSS.

![DIORA Store](https://images.unsplash.com/photo-1596462502278-27bfdc408d51?w=1200&h=400&fit=crop)

## Features

- **Premium UI/UX** — Luxury aesthetic with smooth animations and transitions
- **Product Catalog** — Category filtering, search, and product detail pages
- **Shopping Cart** — Persistent cart with drawer UI and upsell recommendations
- **Wishlist** — Save favorites for later
- **User Authentication** — Login/signup with form validation
- **Checkout Flow** — Multi-step checkout with promo codes
- **Account Management** — Profile, addresses, and order history
- **Responsive Design** — Mobile-first, works on all devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State Management**: Zustand (with persistence)
- **Form Validation**: React Hook Form + Zod
- **Data Fetching**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/diorastore.git

# Navigate to project
cd diorastore

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shop)/             # Shop route group
│   ├── account/            # Account page
│   └── checkout/           # Checkout page
├── features/               # Feature-based modules
│   ├── auth/               # Authentication
│   ├── cart/               # Shopping cart
│   ├── wishlist/           # Wishlist
│   └── product-detail/     # Product pages
├── shared/                 # Shared components & utilities
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions
│   └── ui/                 # UI primitives
└── lib/
    └── api/                # API layer (mock data)
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT License — feel free to use this project for learning or as a starting point for your own store.

---

Built with ❤️ for the DIORA brand

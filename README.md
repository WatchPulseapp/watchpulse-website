# WatchPulse Website

Official promotional website for WatchPulse - AI-powered movie and TV show recommendations app.

## Features

- 🎨 Modern, professional design with "Midnight Calm" theme
- 🌈 Gradient animations and smooth transitions
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Built with Next.js 14+ and React 18
- 🎭 Showcases all app features including mood-based AI recommendations
- 🚀 Optimized for performance and SEO

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
watchpulse-website/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components (Header, Footer, Container)
│   ├── sections/          # Page sections (Hero, Features, etc.)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── constants.ts       # App constants and data
│   ├── animations.ts      # Framer Motion variants
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Color Palette

Based on WatchPulse app's "Midnight Calm" theme:

- **Primary:** #7C8DB0 (Soft Slate Blue)
- **Accent:** #B8977E (Warm Taupe)
- **Gold:** #E0C097
- **Background:** #121417 (Deep Charcoal)
- **Card:** #1C1F26 (Dark Gray)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Deploy with zero configuration

### Other Platforms

Compatible with Netlify, AWS Amplify, Cloudflare Pages, and other Next.js hosting platforms.

## License

MIT

## Contact

- Email: watchpulseapp@gmail.com
- TikTok: [@watchpulseapp](https://www.tiktok.com/@watchpulseapp)
- Instagram: [@watchpulseapp](https://www.instagram.com/watchpulseapp/)

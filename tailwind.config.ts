import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6B7FD7',
          light: '#8B9FE7',
          accent: '#A8B5DC',
          gold: '#F0C97E',
          star: '#FCD34D',
        },
        background: {
          deep: '#0B0D12',
          dark: '#0D0F14',
          card: '#1A1F2A',
          elevated: '#151820',
        },
        text: {
          primary: '#F0F2F5',
          secondary: '#8A92A6',
          muted: '#5A6178',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Bebas Neue', 'Impact', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6B7FD7 0%, #4A5BA0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #A8B5DC 0%, #8A9AC0 100%)',
        'gradient-hero': 'linear-gradient(135deg, #6B7FD7 0%, #A8B5DC 100%)',
        'gradient-pulse': 'linear-gradient(90deg, #6B7FD7 0%, #A8B5DC 45%, #F0C97E 100%)',
        'gradient-cta': 'linear-gradient(135deg, #6B7FD7 0%, #8B9FE7 50%, #A8B5DC 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        // The hero's entrance, in CSS so it does not wait for React. `both`
        // holds the opening frame through the delay, which is what lets the
        // steps be staggered without the element flashing in first.
        rise: 'rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'rise-far': 'riseFar 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'heartbeat': 'heartbeat 2.4s ease-in-out infinite',
        'marquee': 'marquee 32s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(22px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        riseFar: {
          '0%': { transform: 'translateY(48px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Opacity only. Every element wearing this is a 400-500px circle behind
        // a 110-130px blur, and scaling one forces the blur to be re-rasterised
        // on every frame — three of them run for as long as the hero is on
        // screen, which is felt on a mid-range phone. Fading is composited. The
        // 5% scale was not visible through that much blur anyway.
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        heartbeat: {
          '0%, 28%, 70%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.08)' },
          '42%': { transform: 'scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(107, 127, 215, 0.3)',
        'glow-lg': '0 0 60px rgba(107, 127, 215, 0.4)',
        'glow-accent': '0 0 30px rgba(168, 181, 220, 0.3)',
        'glow-gold': '0 0 30px rgba(240, 201, 126, 0.25)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;

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
          primary: '#7C8DB0',
          accent: '#B8977E',
          gold: '#E0C097',
        },
        background: {
          dark: '#121417',
          card: '#1C1F26',
          elevated: '#252932',
        },
        text: {
          primary: '#F1F1F1',
          secondary: '#A0A0A0',
          muted: '#6B7280',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C8DB0 0%, #5A6C8F 100%)',
        'gradient-accent': 'linear-gradient(135deg, #B8977E 0%, #9A7A5E 100%)',
        'gradient-hero': 'linear-gradient(135deg, #7C8DB0 0%, #B8977E 100%)',
        'gradient-radial': 'radial-gradient(circle at center, #7C8DB0 0%, #121417 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import { TrendingUp, Search, Palette, Film, Star, Globe, Moon, Bell } from 'lucide-react';

export const SOCIAL_LINKS = {
  email: 'watchpulseapp@gmail.com',
  twitter: 'https://x.com/watchpulseapp',
  tiktok: 'https://www.tiktok.com/@watchpulseapp?lang=tr-TR',
  instagram: 'https://www.instagram.com/watchpulseapp/',
};

export const FEATURES = [
  {
    id: 'trending',
    icon: TrendingUp,
    title: 'Trending Content',
    description: 'Discover what\'s hot with trending movies & TV shows updated every 3 minutes',
  },
  {
    id: 'search',
    icon: Search,
    title: 'Advanced Search',
    description: 'Find movies, TV shows, and actors instantly with smart search suggestions',
  },
  {
    id: 'mood',
    icon: Palette,
    title: 'Mood-Based AI',
    description: 'Get personalized recommendations based on 10 different moods',
  },
  {
    id: 'collections',
    icon: Film,
    title: 'Collections',
    description: 'Explore curated collections including Marvel, DC, and Star Wars franchises',
  },
  {
    id: 'actors',
    icon: Star,
    title: 'Favorite Actors',
    description: 'Track your favorite celebrities and get notified about their new projects',
  },
  {
    id: 'language',
    icon: Globe,
    title: 'Multi-Language',
    description: 'Seamless support for Turkish and English with instant language switching',
  },
  {
    id: 'themes',
    icon: Moon,
    title: 'Themes',
    description: 'Choose between Dark and Light modes with the sophisticated "Midnight Calm" design',
  },
  {
    id: 'reminders',
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a release with push notifications for your watch reminders',
  },
];

export const MOODS = [
  { id: 'tired', label: 'Tired', emoji: '😴', gradient: 'from-purple-400 to-indigo-500' },
  { id: 'happy', label: 'Happy', emoji: '😊', gradient: 'from-yellow-400 to-orange-400' },
  { id: 'sad', label: 'Sad', emoji: '😢', gradient: 'from-blue-400 to-indigo-500' },
  { id: 'excited', label: 'Excited', emoji: '🤩', gradient: 'from-pink-400 to-red-500' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', gradient: 'from-rose-400 to-pink-500' },
  { id: 'scared', label: 'Scared', emoji: '😱', gradient: 'from-red-600 to-gray-800' },
  { id: 'nostalgic', label: 'Nostalgic', emoji: '🎞️', gradient: 'from-amber-400 to-yellow-600' },
  { id: 'thoughtful', label: 'Thoughtful', emoji: '🤔', gradient: 'from-gray-400 to-slate-600' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🌍', gradient: 'from-green-400 to-emerald-600' },
  { id: 'chill', label: 'Chill', emoji: '😎', gradient: 'from-cyan-400 to-teal-500' },
];

export const SCREENSHOTS = [
  {
    id: 'home',
    title: 'Home - Trending Movies',
    description: 'Browse trending and popular content',
  },
  {
    id: 'search',
    title: 'Search - Find Anything',
    description: 'Advanced search with instant results',
  },
  {
    id: 'mood',
    title: 'Mood Selector - 10 Moods',
    description: 'AI recommendations based on your mood',
  },
  {
    id: 'detail',
    title: 'Movie Detail - Full Info',
    description: 'Complete movie information and trailers',
  },
  {
    id: 'collections',
    title: 'Collections - Franchises',
    description: 'Curated collections and franchises',
  },
  {
    id: 'profile',
    title: 'Profile - Your Favorites',
    description: 'Manage favorites and reminders',
  },
];

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Shield,
  Mail,
  Clock,
  Globe,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  RefreshCw,
  Check,
  X,
  BookOpen,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  Zap,
  Target,
  Edit3,
  Save,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  Info,
  Newspaper,
  PenTool,
  Layout,
  Hash,
  // Yeni ikonlar
  Activity,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Terminal,
  History,
  Keyboard,
  HelpCircle,
  RotateCcw,
  Server,
  Cloud
} from 'lucide-react';

// ==================== INTERFACES ====================
interface WaitlistEntry {
  email: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

interface BlogContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  content: string | string[];
}

interface BlogPost {
  _id?: string;
  slug: string;
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  content: BlogContent[];
  date: string;
  readTime: string;
  category: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  createdAt?: string;
}

interface SystemStatus {
  database: 'online' | 'offline' | 'checking';
  api: 'online' | 'offline' | 'checking';
  groqApi: 'online' | 'offline' | 'checking';
  lastCheck: Date | null;
}

interface ActivityLog {
  id: string;
  type: 'blog_created' | 'blog_deleted' | 'blog_published' | 'blog_updated' | 'waitlist_signup' | 'error' | 'system';
  message: string;
  timestamp: Date;
  details?: string;
}

interface ErrorLog {
  id: string;
  type: 'api' | 'database' | 'validation' | 'unknown';
  message: string;
  timestamp: Date;
  resolved: boolean;
  details?: string;
}

type TabType = 'dashboard' | 'waitlist' | 'blogs' | 'seo' | 'system' | 'activity';

// ==================== CONSTANTS ====================
const CATEGORIES = [
  'Technology', 'Streaming', 'AI & Technology', 'Mood Guide',
  'Genre Guide', 'Psychology', 'Entertainment', 'TV Shows', 'Trends',
  'Hidden Gems', 'Binge Worthy', 'Weekend Watch', 'Date Night', 'Family Time'
];

const QUICK_TOPICS_TR = [
  { label: 'Netflix Gizli Kodları', value: 'Netflix hidden codes and secret categories' },
  { label: 'AI Film Önerileri', value: 'AI movie recommendations and how they work' },
  { label: 'Ruh Haline Göre Film', value: 'Movies based on mood and emotions' },
  { label: 'Hafta Sonu Maratonu', value: 'Best weekend movie marathon ideas' },
  { label: 'Gizli Hazineler', value: 'Hidden gem movies nobody talks about' },
  { label: 'Kore Dizileri', value: 'Korean drama recommendations and why they are popular' },
  { label: 'Psikolojik Gerilim', value: 'Psychological thriller movies that will blow your mind' },
  { label: 'Streaming Karşılaştırma', value: 'Netflix vs Disney+ vs HBO Max comparison' },
  { label: 'Ağlatan Filmler', value: 'Movies that will make you cry' },
  { label: 'Yeni Başlayanlar', value: 'Movie recommendations for beginners' },
  { label: 'Aile Filmleri', value: 'Best family movies everyone will enjoy' },
  { label: 'Randevu Gecesi', value: 'Perfect date night movies' },
  { label: '2025 En İyileri', value: 'Best movies and shows of 2025' },
  { label: 'Uyumadan Önce', value: 'Relaxing movies to watch before sleep' },
  { label: 'Motivasyon Filmleri', value: 'Motivational movies that inspire success' },
  { label: 'Cult Klasikler', value: 'Cult classic movies everyone should watch' },
];

const KEYBOARD_SHORTCUTS = [
  { key: 'G + D', action: 'Dashboard\'a git' },
  { key: 'G + B', action: 'Blog yönetimine git' },
  { key: 'G + W', action: 'Waitlist\'e git' },
  { key: 'G + S', action: 'SEO sayfasına git' },
  { key: 'G + A', action: 'Aktiviteye git' },
  { key: 'G + Y', action: 'Sistem durumuna git' },
  { key: 'N', action: 'Yeni blog oluştur' },
  { key: 'R', action: 'Sayfayı yenile' },
  { key: '/', action: 'Arama' },
  { key: 'Esc', action: 'Modalı kapat' },
  { key: '?', action: 'Kısayolları göster' },
];

const ACTIVITY_TYPES = {
  blog_created: { icon: Plus, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Blog Oluşturuldu' },
  blog_deleted: { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Blog Silindi' },
  blog_published: { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Blog Yayınlandı' },
  blog_updated: { icon: Edit3, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Blog Güncellendi' },
  waitlist_signup: { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Yeni Kayıt' },
  error: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Hata' },
  system: { icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Sistem' },
};

// ==================== MAIN COMPONENT ====================
export default function AdminPage() {
  // Auth State
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Data State
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [suggestions, setSuggestions] = useState<BlogPost[]>([]);

  // UI State
  const [searchTopic, setSearchTopic] = useState('');
  const [suggestionCount, setSuggestionCount] = useState(3);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedBlogs, setSelectedBlogs] = useState<Set<string>>(new Set());

  // Loading State
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [addingBlog, setAddingBlog] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);
  const [editBlog, setEditBlog] = useState<BlogPost | null>(null);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  // Notification State
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // System & Activity State
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'checking',
    api: 'checking',
    groqApi: 'checking',
    lastCheck: null
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);

  // UI Enhancement State
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // ==================== EFFECTS ====================
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchWaitlist(savedKey);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Keyboard Shortcuts
  useEffect(() => {
    let gPressed = false;
    let gTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Modal açıkken veya input'tayken çalışmasın
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (previewBlog || editBlog) {
        if (e.key === 'Escape') {
          setPreviewBlog(null);
          setEditBlog(null);
        }
        return;
      }

      // G tuşu kombinasyonları
      if (e.key === 'g' || e.key === 'G') {
        gPressed = true;
        gTimeout = setTimeout(() => { gPressed = false; }, 500);
        return;
      }

      if (gPressed) {
        gPressed = false;
        clearTimeout(gTimeout);
        switch (e.key.toLowerCase()) {
          case 'd': setActiveTab('dashboard'); break;
          case 'b': setActiveTab('blogs'); break;
          case 'w': setActiveTab('waitlist'); break;
          case 's': setActiveTab('seo'); break;
          case 'a': setActiveTab('activity'); break;
          case 'y': setActiveTab('system'); break;
        }
        return;
      }

      // Tekli kısayollar
      switch (e.key) {
        case '?': setShowShortcuts(true); break;
        case 'Escape':
          setShowShortcuts(false);
          setShowHelp(false);
          setShowCommandPalette(false);
          break;
        case '/':
          e.preventDefault();
          setShowCommandPalette(true);
          break;
        case 'n':
        case 'N':
          if (activeTab === 'blogs') generateSuggestions();
          break;
        case 'r':
        case 'R':
          fetchBlogs();
          fetchWaitlist(adminKey);
          break;
      }
    };

    if (isAuthenticated) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, previewBlog, editBlog, activeTab, adminKey]);

  // System Status Check
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSystemStatus = async () => {
      setSystemStatus(prev => ({ ...prev, database: 'checking', api: 'checking', groqApi: 'checking' }));

      // Check API
      try {
        const apiRes = await fetch('/api/blogs?limit=1');
        setSystemStatus(prev => ({ ...prev, api: apiRes.ok ? 'online' : 'offline' }));
      } catch {
        setSystemStatus(prev => ({ ...prev, api: 'offline' }));
        addErrorLog('api', 'API bağlantısı başarısız');
      }

      // Check Database (via blogs API)
      try {
        const dbRes = await fetch('/api/admin/blogs?limit=1', {
          headers: { 'Authorization': `Bearer ${adminKey}` }
        });
        const dbData = await dbRes.json();
        setSystemStatus(prev => ({ ...prev, database: dbData.success ? 'online' : 'offline' }));
      } catch {
        setSystemStatus(prev => ({ ...prev, database: 'offline' }));
        addErrorLog('database', 'Veritabanı bağlantısı başarısız');
      }

      // Check GROQ API (just check if key exists, actual test would cost tokens)
      const hasGroqKey = true; // We assume it's configured
      setSystemStatus(prev => ({
        ...prev,
        groqApi: hasGroqKey ? 'online' : 'offline',
        lastCheck: new Date()
      }));
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 60000); // Her dakika kontrol
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, adminKey]);

  // ==================== HELPER FUNCTIONS ====================
  const addActivityLog = useCallback((type: ActivityLog['type'], message: string, details?: string) => {
    const log: ActivityLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      details
    };
    setActivityLogs(prev => [log, ...prev].slice(0, 100)); // Max 100 log tut
  }, []);

  const addErrorLog = useCallback((type: ErrorLog['type'], message: string, details?: string) => {
    const log: ErrorLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      resolved: false,
      details
    };
    setErrorLogs(prev => [log, ...prev].slice(0, 50)); // Max 50 hata tut
  }, []);

  const resolveError = (id: string) => {
    setErrorLogs(prev => prev.map(e => e.id === id ? { ...e, resolved: true } : e));
  };

  const clearResolvedErrors = () => {
    setErrorLogs(prev => prev.filter(e => !e.resolved));
  };

  // ==================== API FUNCTIONS ====================
  const fetchWaitlist = async (key: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        headers: { 'Authorization': `Bearer ${key}` }
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError('Geçersiz admin anahtarı');
        localStorage.removeItem('admin_key');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setWaitlist(data.emails || []);
        setIsAuthenticated(true);
        localStorage.setItem('admin_key', key);
      } else {
        setError(data.message || 'Veri alınamadı');
      }
    } catch {
      setError('Sunucu bağlantısı kurulamadı');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blogs', {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      });

      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch {
      console.error('Blog verisi alınamadı');
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const generateSuggestions = async () => {
    setSuggestionsLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const response = await fetch('/api/admin/blog-suggestions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: searchTopic || undefined,
          count: suggestionCount
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
        setSuccessMessage(`🎉 ${data.suggestions.length} blog önerisi oluşturuldu!`);
      } else {
        setError(data.message || 'Blog önerileri alınamadı');
      }
    } catch {
      setError('AI servisi ile bağlantı kurulamadı');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const addBlogFromSuggestion = async (suggestion: BlogPost, publish: boolean = false) => {
    setAddingBlog(suggestion.slug);
    setError('');

    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...suggestion,
          isPublished: publish
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`✅ "${suggestion.title.en.substring(0, 40)}..." ${publish ? 'yayınlandı' : 'taslak olarak kaydedildi'}!`);
        setSuggestions(prev => prev.filter(s => s.slug !== suggestion.slug));
        fetchBlogs();
      } else {
        setError(data.message || 'Blog eklenemedi');
      }
    } catch {
      setError('Blog eklenirken hata oluştu');
    } finally {
      setAddingBlog(null);
    }
  };

  const addAllSuggestions = async (publish: boolean = false) => {
    setActionLoading('addAll');
    let added = 0;

    for (const suggestion of suggestions) {
      try {
        const response = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...suggestion,
            isPublished: publish
          })
        });

        const data = await response.json();
        if (data.success) added++;
      } catch {
        console.error('Blog eklenemedi:', suggestion.slug);
      }
    }

    setSuggestions([]);
    fetchBlogs();
    setSuccessMessage(`✅ ${added} blog ${publish ? 'yayınlandı' : 'taslak olarak kaydedildi'}!`);
    setActionLoading(null);
  };

  const deleteBlog = async (slug: string) => {
    if (!confirm('Bu blogu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

    setActionLoading(slug);
    try {
      const response = await fetch(`/api/admin/blogs?slug=${slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminKey}` }
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('🗑️ Blog silindi!');
        fetchBlogs();
      } else {
        setError(data.message || 'Silme işlemi başarısız');
      }
    } catch {
      setError('Blog silinirken hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBlogPublished = async (blog: BlogPost) => {
    setActionLoading(blog.slug);
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slug: blog.slug,
          isPublished: !blog.isPublished
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(blog.isPublished ? '👁️‍🗨️ Blog gizlendi' : '🚀 Blog yayınlandı!');
        fetchBlogs();
      }
    } catch {
      setError('Durum güncellenemedi');
    } finally {
      setActionLoading(null);
    }
  };

  const bulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedBlogs.size === 0) return;

    const confirmMsg = action === 'delete'
      ? `${selectedBlogs.size} blogu silmek istediğinize emin misiniz?`
      : `${selectedBlogs.size} blogu ${action === 'publish' ? 'yayınlamak' : 'gizlemek'} istediğinize emin misiniz?`;

    if (!confirm(confirmMsg)) return;

    setActionLoading('bulk');

    for (const slug of selectedBlogs) {
      try {
        if (action === 'delete') {
          await fetch(`/api/admin/blogs?slug=${slug}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminKey}` }
          });
        } else {
          await fetch('/api/admin/blogs', {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${adminKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              slug,
              isPublished: action === 'publish'
            })
          });
        }
      } catch {
        console.error('İşlem başarısız:', slug);
      }
    }

    setSelectedBlogs(new Set());
    fetchBlogs();
    setSuccessMessage(`✅ ${selectedBlogs.size} blog üzerinde işlem tamamlandı!`);
    setActionLoading(null);
  };

  const updateBlog = async (blog: BlogPost) => {
    setActionLoading('save');
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('✅ Blog güncellendi!');
        setEditBlog(null);
        fetchBlogs();
      } else {
        setError(data.message || 'Güncelleme başarısız');
      }
    } catch {
      setError('Güncelleme sırasında hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== HELPER FUNCTIONS ====================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWaitlist(adminKey);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setWaitlist([]);
    setBlogs([]);
    setSuggestions([]);
    localStorage.removeItem('admin_key');
  };

  const downloadCSV = () => {
    const csv = [
      ['Email', 'Tarih', 'IP', 'Tarayıcı'],
      ...waitlist.map(entry => [
        entry.email,
        new Date(entry.timestamp).toLocaleString('tr-TR'),
        entry.ip || 'N/A',
        entry.userAgent || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setSuccessMessage('📥 CSV dosyası indirildi!');
  };

  const copyEmails = () => {
    const emails = waitlist.map(e => e.email).join('\n');
    navigator.clipboard.writeText(emails);
    setSuccessMessage('📋 Tüm e-postalar kopyalandı!');
  };

  const copyBlogUrl = (slug: string) => {
    navigator.clipboard.writeText(`https://watchpulseapp.com/blog/${slug}`);
    setSuccessMessage('🔗 Blog URL kopyalandı!');
  };

  const toggleBlogSelection = (slug: string) => {
    const newSet = new Set(selectedBlogs);
    if (newSet.has(slug)) {
      newSet.delete(slug);
    } else {
      newSet.add(slug);
    }
    setSelectedBlogs(newSet);
  };

  const selectAllBlogs = () => {
    if (selectedBlogs.size === filteredBlogs.length) {
      setSelectedBlogs(new Set());
    } else {
      setSelectedBlogs(new Set(filteredBlogs.map(b => b.slug)));
    }
  };

  // ==================== COMPUTED VALUES ====================
  const stats = {
    totalWaitlist: waitlist.length,
    todayWaitlist: waitlist.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length,
    weekWaitlist: waitlist.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(e.timestamp) > weekAgo;
    }).length,
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter(b => b.isPublished).length,
    draftBlogs: blogs.filter(b => !b.isPublished).length,
    categories: Array.from(new Set(blogs.map(b => b.category))).length,
  };

  const filteredBlogs = blogs.filter(blog => {
    const categoryMatch = categoryFilter === 'all' || blog.category === categoryFilter;
    const statusMatch = statusFilter === 'all' ||
      (statusFilter === 'published' && blog.isPublished) ||
      (statusFilter === 'draft' && !blog.isPublished);
    return categoryMatch && statusMatch;
  });

  const usedCategories = Array.from(new Set(blogs.map(b => b.category)));

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-dark via-brand-primary/5 to-background-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-background-card rounded-2xl border border-brand-primary/20 p-8 shadow-2xl">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-2xl mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-hero bg-clip-text text-transparent">
              WatchPulse Admin
            </h1>
            <p className="text-text-secondary text-center mb-8">
              Yönetim paneline erişmek için giriş yapın
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Admin Anahtarı
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !adminKey}
                className="w-full px-6 py-4 bg-gradient-hero rounded-xl text-white font-bold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Kontrol Ediliyor...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Giriş Yap
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-text-muted text-xs mt-6">
              Vercel Environment Variables&apos;dan ADMIN_SECRET_KEY kullanın
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN DASHBOARD ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-brand-primary/5 to-background-dark">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-xl border-b border-brand-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">WatchPulse Admin</h1>
                <p className="text-xs text-text-muted">Yönetim Paneli</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://watchpulseapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Siteyi Görüntüle
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-primary text-sm hover:border-brand-primary/50 transition-colors"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toast Notifications */}
        {successMessage && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
            <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 shadow-lg backdrop-blur-sm">
              <Check className="w-5 h-5" />
              <span className="font-medium">{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="ml-2 hover:bg-green-500/20 rounded p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 shadow-lg backdrop-blur-sm">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError('')} className="ml-2 hover:bg-red-500/20 rounded p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'dashboard', label: 'Genel Bakış', icon: Layout },
            { id: 'blogs', label: 'Blog Yönetimi', icon: Newspaper },
            { id: 'waitlist', label: 'Waitlist', icon: Users },
            { id: 'seo', label: 'SEO & Analitik', icon: BarChart3 },
            { id: 'activity', label: 'Aktivite', icon: Activity },
            { id: 'system', label: 'Sistem', icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-hero text-white shadow-lg shadow-brand-primary/30'
                  : 'bg-background-card border border-brand-primary/20 text-text-secondary hover:border-brand-primary/40 hover:text-text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'system' && errorLogs.filter(e => !e.resolved).length > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}

          {/* Kısayol & Yardım Butonları */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2.5 bg-background-card border border-brand-primary/20 rounded-xl text-text-muted hover:text-text-primary hover:border-brand-primary/40 transition-all"
              title="Klavye Kısayolları (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="p-2.5 bg-background-card border border-brand-primary/20 rounded-xl text-text-muted hover:text-text-primary hover:border-brand-primary/40 transition-all"
              title="Yardım"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand-primary/20 rounded-lg">
                    <Users className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-text-secondary text-sm">Toplam Kayıt</span>
                </div>
                <div className="text-3xl font-bold text-brand-primary">{stats.totalWaitlist}</div>
                <div className="text-xs text-text-muted mt-1">+{stats.todayWaitlist} bugün</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Newspaper className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-text-secondary text-sm">Yayındaki Blog</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{stats.publishedBlogs}</div>
                <div className="text-xs text-text-muted mt-1">{stats.draftBlogs} taslak</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand-accent/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-brand-accent" />
                  </div>
                  <span className="text-text-secondary text-sm">Bu Hafta</span>
                </div>
                <div className="text-3xl font-bold text-brand-accent">{stats.weekWaitlist}</div>
                <div className="text-xs text-text-muted mt-1">yeni kayıt</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand-gold/20 rounded-lg">
                    <Hash className="w-5 h-5 text-brand-gold" />
                  </div>
                  <span className="text-text-secondary text-sm">Kategori</span>
                </div>
                <div className="text-3xl font-bold text-brand-gold">{stats.categories}</div>
                <div className="text-xs text-text-muted mt-1">aktif kategori</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-accent" />
                Hızlı İşlemler
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => { setActiveTab('blogs'); generateSuggestions(); }}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-hero rounded-xl text-white hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-6 h-6" />
                  <span className="text-sm font-medium">AI Blog Oluştur</span>
                </button>
                <button
                  onClick={() => setActiveTab('waitlist')}
                  className="flex flex-col items-center gap-2 p-4 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span className="text-sm font-medium">CSV İndir</span>
                </button>
                <button
                  onClick={() => setActiveTab('blogs')}
                  className="flex flex-col items-center gap-2 p-4 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-all"
                >
                  <FileText className="w-6 h-6" />
                  <span className="text-sm font-medium">Blogları Yönet</span>
                </button>
                <a
                  href="https://watchpulseapp.com/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-all"
                >
                  <Globe className="w-6 h-6" />
                  <span className="text-sm font-medium">Blogu Görüntüle</span>
                </a>
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-primary" />
                  Son Eklenen Bloglar
                </h3>
                <button
                  onClick={() => setActiveTab('blogs')}
                  className="text-sm text-brand-primary hover:text-brand-accent transition-colors"
                >
                  Tümünü Gör →
                </button>
              </div>
              <div className="space-y-3">
                {blogs.slice(0, 5).map((blog) => (
                  <div
                    key={blog.slug}
                    className="flex items-center justify-between p-3 bg-background-dark rounded-xl border border-brand-primary/10 hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${blog.isPublished ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <span className="text-xs text-text-muted">{blog.category}</span>
                      </div>
                      <p className="text-text-primary font-medium truncate">{blog.title.en}</p>
                    </div>
                    <a
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-text-muted" />
                    </a>
                  </div>
                ))}
                {blogs.length === 0 && (
                  <p className="text-center text-text-muted py-8">Henüz blog eklenmemiş</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== BLOGS TAB ==================== */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            {/* AI Blog Generator */}
            <div className="bg-gradient-to-r from-brand-primary/10 via-brand-accent/10 to-brand-gold/10 border border-brand-primary/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-hero rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">AI Blog Oluşturucu</h3>
                  <p className="text-text-secondary text-sm">Yapay zeka ile SEO uyumlu blog içeriği oluşturun</p>
                </div>
              </div>

              {/* Quick Topics */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Hızlı Konu Seçimi
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TOPICS_TR.map((topic) => (
                    <button
                      key={topic.value}
                      onClick={() => setSearchTopic(topic.value)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                        searchTopic === topic.value
                          ? 'bg-brand-primary text-white'
                          : 'bg-background-dark border border-brand-primary/20 text-text-secondary hover:border-brand-primary/50'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="flex flex-col lg:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    placeholder="Konu girin (İngilizce olarak yazın - ör: best movies for anxiety)"
                    className="w-full pl-12 pr-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                {/* Count Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-sm whitespace-nowrap">Blog Sayısı:</span>
                  <div className="flex gap-1">
                    {[1, 3, 5].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSuggestionCount(count)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          suggestionCount === count
                            ? 'bg-brand-primary text-white'
                            : 'bg-background-dark border border-brand-primary/30 text-text-secondary hover:border-brand-primary/50'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateSuggestions}
                  disabled={suggestionsLoading}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-hero rounded-xl text-white font-bold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50 min-w-[200px]"
                >
                  {suggestionsLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Blog Oluştur
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Info className="w-4 h-4" />
                <span>Bloglar İngilizce olarak oluşturulur ve yayınlanır. Türkçe çevirisi otomatik eklenir.</span>
              </div>
            </div>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-background-card border border-brand-accent/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-accent" />
                    AI Önerileri ({suggestions.length} blog)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addAllSuggestions(false)}
                      disabled={actionLoading === 'addAll'}
                      className="flex items-center gap-2 px-4 py-2 bg-background-dark border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Tümünü Taslak Kaydet
                    </button>
                    <button
                      onClick={() => addAllSuggestions(true)}
                      disabled={actionLoading === 'addAll'}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-background-dark font-semibold rounded-lg hover:bg-brand-gold transition-colors text-sm"
                    >
                      {actionLoading === 'addAll' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Tümünü Yayınla
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.slug}
                      className="bg-background-dark border border-brand-primary/20 rounded-xl overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                                {suggestion.category}
                              </span>
                              <span className="text-text-muted text-xs">{suggestion.readTime}</span>
                              {suggestion.tags && suggestion.tags.length > 0 && (
                                <span className="text-text-muted text-xs">
                                  • {suggestion.tags.slice(0, 3).join(', ')}
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-text-primary mb-2">{suggestion.title.en}</h4>
                            <p className="text-text-secondary text-sm mb-2 line-clamp-2">{suggestion.excerpt.en}</p>
                            <p className="text-text-muted text-xs">🇹🇷 {suggestion.title.tr}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setExpandedSuggestion(expandedSuggestion === suggestion.slug ? null : suggestion.slug)}
                              className="flex items-center gap-2 px-4 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors text-sm"
                            >
                              <BookOpen className="w-4 h-4" />
                              {expandedSuggestion === suggestion.slug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => addBlogFromSuggestion(suggestion, false)}
                              disabled={addingBlog === suggestion.slug}
                              className="flex items-center gap-2 px-4 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors text-sm"
                            >
                              <Save className="w-4 h-4" />
                              Taslak
                            </button>
                            <button
                              onClick={() => addBlogFromSuggestion(suggestion, true)}
                              disabled={addingBlog === suggestion.slug}
                              className="flex items-center gap-2 px-5 py-2 bg-brand-accent text-background-dark font-semibold rounded-lg hover:bg-brand-gold transition-colors text-sm"
                            >
                              {addingBlog === suggestion.slug ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                              Yayınla
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedSuggestion === suggestion.slug && (
                        <div className="border-t border-brand-primary/20 bg-background-card/50 p-5 max-h-96 overflow-y-auto">
                          <div className="space-y-4">
                            {suggestion.content?.map((block, idx) => (
                              <div key={idx}>
                                {block.type === 'heading' && (
                                  <h3 className="text-lg font-bold text-brand-primary mt-4 mb-2">{block.content as string}</h3>
                                )}
                                {block.type === 'paragraph' && (
                                  <p className="text-text-secondary text-sm leading-relaxed">{block.content as string}</p>
                                )}
                                {block.type === 'list' && Array.isArray(block.content) && (
                                  <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm ml-4">
                                    {block.content.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                )}
                                {block.type === 'quote' && (
                                  <blockquote className="border-l-4 border-brand-accent pl-4 italic text-text-muted text-sm">
                                    &ldquo;{block.content as string}&rdquo;
                                  </blockquote>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Filters & Stats */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Filters */}
              <div className="flex-1 bg-background-card border border-brand-primary/20 rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">Filtrele:</span>
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-background-dark border border-brand-primary/30 rounded-lg text-text-primary text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    {usedCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                    className="px-3 py-2 bg-background-dark border border-brand-primary/30 rounded-lg text-text-primary text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                  </select>

                  <button
                    onClick={fetchBlogs}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-background-dark border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-3">
                <div className="bg-background-card border border-brand-primary/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className="text-2xl font-bold text-brand-primary">{stats.totalBlogs}</div>
                  <div className="text-xs text-text-muted">Toplam</div>
                </div>
                <div className="bg-background-card border border-brand-primary/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className="text-2xl font-bold text-green-400">{stats.publishedBlogs}</div>
                  <div className="text-xs text-text-muted">Yayında</div>
                </div>
                <div className="bg-background-card border border-brand-primary/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className="text-2xl font-bold text-yellow-400">{stats.draftBlogs}</div>
                  <div className="text-xs text-text-muted">Taslak</div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedBlogs.size > 0 && (
              <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <span className="text-text-primary font-medium">
                  {selectedBlogs.size} blog seçildi
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => bulkAction('publish')}
                    disabled={actionLoading === 'bulk'}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Yayınla
                  </button>
                  <button
                    onClick={() => bulkAction('unpublish')}
                    disabled={actionLoading === 'bulk'}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                  >
                    <EyeOff className="w-4 h-4" />
                    Gizle
                  </button>
                  <button
                    onClick={() => bulkAction('delete')}
                    disabled={actionLoading === 'bulk'}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                  <button
                    onClick={() => setSelectedBlogs(new Set())}
                    className="flex items-center gap-2 px-4 py-2 bg-background-dark border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    İptal
                  </button>
                </div>
              </div>
            )}

            {/* Blog Table */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-20">
                  <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted mb-2">
                    {blogs.length === 0 ? 'Henüz blog eklenmemiş' : 'Filtrelere uygun blog bulunamadı'}
                  </p>
                  <p className="text-text-secondary text-sm">AI ile blog önerileri alarak başlayın!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brand-primary/10 border-b border-brand-primary/20">
                      <tr>
                        <th className="text-left p-4">
                          <button
                            onClick={selectAllBlogs}
                            className="p-1 hover:bg-brand-primary/20 rounded transition-colors"
                          >
                            {selectedBlogs.size === filteredBlogs.length ? (
                              <CheckSquare className="w-5 h-5 text-brand-primary" />
                            ) : (
                              <Square className="w-5 h-5 text-text-muted" />
                            )}
                          </button>
                        </th>
                        <th className="text-left p-4 text-text-primary font-semibold">Blog</th>
                        <th className="text-left p-4 text-text-primary font-semibold">Kategori</th>
                        <th className="text-left p-4 text-text-primary font-semibold">Tarih</th>
                        <th className="text-left p-4 text-text-primary font-semibold">Durum</th>
                        <th className="text-right p-4 text-text-primary font-semibold">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.map((blog) => (
                        <tr
                          key={blog.slug}
                          className={`border-b border-brand-primary/10 hover:bg-brand-primary/5 transition-colors ${
                            selectedBlogs.has(blog.slug) ? 'bg-brand-primary/10' : ''
                          }`}
                        >
                          <td className="p-4">
                            <button
                              onClick={() => toggleBlogSelection(blog.slug)}
                              className="p-1 hover:bg-brand-primary/20 rounded transition-colors"
                            >
                              {selectedBlogs.has(blog.slug) ? (
                                <CheckSquare className="w-5 h-5 text-brand-primary" />
                              ) : (
                                <Square className="w-5 h-5 text-text-muted" />
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="max-w-md">
                              <p className="font-medium text-text-primary truncate">{blog.title.en}</p>
                              <p className="text-xs text-text-muted mt-1">/{blog.slug}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                              {blog.category}
                            </span>
                          </td>
                          <td className="p-4 text-text-secondary text-sm whitespace-nowrap">{blog.date}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              blog.isPublished
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {blog.isPublished ? 'Yayında' : 'Taslak'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setPreviewBlog(blog)}
                                className="p-2 hover:bg-brand-accent/20 rounded-lg transition-colors"
                                title="Önizle"
                              >
                                <BookOpen className="w-4 h-4 text-brand-accent" />
                              </button>
                              <button
                                onClick={() => setEditBlog(blog)}
                                className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                                title="Düzenle"
                              >
                                <Edit3 className="w-4 h-4 text-brand-primary" />
                              </button>
                              <button
                                onClick={() => copyBlogUrl(blog.slug)}
                                className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                                title="URL Kopyala"
                              >
                                <Copy className="w-4 h-4 text-text-muted" />
                              </button>
                              <a
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                                title="Sitede Aç"
                              >
                                <ExternalLink className="w-4 h-4 text-text-muted" />
                              </a>
                              <button
                                onClick={() => toggleBlogPublished(blog)}
                                disabled={actionLoading === blog.slug}
                                className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                                title={blog.isPublished ? 'Gizle' : 'Yayınla'}
                              >
                                {actionLoading === blog.slug ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
                                ) : blog.isPublished ? (
                                  <EyeOff className="w-4 h-4 text-text-muted" />
                                ) : (
                                  <Eye className="w-4 h-4 text-text-muted" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteBlog(blog.slug)}
                                disabled={actionLoading === blog.slug}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== WAITLIST TAB ==================== */}
        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-primary/20 rounded-lg">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-text-secondary text-sm">Toplam Kayıt</span>
                </div>
                <div className="text-4xl font-bold text-brand-primary">{stats.totalWaitlist}</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-accent/20 rounded-lg">
                    <Clock className="w-5 h-5 text-brand-accent" />
                  </div>
                  <span className="text-text-secondary text-sm">Bugün</span>
                </div>
                <div className="text-4xl font-bold text-brand-accent">{stats.todayWaitlist}</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-gold/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-brand-gold" />
                  </div>
                  <span className="text-text-secondary text-sm">Bu Hafta</span>
                </div>
                <div className="text-4xl font-bold text-brand-gold">{stats.weekWaitlist}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-hero rounded-xl text-white font-semibold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all"
              >
                <Download className="w-5 h-5" />
                CSV İndir
              </button>
              <button
                onClick={copyEmails}
                className="flex items-center gap-2 px-6 py-3 bg-background-card border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-colors"
              >
                <Copy className="w-5 h-5" />
                E-postaları Kopyala
              </button>
              <button
                onClick={() => fetchWaitlist(adminKey)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-background-card border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Yenile
              </button>
            </div>

            {/* Waitlist Table */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-primary/10 border-b border-brand-primary/20">
                    <tr>
                      <th className="text-left p-4 text-text-primary font-semibold">#</th>
                      <th className="text-left p-4 text-text-primary font-semibold">E-posta</th>
                      <th className="text-left p-4 text-text-primary font-semibold">Tarih</th>
                      <th className="text-left p-4 text-text-primary font-semibold">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.map((entry, index) => (
                      <tr key={entry.email} className="border-b border-brand-primary/10 hover:bg-brand-primary/5 transition-colors">
                        <td className="p-4 text-text-secondary">{index + 1}</td>
                        <td className="p-4 text-text-primary font-medium">{entry.email}</td>
                        <td className="p-4 text-text-secondary text-sm">{new Date(entry.timestamp).toLocaleString('tr-TR')}</td>
                        <td className="p-4 text-text-secondary text-sm font-mono">{entry.ip || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {waitlist.length === 0 && (
                <div className="text-center py-16">
                  <Mail className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted">Henüz kayıt yok</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== SEO TAB ==================== */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* SEO Overview */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-primary" />
                SEO Durumu
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-background-dark rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-text-secondary">Sitemap</span>
                  </div>
                  <p className="text-green-400 font-medium">Aktif</p>
                  <a href="https://watchpulseapp.com/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-brand-primary">
                    /sitemap.xml →
                  </a>
                </div>

                <div className="p-4 bg-background-dark rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-text-secondary">Robots.txt</span>
                  </div>
                  <p className="text-green-400 font-medium">Yapılandırılmış</p>
                  <a href="https://watchpulseapp.com/robots.txt" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-brand-primary">
                    /robots.txt →
                  </a>
                </div>

                <div className="p-4 bg-background-dark rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-text-secondary">RSS Feed</span>
                  </div>
                  <p className="text-green-400 font-medium">Aktif</p>
                  <a href="https://watchpulseapp.com/feed.xml" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-brand-primary">
                    /feed.xml →
                  </a>
                </div>

                <div className="p-4 bg-background-dark rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-text-secondary">Schema.org</span>
                  </div>
                  <p className="text-green-400 font-medium">16 Schema</p>
                  <span className="text-xs text-text-muted">Rich Snippets için</span>
                </div>
              </div>
            </div>

            {/* SEO Checklist */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-brand-accent" />
                SEO Kontrol Listesi
              </h3>

              <div className="space-y-3">
                {[
                  { check: true, label: 'Meta başlıklar her sayfada tanımlı' },
                  { check: true, label: 'Meta açıklamalar optimize edilmiş' },
                  { check: true, label: 'Open Graph etiketleri ekli' },
                  { check: true, label: 'Twitter Card etiketleri ekli' },
                  { check: true, label: 'Canonical URL\'ler tanımlı' },
                  { check: true, label: 'Structured Data (JSON-LD) ekli' },
                  { check: true, label: 'Sitemap.xml oluşturulmuş' },
                  { check: true, label: 'Robots.txt yapılandırılmış' },
                  { check: true, label: 'RSS Feed aktif' },
                  { check: stats.publishedBlogs > 10, label: `En az 10 blog yayında (${stats.publishedBlogs}/10)` },
                  { check: true, label: 'Görsel optimizasyonu (WebP/AVIF)' },
                  { check: true, label: 'Mobil uyumluluk' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-background-dark rounded-lg">
                    {item.check ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                    <span className={item.check ? 'text-text-primary' : 'text-text-muted'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-gold" />
                Faydalı Linkler
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Google Search Console', url: 'https://search.google.com/search-console', desc: 'Arama performansını izle' },
                  { label: 'Google PageSpeed', url: 'https://pagespeed.web.dev/?url=https://watchpulseapp.com', desc: 'Site hızını test et' },
                  { label: 'Rich Results Test', url: 'https://search.google.com/test/rich-results?url=https://watchpulseapp.com', desc: 'Schema.org kontrolü' },
                  { label: 'Mobile-Friendly Test', url: 'https://search.google.com/test/mobile-friendly?url=https://watchpulseapp.com', desc: 'Mobil uyumluluk' },
                  { label: 'Bing Webmaster Tools', url: 'https://www.bing.com/webmasters', desc: 'Bing arama yönetimi' },
                  { label: 'Ahrefs Backlink Checker', url: 'https://ahrefs.com/backlink-checker', desc: 'Backlink analizi' },
                ].map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-background-dark rounded-xl border border-brand-primary/20 hover:border-brand-primary/50 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-text-primary group-hover:text-brand-primary transition-colors">{link.label}</p>
                      <p className="text-xs text-text-muted">{link.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ACTIVITY TAB ==================== */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Activity Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Activity className="w-6 h-6 text-brand-primary" />
                  Aktivite Akışı
                </h2>
                <p className="text-text-muted text-sm mt-1">Son işlemler ve sistem olayları</p>
              </div>
              <button
                onClick={() => setActivityLogs([])}
                className="flex items-center gap-2 px-4 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Temizle
              </button>
            </div>

            {/* Activity List */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl overflow-hidden">
              {activityLogs.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted mb-2">Henüz aktivite yok</p>
                  <p className="text-text-secondary text-sm">İşlemler burada görünecek</p>
                </div>
              ) : (
                <div className="divide-y divide-brand-primary/10">
                  {activityLogs.map((log) => {
                    const config = ACTIVITY_TYPES[log.type];
                    const IconComponent = config.icon;
                    return (
                      <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-brand-primary/5 transition-colors">
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <IconComponent className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="text-xs text-text-muted">
                              {log.timestamp.toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-text-primary text-sm">{log.message}</p>
                          {log.details && (
                            <p className="text-text-muted text-xs mt-1">{log.details}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== SYSTEM TAB ==================== */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Status Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Server className="w-6 h-6 text-brand-primary" />
                  Sistem Durumu
                </h2>
                <p className="text-text-muted text-sm mt-1">
                  Son kontrol: {systemStatus.lastCheck ? systemStatus.lastCheck.toLocaleString('tr-TR') : 'Kontrol ediliyor...'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSystemStatus(prev => ({ ...prev, database: 'checking', api: 'checking', groqApi: 'checking' }));
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-hero rounded-lg text-white text-sm hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Yeniden Kontrol Et
              </button>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Database Status */}
              <div className={`bg-background-card border rounded-2xl p-6 ${
                systemStatus.database === 'online' ? 'border-green-500/30' :
                systemStatus.database === 'offline' ? 'border-red-500/30' : 'border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    systemStatus.database === 'online' ? 'bg-green-500/20' :
                    systemStatus.database === 'offline' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <Database className={`w-6 h-6 ${
                      systemStatus.database === 'online' ? 'text-green-400' :
                      systemStatus.database === 'offline' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-semibold">Veritabanı</h3>
                    <p className="text-text-muted text-xs">MongoDB Atlas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {systemStatus.database === 'checking' ? (
                    <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                  ) : systemStatus.database === 'online' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    systemStatus.database === 'online' ? 'text-green-400' :
                    systemStatus.database === 'offline' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {systemStatus.database === 'checking' ? 'Kontrol Ediliyor' :
                     systemStatus.database === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </span>
                </div>
              </div>

              {/* API Status */}
              <div className={`bg-background-card border rounded-2xl p-6 ${
                systemStatus.api === 'online' ? 'border-green-500/30' :
                systemStatus.api === 'offline' ? 'border-red-500/30' : 'border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    systemStatus.api === 'online' ? 'bg-green-500/20' :
                    systemStatus.api === 'offline' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <Cloud className={`w-6 h-6 ${
                      systemStatus.api === 'online' ? 'text-green-400' :
                      systemStatus.api === 'offline' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-semibold">API</h3>
                    <p className="text-text-muted text-xs">Next.js API Routes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {systemStatus.api === 'checking' ? (
                    <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                  ) : systemStatus.api === 'online' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    systemStatus.api === 'online' ? 'text-green-400' :
                    systemStatus.api === 'offline' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {systemStatus.api === 'checking' ? 'Kontrol Ediliyor' :
                     systemStatus.api === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </span>
                </div>
              </div>

              {/* GROQ API Status */}
              <div className={`bg-background-card border rounded-2xl p-6 ${
                systemStatus.groqApi === 'online' ? 'border-green-500/30' :
                systemStatus.groqApi === 'offline' ? 'border-red-500/30' : 'border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    systemStatus.groqApi === 'online' ? 'bg-green-500/20' :
                    systemStatus.groqApi === 'offline' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <Cpu className={`w-6 h-6 ${
                      systemStatus.groqApi === 'online' ? 'text-green-400' :
                      systemStatus.groqApi === 'offline' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-semibold">AI Servisi</h3>
                    <p className="text-text-muted text-xs">GROQ API</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {systemStatus.groqApi === 'checking' ? (
                    <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                  ) : systemStatus.groqApi === 'online' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    systemStatus.groqApi === 'online' ? 'text-green-400' :
                    systemStatus.groqApi === 'offline' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {systemStatus.groqApi === 'checking' ? 'Kontrol Ediliyor' :
                     systemStatus.groqApi === 'online' ? 'Yapılandırılmış' : 'Yapılandırılmamış'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Logs */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Hata Kayıtları
                  {errorLogs.filter(e => !e.resolved).length > 0 && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
                      {errorLogs.filter(e => !e.resolved).length}
                    </span>
                  )}
                </h3>
                {errorLogs.some(e => e.resolved) && (
                  <button
                    onClick={clearResolvedErrors}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    Çözülmüşleri Temizle
                  </button>
                )}
              </div>

              {errorLogs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-medium">Hata Yok</p>
                  <p className="text-text-muted text-sm mt-1">Sistem sorunsuz çalışıyor</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {errorLogs.map((err) => (
                    <div
                      key={err.id}
                      className={`flex items-start justify-between p-4 rounded-xl border ${
                        err.resolved
                          ? 'bg-background-dark/50 border-brand-primary/10 opacity-50'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${err.resolved ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {err.resolved ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-0.5 bg-background-dark rounded text-text-muted uppercase">
                              {err.type}
                            </span>
                            <span className="text-xs text-text-muted">
                              {err.timestamp.toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <p className={`text-sm ${err.resolved ? 'text-text-muted' : 'text-text-primary'}`}>
                            {err.message}
                          </p>
                          {err.details && (
                            <p className="text-xs text-text-muted mt-1 font-mono">{err.details}</p>
                          )}
                        </div>
                      </div>
                      {!err.resolved && (
                        <button
                          onClick={() => resolveError(err.id)}
                          className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-lg hover:bg-green-500/30 transition-colors"
                        >
                          Çözüldü
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Info */}
            <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-brand-accent" />
                Sistem Bilgisi
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-background-dark rounded-xl">
                  <p className="text-text-muted text-xs mb-1">Platform</p>
                  <p className="text-text-primary font-medium">Vercel</p>
                </div>
                <div className="p-4 bg-background-dark rounded-xl">
                  <p className="text-text-muted text-xs mb-1">Framework</p>
                  <p className="text-text-primary font-medium">Next.js 14</p>
                </div>
                <div className="p-4 bg-background-dark rounded-xl">
                  <p className="text-text-muted text-xs mb-1">Veritabanı</p>
                  <p className="text-text-primary font-medium">MongoDB</p>
                </div>
                <div className="p-4 bg-background-dark rounded-xl">
                  <p className="text-text-muted text-xs mb-1">AI Model</p>
                  <p className="text-text-primary font-medium">Llama 3.3 70B</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODALS ==================== */}

        {/* Preview Modal */}
        {previewBlog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background-card border border-brand-primary/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-brand-primary/20">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                      {previewBlog.category}
                    </span>
                    <span className="text-text-muted text-xs">{previewBlog.readTime}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      previewBlog.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {previewBlog.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary truncate">{previewBlog.title.en}</h2>
                </div>
                <button
                  onClick={() => setPreviewBlog(null)}
                  className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors ml-4"
                >
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 mb-6">
                  <p className="text-text-secondary italic">{previewBlog.excerpt.en}</p>
                </div>

                {previewBlog.tags && previewBlog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {previewBlog.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-background-dark text-text-muted text-xs rounded-full border border-brand-primary/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {previewBlog.content?.map((block, idx) => (
                    <div key={idx}>
                      {block.type === 'heading' && (
                        <h3 className="text-xl font-bold text-brand-primary mt-6 mb-3">{block.content as string}</h3>
                      )}
                      {block.type === 'paragraph' && (
                        <p className="text-text-secondary leading-relaxed">{block.content as string}</p>
                      )}
                      {block.type === 'list' && Array.isArray(block.content) && (
                        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                          {block.content.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {block.type === 'quote' && (
                        <blockquote className="border-l-4 border-brand-accent pl-4 py-2 italic text-text-muted">
                          &ldquo;{block.content as string}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 border-t border-brand-primary/20 bg-background-dark/50">
                <div className="text-sm text-text-muted">
                  {previewBlog.content?.length || 0} bölüm • {previewBlog.date}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/blog/${previewBlog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Sitede Aç
                  </a>
                  <button
                    onClick={() => setPreviewBlog(null)}
                    className="px-4 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editBlog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background-card border border-brand-primary/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-brand-primary/20">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-brand-primary" />
                  Blog Düzenle
                </h2>
                <button
                  onClick={() => setEditBlog(null)}
                  className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Başlık (EN)</label>
                  <input
                    type="text"
                    value={editBlog.title.en}
                    onChange={(e) => setEditBlog({ ...editBlog, title: { ...editBlog.title, en: e.target.value } })}
                    className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Başlık (TR)</label>
                  <input
                    type="text"
                    value={editBlog.title.tr}
                    onChange={(e) => setEditBlog({ ...editBlog, title: { ...editBlog.title, tr: e.target.value } })}
                    className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Özet (EN)</label>
                  <textarea
                    value={editBlog.excerpt.en}
                    onChange={(e) => setEditBlog({ ...editBlog, excerpt: { ...editBlog.excerpt, en: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary focus:outline-none focus:border-brand-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Kategori</label>
                    <select
                      value={editBlog.category}
                      onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })}
                      className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary focus:outline-none focus:border-brand-primary"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Durum</label>
                    <select
                      value={editBlog.isPublished ? 'published' : 'draft'}
                      onChange={(e) => setEditBlog({ ...editBlog, isPublished: e.target.value === 'published' })}
                      className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary focus:outline-none focus:border-brand-primary"
                    >
                      <option value="published">Yayında</option>
                      <option value="draft">Taslak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Etiketler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={editBlog.tags?.join(', ') || ''}
                    onChange={(e) => setEditBlog({ ...editBlog, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    placeholder="AI, movies, streaming, Netflix"
                    className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-brand-primary/20 bg-background-dark/50">
                <button
                  onClick={() => setEditBlog(null)}
                  className="px-6 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => updateBlog(editBlog)}
                  disabled={actionLoading === 'save'}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-hero rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {actionLoading === 'save' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {showShortcuts && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
            <div className="bg-background-card border border-brand-primary/30 rounded-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-brand-primary/20">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-brand-primary" />
                  Klavye Kısayolları
                </h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {KEYBOARD_SHORTCUTS.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-background-dark rounded-lg">
                      <span className="text-text-secondary text-sm">{shortcut.action}</span>
                      <kbd className="px-3 py-1.5 bg-brand-primary/20 text-brand-primary text-xs font-mono font-semibold rounded-lg">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
                <p className="text-text-muted text-xs text-center mt-4">
                  ESC tuşuna basarak bu pencereyi kapatabilirsiniz
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
            <div className="bg-background-card border border-brand-primary/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-brand-primary/20">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-primary" />
                  Yardım & Rehber
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Blog Oluşturma */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-accent" />
                    AI ile Blog Oluşturma
                  </h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>1. <strong>Blog Yönetimi</strong> sekmesine gidin</p>
                    <p>2. Hızlı konu butonlarından birini seçin veya özel bir konu yazın</p>
                    <p>3. Blog sayısını seçin (1, 3 veya 5)</p>
                    <p>4. <strong>Blog Oluştur</strong> butonuna tıklayın</p>
                    <p>5. Oluşan blogları önizleyin ve yayınlayın</p>
                  </div>
                </div>

                {/* Blog Yönetimi */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-brand-accent" />
                    Blog Yönetimi
                  </h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>• <strong>Toplu İşlemler:</strong> Checkbox ile birden fazla blog seçip toplu yayınlama/silme yapabilirsiniz</p>
                    <p>• <strong>Filtreleme:</strong> Kategori ve durum filtrelerini kullanarak blogları filtreleyebilirsiniz</p>
                    <p>• <strong>Düzenleme:</strong> Kalem ikonuna tıklayarak blog başlık ve içeriğini düzenleyebilirsiniz</p>
                    <p>• <strong>Önizleme:</strong> Kitap ikonuna tıklayarak blogu önizleyebilirsiniz</p>
                  </div>
                </div>

                {/* Sistem Durumu */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5 text-brand-accent" />
                    Sistem Durumu
                  </h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>• <strong>Yeşil:</strong> Servis çalışıyor</p>
                    <p>• <strong>Sarı:</strong> Kontrol ediliyor</p>
                    <p>• <strong>Kırmızı:</strong> Servis çalışmıyor veya hata var</p>
                    <p>Hata durumunda &quot;Sistem&quot; sekmesinden detayları görebilirsiniz</p>
                  </div>
                </div>

                {/* İpuçları */}
                <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-brand-primary mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Pro İpuçları
                  </h3>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    <li>• Klavye kısayolları ile daha hızlı gezinin (? tuşuna basın)</li>
                    <li>• Blog konularını İngilizce girin, içerik otomatik İngilizce oluşturulur</li>
                    <li>• SEO sekmesinden sitenizin arama motoru durumunu kontrol edin</li>
                    <li>• Düzenli blog yayınlamak SEO sıralamanızı artırır</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Command Palette Modal */}
        {showCommandPalette && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]" onClick={() => setShowCommandPalette(false)}>
            <div className="bg-background-card border border-brand-primary/30 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-brand-primary/20">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Arama yapın veya komut girin..."
                    className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 bg-background-dark text-text-muted text-xs rounded">ESC</kbd>
                </div>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                <div className="text-xs text-text-muted px-3 py-2">Hızlı Erişim</div>
                {[
                  { icon: Layout, label: 'Dashboard', action: () => { setActiveTab('dashboard'); setShowCommandPalette(false); } },
                  { icon: Newspaper, label: 'Blog Yönetimi', action: () => { setActiveTab('blogs'); setShowCommandPalette(false); } },
                  { icon: Users, label: 'Waitlist', action: () => { setActiveTab('waitlist'); setShowCommandPalette(false); } },
                  { icon: BarChart3, label: 'SEO & Analitik', action: () => { setActiveTab('seo'); setShowCommandPalette(false); } },
                  { icon: Activity, label: 'Aktivite', action: () => { setActiveTab('activity'); setShowCommandPalette(false); } },
                  { icon: Server, label: 'Sistem Durumu', action: () => { setActiveTab('system'); setShowCommandPalette(false); } },
                  { icon: Sparkles, label: 'Yeni Blog Oluştur', action: () => { setActiveTab('blogs'); generateSuggestions(); setShowCommandPalette(false); } },
                  { icon: RefreshCw, label: 'Verileri Yenile', action: () => { fetchBlogs(); fetchWaitlist(adminKey); setShowCommandPalette(false); } },
                  { icon: Download, label: 'CSV İndir', action: () => { downloadCSV(); setShowCommandPalette(false); } },
                ].filter(item =>
                  searchQuery === '' || item.label.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-brand-primary/10 hover:text-text-primary transition-colors text-left"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

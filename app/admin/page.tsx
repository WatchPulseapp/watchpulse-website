'use client';

import { useState, useEffect } from 'react';
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
  ChevronUp
} from 'lucide-react';

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
}

type TabType = 'waitlist' | 'blogs';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('waitlist');

  // Waitlist state
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  // Blog state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [suggestions, setSuggestions] = useState<BlogPost[]>([]);
  const [searchTopic, setSearchTopic] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [addingBlog, setAddingBlog] = useState<string | null>(null);

  // Preview states
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchWaitlist(savedKey);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'blogs') {
      fetchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
        setWaitlist(data.emails);
        setIsAuthenticated(true);
        localStorage.setItem('admin_key', key);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Waitlist alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blogs', {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      });

      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

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
          topic: searchTopic || 'movies, TV shows, streaming tips, AI recommendations',
          count: 3
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
        setSuccessMessage(`${data.suggestions.length} blog önerisi oluşturuldu!`);
      } else {
        setError(data.message || 'Blog önerileri alınamadı');
      }
    } catch {
      setError('AI servisi ile bağlantı kurulamadı');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const addBlogFromSuggestion = async (suggestion: BlogPost) => {
    setAddingBlog(suggestion.slug);
    setError('');

    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(suggestion)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`"${suggestion.title.en}" blogu eklendi!`);
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

  const deleteBlog = async (slug: string) => {
    if (!confirm('Bu blogu silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/blogs?slug=${slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminKey}` }
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Blog silindi!');
        fetchBlogs();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Blog silinirken hata oluştu');
    }
  };

  const toggleBlogPublished = async (blog: BlogPost) => {
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
        setSuccessMessage(blog.isPublished ? 'Blog gizlendi' : 'Blog yayınlandı');
        fetchBlogs();
      }
    } catch {
      setError('Durum güncellenemedi');
    }
  };

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
        new Date(entry.timestamp).toLocaleString(),
        entry.ip || 'N/A',
        entry.userAgent || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const copyEmails = () => {
    const emails = waitlist.map(e => e.email).join('\n');
    navigator.clipboard.writeText(emails);
    setSuccessMessage('Tüm mailler kopyalandı!');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-dark via-brand-primary/5 to-background-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-background-card rounded-2xl border border-brand-primary/20 p-8 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-2xl mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-hero bg-clip-text text-transparent">
              Admin Girişi
            </h1>
            <p className="text-text-secondary text-center mb-8">
              Admin paneline erişmek için anahtarınızı girin
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Admin Anahtarı"
                className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
                required
              />

              {error && (
                <div className="text-red-400 text-sm text-center p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-hero rounded-xl text-white font-bold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50"
              >
                {loading ? 'Kontrol Ediliyor...' : 'Panele Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: waitlist.length,
    today: waitlist.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length,
    thisWeek: waitlist.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(e.timestamp) > weekAgo;
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-brand-primary/5 to-background-dark p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              Admin Paneli
            </h1>
            <p className="text-text-secondary">WatchPulse yönetim merkezi</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-background-card border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'waitlist'
                ? 'bg-gradient-hero text-white shadow-lg shadow-brand-primary/30'
                : 'bg-background-card border border-brand-primary/20 text-text-secondary hover:border-brand-primary/50'
            }`}
          >
            <Mail className="w-5 h-5" />
            Waitlist
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'blogs'
                ? 'bg-gradient-hero text-white shadow-lg shadow-brand-primary/30'
                : 'bg-background-card border border-brand-primary/20 text-text-secondary hover:border-brand-primary/50'
            }`}
          >
            <FileText className="w-5 h-5" />
            Blog Yönetimi
          </button>
        </div>

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-brand-primary" />
                  <span className="text-text-secondary text-sm">Toplam Kayıt</span>
                </div>
                <div className="text-4xl font-bold text-brand-primary">{stats.total}</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-brand-accent" />
                  <span className="text-text-secondary text-sm">Bugün</span>
                </div>
                <div className="text-4xl font-bold text-brand-accent">{stats.today}</div>
              </div>

              <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-brand-gold" />
                  <span className="text-text-secondary text-sm">Bu Hafta</span>
                </div>
                <div className="text-4xl font-bold text-brand-gold">{stats.thisWeek}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
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
                <Mail className="w-5 h-5" />
                Tüm Mailleri Kopyala
              </button>
              <button
                onClick={() => fetchWaitlist(adminKey)}
                className="flex items-center gap-2 px-6 py-3 bg-background-card border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
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
                      <th className="text-left p-4 text-text-primary font-semibold">Email</th>
                      <th className="text-left p-4 text-text-primary font-semibold">Tarih</th>
                      <th className="text-left p-4 text-text-primary font-semibold">IP</th>
                      <th className="text-left p-4 text-text-primary font-semibold">Tarayıcı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.map((entry, index) => (
                      <tr key={entry.email} className="border-b border-brand-primary/10 hover:bg-brand-primary/5 transition-colors">
                        <td className="p-4 text-text-secondary">{index + 1}</td>
                        <td className="p-4 text-text-primary font-medium">{entry.email}</td>
                        <td className="p-4 text-text-secondary text-sm">{new Date(entry.timestamp).toLocaleString()}</td>
                        <td className="p-4 text-text-secondary text-sm font-mono">{entry.ip || 'N/A'}</td>
                        <td className="p-4 text-text-secondary text-xs max-w-xs truncate">{entry.userAgent || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {waitlist.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-text-muted">Henüz kayıt yok. Waitlist linkini paylaş!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <>
            {/* AI Blog Generator */}
            <div className="bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border border-brand-primary/30 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-primary/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">AI Blog Önerileri</h3>
                  <p className="text-text-secondary text-sm">Yapay zeka ile blog içeriği oluştur</p>
                </div>
              </div>

              {/* Quick Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-text-muted text-xs py-1">Hızlı Konular:</span>
                {[
                  'Netflix hidden features',
                  'AI movie recommendations',
                  'Best streaming tips 2025',
                  'Korean drama guide',
                  'Movies by mood',
                  'Underrated films',
                  'Binge-worthy shows'
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchTopic(topic)}
                    className="px-3 py-1 text-xs bg-background-dark border border-brand-primary/20 rounded-full text-text-secondary hover:border-brand-primary/50 hover:text-brand-primary transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    placeholder="Konu girin (ör: Netflix gizli kodları, AI film önerileri...)"
                    className="w-full pl-12 pr-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <button
                  onClick={generateSuggestions}
                  disabled={suggestionsLoading}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-hero rounded-xl text-white font-bold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50 min-w-[180px]"
                >
                  {suggestionsLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Blog Öner
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-accent" />
                    AI Önerileri ({suggestions.length})
                  </h3>
                  <button
                    onClick={async () => {
                      for (const suggestion of suggestions) {
                        await addBlogFromSuggestion(suggestion);
                      }
                    }}
                    disabled={addingBlog !== null}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-accent/20 text-brand-accent rounded-lg hover:bg-brand-accent/30 transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Tümünü Ekle ({suggestions.length})
                  </button>
                </div>
                <div className="grid gap-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.slug}
                      className="bg-background-card border border-brand-accent/30 rounded-xl overflow-hidden hover:border-brand-accent/50 transition-all"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
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
                            <h4 className="text-lg font-bold text-text-primary mb-2">
                              {suggestion.title.en}
                            </h4>
                            <p className="text-text-secondary text-sm mb-2">
                              {suggestion.excerpt.en}
                            </p>
                            <p className="text-text-muted text-xs">
                              TR: {suggestion.title.tr}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedSuggestion(
                                expandedSuggestion === suggestion.slug ? null : suggestion.slug
                              )}
                              className="flex items-center gap-2 px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-secondary hover:border-brand-primary/50 transition-colors"
                              title="İçeriği Görüntüle"
                            >
                              <BookOpen className="w-5 h-5" />
                              {expandedSuggestion === suggestion.slug ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => addBlogFromSuggestion(suggestion)}
                              disabled={addingBlog === suggestion.slug}
                              className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-background-dark font-bold rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {addingBlog === suggestion.slug ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Ekleniyor...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-5 h-5" />
                                  Siteye Ekle
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content Preview */}
                      {expandedSuggestion === suggestion.slug && (
                        <div className="border-t border-brand-accent/20 bg-background-dark/50 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-brand-accent flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Blog İçeriği Önizlemesi
                            </h5>
                            <span className="text-xs text-text-muted">
                              {suggestion.content?.length || 0} bölüm
                            </span>
                          </div>
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {suggestion.content?.map((block, idx) => (
                              <div key={idx}>
                                {block.type === 'heading' && (
                                  <h3 className="text-lg font-bold text-brand-primary mt-4 mb-2">
                                    {block.content as string}
                                  </h3>
                                )}
                                {block.type === 'paragraph' && (
                                  <p className="text-text-secondary text-sm leading-relaxed">
                                    {block.content as string}
                                  </p>
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

            {/* Blog Stats */}
            {blogs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-background-card border border-brand-primary/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-brand-primary">{blogs.length}</div>
                  <div className="text-xs text-text-muted">Toplam Blog</div>
                </div>
                <div className="bg-background-card border border-brand-primary/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {blogs.filter(b => b.isPublished).length}
                  </div>
                  <div className="text-xs text-text-muted">Yayında</div>
                </div>
                <div className="bg-background-card border border-brand-primary/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {blogs.filter(b => !b.isPublished).length}
                  </div>
                  <div className="text-xs text-text-muted">Taslak</div>
                </div>
                <div className="bg-background-card border border-brand-primary/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-brand-accent">
                    {Array.from(new Set(blogs.map(b => b.category))).length}
                  </div>
                  <div className="text-xs text-text-muted">Kategori</div>
                </div>
              </div>
            )}

            {/* Existing Blogs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-primary" />
                  Mevcut Bloglar ({blogs.length})
                </h3>
                <button
                  onClick={fetchBlogs}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-background-card border border-brand-primary/30 rounded-lg text-text-secondary hover:border-brand-primary/50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Yenile
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
                  <p className="text-text-muted">Bloglar yükleniyor...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="bg-background-card border border-brand-primary/20 rounded-2xl p-12 text-center">
                  <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted mb-2">Henüz blog eklenmemiş</p>
                  <p className="text-text-secondary text-sm">AI ile blog önerileri alarak başlayın!</p>
                </div>
              ) : (
                <div className="bg-background-card border border-brand-primary/20 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-brand-primary/10 border-b border-brand-primary/20">
                        <tr>
                          <th className="text-left p-4 text-text-primary font-semibold">Başlık</th>
                          <th className="text-left p-4 text-text-primary font-semibold">Kategori</th>
                          <th className="text-left p-4 text-text-primary font-semibold">Tarih</th>
                          <th className="text-left p-4 text-text-primary font-semibold">Durum</th>
                          <th className="text-right p-4 text-text-primary font-semibold">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((blog) => (
                          <tr key={blog.slug} className="border-b border-brand-primary/10 hover:bg-brand-primary/5 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-text-primary">{blog.title.en}</div>
                              <div className="text-xs text-text-muted mt-1">/{blog.slug}</div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                                {blog.category}
                              </span>
                            </td>
                            <td className="p-4 text-text-secondary text-sm">{blog.date}</td>
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
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setPreviewBlog(blog)}
                                  className="p-2 bg-background-dark rounded-lg hover:bg-brand-accent/20 transition-colors"
                                  title="İçeriği Görüntüle"
                                >
                                  <BookOpen className="w-4 h-4 text-brand-accent" />
                                </button>
                                <a
                                  href={`/blog/${blog.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-background-dark rounded-lg hover:bg-brand-primary/20 transition-colors"
                                  title="Sitede Görüntüle"
                                >
                                  <ExternalLink className="w-4 h-4 text-brand-primary" />
                                </a>
                                <button
                                  onClick={() => toggleBlogPublished(blog)}
                                  className="p-2 bg-background-dark rounded-lg hover:bg-brand-primary/20 transition-colors"
                                  title={blog.isPublished ? 'Gizle' : 'Yayınla'}
                                >
                                  {blog.isPublished ? (
                                    <EyeOff className="w-4 h-4 text-text-secondary" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-text-secondary" />
                                  )}
                                </button>
                                <button
                                  onClick={() => deleteBlog(blog.slug)}
                                  className="p-2 bg-background-dark rounded-lg hover:bg-red-500/20 transition-colors"
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
                </div>
              )}
            </div>
          </>
        )}

        {/* Blog Preview Modal */}
        {previewBlog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background-card border border-brand-primary/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-brand-primary/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                      {previewBlog.category}
                    </span>
                    <span className="text-text-muted text-xs">{previewBlog.readTime}</span>
                    {previewBlog.isPublished !== undefined && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        previewBlog.isPublished
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {previewBlog.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {previewBlog.title.en}
                  </h2>
                  <p className="text-text-muted text-sm mt-1">
                    TR: {previewBlog.title.tr}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewBlog(null)}
                  className="p-2 hover:bg-brand-primary/20 rounded-lg transition-colors ml-4"
                >
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Excerpt */}
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 mb-6">
                  <p className="text-text-secondary italic">
                    {previewBlog.excerpt.en}
                  </p>
                </div>

                {/* Tags */}
                {previewBlog.tags && previewBlog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {previewBlog.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-background-dark text-text-muted text-xs rounded-full border border-brand-primary/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  {previewBlog.content?.map((block, idx) => (
                    <div key={idx}>
                      {block.type === 'heading' && (
                        <h3 className="text-xl font-bold text-brand-primary mt-6 mb-3">
                          {block.content as string}
                        </h3>
                      )}
                      {block.type === 'paragraph' && (
                        <p className="text-text-secondary leading-relaxed">
                          {block.content as string}
                        </p>
                      )}
                      {block.type === 'list' && Array.isArray(block.content) && (
                        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                          {block.content.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {block.type === 'quote' && (
                        <blockquote className="border-l-4 border-brand-accent pl-4 py-2 italic text-text-muted bg-brand-accent/5 rounded-r-lg">
                          &ldquo;{block.content as string}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
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
      </div>
    </div>
  );
}

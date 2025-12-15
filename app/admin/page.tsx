'use client';

import { useState, useEffect } from 'react';
import { Download, Trash2, Shield, Mail, Clock, Globe } from 'lucide-react';

interface WaitlistEntry {
  email: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if admin key is saved in localStorage
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchWaitlist(savedKey);
    }
  }, []);

  const fetchWaitlist = async (key: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
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
    } catch (err) {
      setError('Waitlist alınamadı');
    } finally {
      setLoading(false);
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
    alert('Tüm mailler kopyalandı!');
  };

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
              Waitlist'e erişmek için admin anahtarınızı girin
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Admin Anahtarı"
                  className="w-full px-4 py-3 bg-background-dark border border-brand-primary/30 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
                  required
                />
              </div>

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

            <div className="mt-6 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
              <p className="text-xs text-text-muted text-center">
                🔒 Admin key is stored in <code className="text-brand-accent">.env.local</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: waitlist.length,
    today: waitlist.filter(e =>
      new Date(e.timestamp).toDateString() === new Date().toDateString()
    ).length,
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
              Waitlist Paneli
            </h1>
            <p className="text-text-secondary">
              WatchPulse erken erişim listenizi yönetin
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-background-card border border-brand-primary/30 rounded-xl text-text-primary hover:border-brand-primary/50 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>

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
            🔄 Yenile
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
                  <tr
                    key={entry.email}
                    className="border-b border-brand-primary/10 hover:bg-brand-primary/5 transition-colors"
                  >
                    <td className="p-4 text-text-secondary">{index + 1}</td>
                    <td className="p-4 text-text-primary font-medium">{entry.email}</td>
                    <td className="p-4 text-text-secondary text-sm">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-text-secondary text-sm font-mono">
                      {entry.ip || 'N/A'}
                    </td>
                    <td className="p-4 text-text-secondary text-xs max-w-xs truncate">
                      {entry.userAgent || 'N/A'}
                    </td>
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
      </div>
    </div>
  );
}

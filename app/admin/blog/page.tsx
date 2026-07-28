'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';

/**
 * Monitoring view for the automated blog pipeline.
 *
 * Read-only on purpose: articles are written by the scheduler, so what the
 * operator needs here is confirmation that today's runs landed and a visible
 * reason when one did not.
 */

interface Run {
  at: string;
  ok: boolean;
  skipped: boolean;
  slug?: string;
  title?: string;
  format?: string;
  words?: number;
  writerModel?: string;
  reason?: string;
  durationMs: number;
}

interface Status {
  today: { published: number; failed: number; attempts: number; limit: number; onTrack: boolean };
  lastRun: Run | null;
  week: Array<{ date: string; published: number; failed: number }>;
  totalAutoPosts: number;
  failureReasons: Array<{ reason: string; count: number }>;
  recentRuns: Run[];
  latestPosts: Array<{ slug: string; title: { en: string }; category: string; createdAt: string; readTime: string }>;
}

const TOKEN_KEY = 'wp-access-token';

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function BlogAdminPage() {
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const load = useCallback(async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog-status', {
        headers: { Authorization: `Bearer ${authToken}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(res.status === 401 ? 'Unauthorized — this token is not an admin token.' : data.message || 'Failed to load');
        setStatus(null);
        return;
      }
      setStatus(data);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  if (!token) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-text-primary mb-2">Blog monitor</h1>
          <p className="text-sm text-text-muted mb-6">Paste an admin access token to continue.</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Access token"
            className="w-full px-4 py-3 rounded-lg bg-background-card border border-white/[0.08] text-text-primary text-sm outline-none focus:border-brand-primary/40"
          />
          <button
            onClick={() => {
              localStorage.setItem(TOKEN_KEY, tokenInput.trim());
              setToken(tokenInput.trim());
            }}
            disabled={!tokenInput.trim()}
            className="w-full mt-3 px-4 py-3 rounded-lg bg-brand-primary text-background-dark font-medium text-sm disabled:opacity-40"
          >
            Open monitor
          </button>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </main>
    );
  }

  const t = status?.today;
  const maxDay = Math.max(1, ...(status?.week || []).map((d) => d.published + d.failed));

  return (
    <main className="min-h-screen bg-background-dark px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Blog monitor</h1>
            <p className="text-sm text-text-muted mt-1">Automated publishing pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(token)}
              disabled={loading}
              className="p-2.5 rounded-lg bg-background-card border border-white/[0.08] text-text-secondary hover:text-text-primary disabled:opacity-40"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(TOKEN_KEY);
                setToken('');
              }}
              className="px-3 py-2.5 rounded-lg bg-background-card border border-white/[0.08] text-text-muted text-xs hover:text-text-primary"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error}</div>
        )}

        {status && t && (
          <>
            {/* Today */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Stat label="Published today" value={`${t.published}/${t.limit}`} tone={t.published >= t.limit ? 'good' : t.failed > 0 ? 'warn' : 'neutral'} />
              <Stat label="Failed today" value={String(t.failed)} tone={t.failed > 0 ? 'bad' : 'good'} />
              <Stat label="Total auto posts" value={String(status.totalAutoPosts)} tone="neutral" />
              <Stat
                label="Last run"
                value={status.lastRun ? timeAgo(status.lastRun.at) : '—'}
                tone={status.lastRun ? (status.lastRun.ok ? 'good' : 'bad') : 'neutral'}
              />
            </div>

            {/* Failure reasons — the thing you actually came here to see */}
            {status.failureReasons.length > 0 && (
              <div className="mb-6 p-5 rounded-xl bg-background-card border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-medium text-text-primary">Recent failures</h2>
                </div>
                <ul className="space-y-2">
                  {status.failureReasons.map((f) => (
                    <li key={f.reason} className="flex items-start gap-3 text-sm">
                      <span className="shrink-0 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-xs font-medium">
                        {f.count}×
                      </span>
                      <span className="text-text-secondary break-words">{f.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Last 7 days */}
            <div className="mb-6 p-5 rounded-xl bg-background-card border border-white/[0.06]">
              <h2 className="text-sm font-medium text-text-primary mb-4">Last 7 days</h2>
              <div className="flex items-end gap-2 h-24">
                {status.week.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex flex-col justify-end h-16 gap-0.5">
                      {d.failed > 0 && (
                        <div className="w-full bg-red-500/50 rounded-sm" style={{ height: `${(d.failed / maxDay) * 100}%` }} />
                      )}
                      <div
                        className="w-full bg-brand-primary/70 rounded-sm"
                        style={{ height: `${(d.published / maxDay) * 100}%`, minHeight: d.published ? 3 : 0 }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted">{d.date.slice(5)}</span>
                    <span className="text-[10px] text-text-secondary">{d.published}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Run log */}
            <div className="mb-6 rounded-xl bg-background-card border border-white/[0.06] overflow-hidden">
              <h2 className="text-sm font-medium text-text-primary px-5 pt-5 pb-3">Run log</h2>
              {status.recentRuns.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-text-muted">No runs recorded yet.</p>
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {status.recentRuns.map((r, i) => (
                    <li key={`${r.at}-${i}`} className="px-5 py-3 flex items-start gap-3">
                      {r.skipped ? (
                        <Clock className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                      ) : r.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text-primary truncate">
                          {r.ok && !r.skipped ? r.title || r.slug : r.reason || 'Skipped'}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {clock(r.at)} · {timeAgo(r.at)}
                          {r.format && ` · ${r.format}`}
                          {r.words ? ` · ${r.words} words` : ''}
                          {r.durationMs ? ` · ${(r.durationMs / 1000).toFixed(1)}s` : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Latest published */}
            <div className="rounded-xl bg-background-card border border-white/[0.06] overflow-hidden">
              <h2 className="text-sm font-medium text-text-primary px-5 pt-5 pb-3">Latest published</h2>
              {status.latestPosts.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-text-muted">Nothing published yet.</p>
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {status.latestPosts.map((p) => (
                    <li key={p.slug} className="px-5 py-3">
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="group">
                        <p className="text-sm text-text-primary group-hover:text-brand-primary transition-colors truncate">
                          {p.title?.en || p.slug}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {p.category} · {p.readTime} · {timeAgo(p.createdAt)}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {!status && !error && loading && <p className="text-sm text-text-muted">Loading…</p>}
      </div>
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'good' | 'bad' | 'warn' | 'neutral' }) {
  const color =
    tone === 'good' ? 'text-emerald-400' : tone === 'bad' ? 'text-red-400' : tone === 'warn' ? 'text-amber-400' : 'text-text-primary';
  return (
    <div className="p-4 rounded-xl bg-background-card border border-white/[0.06]">
      <p className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

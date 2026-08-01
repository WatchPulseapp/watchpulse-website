'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PostData {
  _id: string;
  movieTitle: string;
  content: string;
  likeCount: number;
  commentCount: number;
  userId?: { displayName?: string; username?: string };
}

export default function PostPage() {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    fetchPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://watchpulse.info';
      // The id is whatever the address bar says. Unencoded, "..%2F..%2Fusers"
      // arrives here as "../../users" and the browser resolves it away before
      // sending, so the link author picks the endpoint rather than this line.
      const res = await fetch(`${apiUrl}/api/posts/${encodeURIComponent(postId)}`);
      const data = await res.json();
      if (data.success && data.data?.post) {
        setPost(data.data.post);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const openInApp = () => {
    // An intent URL is a semicolon-separated list of fields, so an id carrying
    // ";S.browser_fallback_url=..." would append its own — a link that opens
    // somewhere else entirely. Ids are hex object ids; anything else never
    // reaches a URL.
    const safeId = encodeURIComponent(postId);
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      // Android intent URL: tries app first, falls back to Play Store
      window.location.href = `intent://post/${safeId}#Intent;scheme=watchpulse;package=com.watchpulse.app;S.browser_fallback_url=${encodeURIComponent(storeUrl)};end`;
    } else {
      // iOS: try custom scheme, fallback handled by timeout
      window.location.href = `watchpulse://post/${safeId}`;
      setTimeout(() => {
        // If still on page after 1.5s, app not installed → go to store
        if (!document.hidden) window.location.href = storeUrl;
      }, 1500);
    }
  };

  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const storeUrl = isIOS
    ? 'https://apps.apple.com/app/id6759836378'
    : 'https://play.google.com/store/apps/details?id=com.watchpulse.app';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">

        {/* Logo */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>WatchPulse</h2>
        </div>

        {/* Post preview — minimal */}
        {post && (
          <div className="mb-10 text-left bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
            <p className="text-[13px] text-white/40 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {post.userId?.username || post.userId?.displayName || 'Kullanıcı'}
            </p>
            <p className="text-[15px] font-semibold text-white/90 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {post.movieTitle}
            </p>
            <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {post.content}
            </p>
          </div>
        )}

        {!post && (
          <div className="mb-10">
            <p className="text-white/30 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Bu gönderi artık mevcut değil
            </p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={openInApp}
          className="w-full py-3.5 bg-white text-black rounded-full font-semibold text-[15px] mb-3 hover:bg-white/90 transition-colors active:scale-[0.98]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Uygulamada Aç
        </button>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 text-white/50 text-[13px] hover:text-white/70 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Uygulamayı İndir
        </a>

      </div>
    </div>
  );
}

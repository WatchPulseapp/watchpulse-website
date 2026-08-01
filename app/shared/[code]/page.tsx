'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, FolderOpen, Smartphone, Info, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiGetSharedCollection, apiImportCollection, posterUrl, getAccessToken, type CollectionDetail } from '@/lib/api';
import Header from '@/components/layout/Header';
import StoreLink from '@/components/ui/StoreLink';

interface Movie {
    id: number;
    title: string;
    name: string;
    poster_path: string | null;
    media_type: string;
}

export default function SharedCollectionPage() {
    const params = useParams();
    const code = params?.code as string;
    const { language } = useLanguage();
    const [collection, setCollection] = useState<CollectionDetail | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [importing, setImporting] = useState(false);
    const [imported, setImported] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const isLoggedIn = typeof window !== 'undefined' && !!getAccessToken();

    useEffect(() => {
        if (!code) return;
        (async () => {
            try {
                const data = await apiGetSharedCollection(code);
                if (data.success && data.collection) {
                    setCollection(data.collection);
                    setIsOwner(!!(data.collection as CollectionDetail & { isOwner?: boolean }).isOwner);
                    setMovies((data.collection.movies || []).map((m: Record<string, unknown>) => ({
                        id: m.movieId as number,
                        title: (m.title as string) || '',
                        name: (m.title as string) || '',
                        poster_path: (m.posterPath as string) || null,
                        media_type: (m.mediaType as string) || 'movie',
                    })));
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
            setIsLoading(false);
        })();
    }, [code]);

    const handleImport = async () => {
        if (!isLoggedIn) return;
        setImporting(true);
        try {
            await apiImportCollection(code);
            setImported(true);
        } catch { /* */ }
        setImporting(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-dark">
                <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !collection) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-bg-dark pt-20 pb-24 flex items-center justify-center">
                    <div className="text-center px-4 max-w-md">
                        <FolderOpen className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
                        <h2 className="text-xl font-heading font-bold text-white mb-2">
                            {language === 'tr' ? 'Koleksiyon Bulunamadı' : 'Collection Not Found'}
                        </h2>
                        <p className="text-text-secondary text-sm mb-6">
                            {language === 'tr'
                                ? 'Bu koleksiyon silinmiş veya paylaşımdan kaldırılmış olabilir.'
                                : 'This collection may have been deleted or unshared.'}
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                            <Smartphone className="w-8 h-8 text-brand-primary mx-auto mb-3" />
                            <p className="text-white text-sm font-medium mb-1">WatchPulse</p>
                            <p className="text-text-muted text-xs mb-4">
                                {language === 'tr' ? 'Koleksiyonları keşfet, film ve dizi takibi yap' : 'Discover collections, track movies & TV shows'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                {/* These were hard-coded, and the App Store one
                                    pointed at /app/watchpulse — a path Apple has
                                    never served. Someone whose friend sent them a
                                    collection is the most likely visitor on the
                                    site to install, and half of them met a 404. */}
                                <StoreLink store="play" source="shared-collection" className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors">Google Play</StoreLink>
                                <StoreLink store="appstore" source="shared-collection" className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors">App Store</StoreLink>
                            </div>
                        </div>
                        <Link href="/" className="inline-block px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 bg-gradient-primary">
                            {language === 'tr' ? 'Ana Sayfaya Dön' : 'Go to Home'}
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-bg-dark pt-20 pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                        <p className="text-brand-primary text-xs font-semibold uppercase tracking-wider mb-3">
                            {language === 'tr' ? 'Paylaşılan Koleksiyon' : 'Shared Collection'}
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">{collection.name}</h1>
                        {collection.creatorName && (
                            <p className="text-text-muted text-sm mb-2">@{collection.creatorName}</p>
                        )}
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm text-white font-medium">
                            {movies.length} {language === 'tr' ? 'içerik' : 'items'}
                        </span>
                        {collection.description && (
                            <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto">{collection.description}</p>
                        )}
                    </motion.div>

                    {/* Action */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-4 mb-8">
                        {isOwner ? (
                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium">
                                <Info className="w-4 h-4 shrink-0" />
                                {language === 'tr' ? 'Bu sizin koleksiyonunuz' : 'This is your own collection'}
                            </div>
                        ) : imported ? (
                            <div className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                <CheckCircle className="w-4 h-4" />
                                {language === 'tr' ? 'Koleksiyon kütüphanene eklendi!' : 'Collection added to your library!'}
                            </div>
                        ) : isLoggedIn ? (
                            <button onClick={handleImport} disabled={importing} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 bg-gradient-primary">
                                <Download className="w-4 h-4" />
                                {importing ? (language === 'tr' ? 'İçe aktarılıyor...' : 'Importing...') : (language === 'tr' ? 'Koleksiyonu İçe Aktar' : 'Import Collection')}
                            </button>
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href={`/login?redirect=/shared/${code}`} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 bg-gradient-primary">
                                        {language === 'tr' ? 'Giriş Yap ve İçe Aktar' : 'Login & Import'}
                                    </Link>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-text-muted text-xs">
                                    <Smartphone className="w-4 h-4 text-brand-primary shrink-0" />
                                    <span>
                                        {language === 'tr' ? 'Daha iyi deneyim için ' : 'For a better experience, '}
                                        <StoreLink store="play" source="shared-collection" className="text-brand-primary hover:underline">
                                            {language === 'tr' ? 'uygulamayı indir' : 'download the app'}
                                        </StoreLink>
                                    </span>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Grid */}
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {movies.map((movie, i) => (
                                <motion.div key={`${movie.id}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }}>
                                    <Link href={movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="group block">
                                        <div className="rounded-xl overflow-hidden bg-bg-card border border-white/5 hover:border-brand-primary/20 transition-all">
                                            <div className="relative aspect-[2/3]">
                                                {movie.poster_path ? (
                                                    <Image src={posterUrl(movie.poster_path)} alt={movie.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" sizes="200px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <FolderOpen className="w-8 h-8 text-text-muted/40" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
                                                    <span className="text-[10px] font-semibold text-white uppercase">
                                                        {movie.media_type === 'tv' ? (language === 'tr' ? 'Dizi' : 'TV') : (language === 'tr' ? 'Film' : 'Movie')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <p className="text-white text-sm font-medium line-clamp-2">{movie.title || movie.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-text-secondary">{language === 'tr' ? 'Bu koleksiyon henüz boş' : 'This collection is empty'}</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

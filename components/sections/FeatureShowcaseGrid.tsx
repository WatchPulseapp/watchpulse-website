'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface Feature {
    id: string;
    image: string;
    titleTR: string;
    titleEN: string;
    descTR: string;
    descEN: string;
}

// CORRECT mapping: image filename → actual screenshot content
// moodpulse.jpg = Ruh hali seçimi (İzlerken ne hissetmek istersin?)
// recommend.jpg = Öner dialogu (Kim için önereyim?)
// tracking.jpg = Sana Özel sayfası (Haftalık/Anlık öneriler)
// recommend-options.jpg = Hafta Sonu Düellosu (VS)
// duel.jpg = Takip sayfası (Yaklaşan/Bölümler/Trend)
// personalized.jpg = Nerede Ne Var sayfası (Netflix, Disney+ vb.)
// detail.jpg = İçerik Detayı (Breaking Bad sezon/bölüm takibi)
// platforms.jpg = İçerik Detayı popup (Breaking Bad - İzleme Platformları)
// daily-pick.jpg = Bugünün Seçimi (The Dark Knight / Stranger Things)
// minipulse.jpg = MiniPulse (Hızlıca bitirilebilecek kısa diziler)
// collections.jpg = Koleksiyonlar ana sayfası (Marvel Evreni, DC Comics)
// discover.jpg = Koleksiyon detayı (Horror koleksiyonu)
// favorite-actors.jpg = Favori Oyuncular

const FEATURES: Feature[] = [
    {
        id: 'moodpulse',
        image: 'moodpulse.jpg',
        titleTR: 'Ruh Hali',
        titleEN: 'Mood',
        descTR: 'Ruh haline göre film ve dizi önerisi al. Yorgun, mutlu, hüzünlü, heyecanlı gibi 10 farklı ruh halinden birini seç — sana o ana uygun en iyi içerikler önerilsin.',
        descEN: 'Get movie and TV show recommendations based on your mood. Choose from 10 different moods like tired, happy, sad, or excited — the best content matching your mood will be suggested.',
    },
    {
        id: 'recommend',
        image: 'recommend.jpg',
        titleTR: 'Öner',
        titleEN: 'Recommend',
        descTR: 'Kiminle izleyeceğini seç: sevgilinle, tek başına, ailenle ya da arkadaşlarınla. WatchPulse izleme ortamına göre sana en uygun filmleri ve dizileri önersin.',
        descEN: 'Choose who you\'re watching with: partner, alone, family, or friends. WatchPulse recommends the best movies and shows based on your watching context.',
    },
    {
        id: 'personalized',
        image: 'tracking.jpg',
        titleTR: 'Sana Özel',
        titleEN: 'Personalized For You',
        descTR: 'Haftalık ve anlık olmak üzere iki modda kişiselleştirilmiş film ve dizi önerileri al. Beğenilerine göre önerilen içerikleri beğen ya da beğenme — sistem seni her geçen gün daha iyi tanısın.',
        descEN: 'Get personalized movie and TV show recommendations in two modes: weekly and instant. Like or dislike suggested content — the system learns your taste better every day.',
    },
    {
        id: 'duel',
        image: 'recommend-options.jpg',
        titleTR: 'Düello',
        titleEN: 'Duel',
        descTR: 'Hafta sonu düellosuna katıl! İki film ya da dizi karşı karşıya geliyor — hangisinin daha iyi olduğuna oy ver. Geri sayım sayacıyla heyecanı yaşa ve toplulukla birlikte karar ver.',
        descEN: 'Join the weekend duel! Two movies or shows face off — vote for which one is better. Experience the excitement with a countdown timer and decide together with the community.',
    },
    {
        id: 'tracking',
        image: 'duel.jpg',
        titleTR: 'Takip',
        titleEN: 'Tracking',
        descTR: 'Yaklaşan filmler ve yeni bölümleri takip et. Favori içeriklerini arayarak bul, yaklaşan içerikleri, son bölümleri ve trend olanları ayrı sekmelerde görüntüle.',
        descEN: 'Track upcoming movies and new episodes. Search for your favorites, and view upcoming releases, latest episodes, and trending content in separate tabs.',
    },
    {
        id: 'platforms',
        image: 'personalized.jpg',
        titleTR: 'Nerede Ne Var?',
        titleEN: 'Where to Watch?',
        descTR: 'Netflix, Prime Video, Disney+, Apple TV+, Max, Paramount+, Hulu ve Crunchyroll — tüm platformların orijinal içeriklerini tek bir yerden keşfet. Ülkene göre filtreleme yap.',
        descEN: 'Netflix, Prime Video, Disney+, Apple TV+, Max, Paramount+, Hulu, and Crunchyroll — discover original content from all platforms in one place. Filter by your country.',
    },
    {
        id: 'detail',
        image: 'detail.jpg',
        titleTR: 'İçerik Detayı',
        titleEN: 'Content Details',
        descTR: 'Her film ve dizinin detay sayfasında puan, yıl, sezon bilgisi ve bölüm listesi bulunur. İzlediğin bölümleri işaretle, izleme ilerlemeni takip et, tümünü izle veya sıfırla.',
        descEN: 'Every movie and show\'s detail page features rating, year, season info, and episode list. Mark watched episodes, track your progress, watch all, or reset.',
    },
    {
        id: 'daily-pick',
        image: 'daily-pick.jpg',
        titleTR: 'Bugünün Seçimi',
        titleEN: 'Daily Pick',
        descTR: 'Her gün senin için özenle seçilmiş bir film ve bir dizi önerisi. Bugünün Seçimi ile yeni içerikler keşfet — puan, yıl ve açıklama bilgileriyle birlikte.',
        descEN: 'A carefully selected movie and TV show recommendation just for you, every day. Discover new content with Daily Pick — complete with rating, year, and description.',
    },
    {
        id: 'minipulse',
        image: 'minipulse.jpg',
        titleTR: 'MiniPulse',
        titleEN: 'MiniPulse',
        descTR: 'Zamanın kısıtlı mı? MiniPulse ile hızlıca bitirilebilecek kısa dizileri keşfet. Bölüm sayısı, süre ve toplam izleme süresini gör — kısa ama etkili diziler seni bekliyor.',
        descEN: 'Short on time? Discover quick-to-finish short series with MiniPulse. See episode count, duration, and total watch time — short but impactful shows await.',
    },
    {
        id: 'collections',
        image: 'collections.jpg',
        titleTR: 'Koleksiyonlar',
        titleEN: 'Collections',
        descTR: 'Kendi film ve dizi koleksiyonlarını oluştur veya topluluk tarafından oluşturulan küratörlü koleksiyonları keşfet. Marvel Evreni, DC Comics gibi kategorilerde içerikleri incele ve kaydet.',
        descEN: 'Create your own movie and TV show collections or discover community-curated collections. Browse and save content in categories like Marvel Universe and DC Comics.',
    },
    {
        id: 'discover',
        image: 'discover.jpg',
        titleTR: 'Keşfet',
        titleEN: 'Discover',
        descTR: 'Koleksiyon detaylarına gir, içindeki film ve dizileri gör. Koleksiyonları paylaş, dünyayı keşfet ve koleksiyonları kaydet.',
        descEN: 'Dive into collection details, see the movies and shows inside. Share collections, explore the world, and save collections.',
    },
    {
        id: 'favorite-actors',
        image: 'favorite-actors.jpg',
        titleTR: 'Favori Oyuncular',
        titleEN: 'Favorite Actors',
        descTR: 'Sevdiğin oyuncuları favorilerine ekle ve yeni projelerinden haberdar ol. Oyuncu arama yaparak kolayca bul ve listene ekle.',
        descEN: 'Add your favorite actors and stay updated on their new projects. Easily find actors with search and add them to your list.',
    },
];

export default function FeatureShowcaseGrid() {
    const { language } = useLanguage();
    const lang = language === 'tr' ? 'tr' : 'en';

    // Split features into rows of 3
    const rows: Feature[][] = [];
    for (let i = 0; i < FEATURES.length; i += 3) {
        rows.push(FEATURES.slice(i, i + 3));
    }

    return (
        <section id="features" className="relative py-24 md:py-32 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-6">
                        ✨ {lang === 'tr' ? 'ÖZELLİKLER' : 'FEATURES'}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        {lang === 'tr' ? 'Her Özellik, ' : 'Every Feature, '}
                        <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                            {lang === 'tr' ? 'Mükemmel Deneyim' : 'Perfect Experience'}
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
                        {lang === 'tr'
                            ? 'WatchPulse ile film ve dizi keşfetmek hiç bu kadar keyifli olmamıştı. İşte seni bekleyen güçlü özellikler.'
                            : 'Discovering movies and TV shows has never been this enjoyable with WatchPulse. Here are the powerful features waiting for you.'}
                    </p>
                </motion.div>

                {/* Feature Rows */}
                <div className="space-y-24 md:space-y-32">
                    {rows.map((row, rowIndex) => (
                        <motion.div
                            key={rowIndex}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                        >
                            {row.map((feature, featureIndex) => (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: featureIndex * 0.15 }}
                                    className="group flex flex-col items-center text-center"
                                >
                                    {/* Phone Mockup — edge-to-edge, no black bars */}
                                    <div className="relative mb-8 w-full max-w-[260px] mx-auto">
                                        {/* Glow effect */}
                                        <div className="absolute -inset-4 bg-gradient-to-b from-brand-primary/20 via-brand-primary/5 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Phone frame — thin bezel, screenshot fills the entire screen */}
                                        <div className="relative rounded-[2rem] p-[3px] shadow-2xl shadow-black/50 group-hover:shadow-brand-primary/20 transition-shadow duration-500"
                                            style={{ background: 'linear-gradient(180deg, #555 0%, #333 50%, #555 100%)' }}
                                        >
                                            <div className="relative aspect-[9/19.5] rounded-[1.85rem] overflow-hidden">
                                                <Image
                                                    src={`/images/screenshots/${lang}/${feature.image}`}
                                                    alt={lang === 'tr' ? feature.titleTR : feature.titleEN}
                                                    fill
                                                    className="object-cover"
                                                    sizes="260px"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Info */}
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors duration-300">
                                        {lang === 'tr' ? feature.titleTR : feature.titleEN}
                                    </h3>
                                    <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-[300px]">
                                        {lang === 'tr' ? feature.descTR : feature.descEN}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

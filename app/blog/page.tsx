'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import WaitlistCTA from '@/components/ui/WaitlistCTA';
import { Mail, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

const blogPosts = [
  {
    slug: 'best-ai-movie-apps-2025',
    title: {
      en: 'Best AI Movie Recommendation Apps in 2025',
      tr: '2025\'in En İyi AI Film Öneri Uygulamaları'
    },
    excerpt: {
      en: 'Discover the top AI-powered apps that help you find your next favorite movie based on your mood and preferences.',
      tr: 'Ruh halinize ve tercihlerinize göre bir sonraki favori filminizi bulmanıza yardımcı olan en iyi AI destekli uygulamaları keşfedin.'
    },
    date: 'January 15, 2025',
    readTime: '15 min read',
    category: 'Technology',
  },
  {
    slug: 'why-netflix-recommendations-suck',
    title: {
      en: 'Why Netflix Recommendations Suck (And What to Use Instead)',
      tr: 'Netflix Önerileri Neden Kötü (Bunun Yerine Ne Kullanmalı)'
    },
    excerpt: {
      en: 'Tired of Netflix showing you the same garbage? Here\'s why their algorithm fails and what actually works.',
      tr: 'Netflix\'in sürekli aynı şeyleri göstermesinden bıktınız mı? Algoritmalarının neden başarısız olduğunu ve gerçekten işe yarayan alternatifleri öğrenin.'
    },
    date: 'January 14, 2025',
    readTime: '14 min read',
    category: 'Streaming',
  },
  {
    slug: 'hidden-netflix-codes-unlock-categories',
    title: {
      en: '50+ Hidden Netflix Codes That Unlock Secret Movie Categories',
      tr: 'Gizli Film Kategorilerini Açan 50+ Netflix Kodu'
    },
    excerpt: {
      en: 'Stop scrolling endlessly. Use these secret Netflix codes to access thousands of hidden categories.',
      tr: 'Sonsuz kaydırmaya son verin. Bu gizli Netflix kodlarıyla binlerce gizli kategoriye erişin.'
    },
    date: 'January 13, 2025',
    readTime: '6 min read',
    category: 'Streaming',
  },
  {
    slug: 'stop-wasting-time-scrolling',
    title: {
      en: 'Stop Wasting 30 Minutes Scrolling: AI Picks in 10 Seconds',
      tr: '30 Dakika Kaydırmaya Son: AI 10 Saniyede Seçiyor'
    },
    excerpt: {
      en: 'The average person spends 30 minutes deciding what to watch. AI does it in seconds. Here\'s how.',
      tr: 'Ortalama bir kişi ne izleyeceğine karar vermek için 30 dakika harcıyor. AI bunu saniyeler içinde yapıyor. İşte nasıl.'
    },
    date: 'January 13, 2025',
    readTime: '10 min read',
    category: 'AI & Technology',
  },
  {
    slug: 'movies-to-watch-when-sad',
    title: {
      en: 'Top 15 Movies to Watch When You\'re Feeling Down',
      tr: 'Üzgün Hissettiğinizde İzlenecek En İyi 15 Film'
    },
    excerpt: {
      en: 'Feeling blue? These heartwarming and uplifting films are scientifically proven to boost your mood and spirits.',
      tr: 'Moral bozukluğu mu? Bu içten ve moral yükseltici filmler, ruh halinizi iyileştirdiği bilimsel olarak kanıtlanmış.'
    },
    date: 'January 12, 2025',
    readTime: '12 min read',
    category: 'Mood Guide',
  },
  {
    slug: 'psychology-movie-addiction',
    title: {
      en: 'The Psychology Behind Movie Addiction: Why You Can\'t Stop',
      tr: 'Film Bağımlılığının Psikolojisi: Neden Duramazsınız'
    },
    excerpt: {
      en: 'Can\'t stop binge-watching? Science explains why your brain is wired to crave "just one more episode."',
      tr: 'Maraton izlemeyi bırakamıyor musunuz? Bilim, beyninizin neden "bir bölüm daha" arzuladığını açıklıyor.'
    },
    date: 'January 12, 2025',
    readTime: '9 min read',
    category: 'Psychology',
  },
  {
    slug: 'movies-that-make-you-cry-science',
    title: {
      en: 'Movies That Will Make You Cry (According to Science)',
      tr: 'Sizi Ağlatacak Filmler (Bilime Göre)'
    },
    excerpt: {
      en: 'Neuroscientists ranked the most emotionally devastating films. Grab your tissues for these tearjerkers.',
      tr: 'Nörobilimciler en duygusal filmleri sıraladı. Bu gözyaşı döktürücüler için mendillerinizi hazırlayın.'
    },
    date: 'January 11, 2025',
    readTime: '8 min read',
    category: 'Mood Guide',
  },
  {
    slug: 'best-feel-good-movies',
    title: {
      en: '20 Best Feel-Good Movies to Instantly Boost Your Mood',
      tr: 'Ruh Halinizi Anında Yükseltecek En İyi 20 Film'
    },
    excerpt: {
      en: 'Already in a good mood? Keep the vibes high with these cheerful, entertaining films guaranteed to make you smile.',
      tr: 'Zaten iyi ruh halinde misiniz? Bu neşeli ve eğlenceli filmlerle moralinizi daha da yükseltin.'
    },
    date: 'January 11, 2025',
    readTime: '10 min read',
    category: 'Mood Guide',
  },
  {
    slug: 'best-horror-movies-netflix-unknown',
    title: {
      en: 'Best Horror Movies on Netflix You\'ve Never Heard Of',
      tr: 'Netflix\'te Hiç Duymadığınız En İyi Korku Filmleri'
    },
    excerpt: {
      en: 'Forget Scream and Friday the 13th. These terrifying hidden gems will actually scare you.',
      tr: 'Scream ve Cuma 13\'ü unutun. Bu korkunç gizli hazineler sizi gerçekten korkutacak.'
    },
    date: 'January 10, 2025',
    readTime: '7 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'netflix-hidden-gems-2025',
    title: {
      en: 'Netflix Hidden Gems You Probably Haven\'t Watched (2025)',
      tr: 'Netflix\'te Muhtemelen İzlemediğiniz Gizli Hazineler (2025)'
    },
    excerpt: {
      en: 'Tired of the same recommendations? Discover underrated masterpieces hiding in Netflix\'s vast library.',
      tr: 'Aynı önerilerden sıkıldınız mı? Netflix\'in geniş kütüphanesinde saklanan değeri bilinmeyen başyapıtları keşfedin.'
    },
    date: 'January 10, 2025',
    readTime: '11 min read',
    category: 'Streaming',
  },
  {
    slug: 'date-night-movies-never-watch',
    title: {
      en: 'Date Night Disasters: 10 Movies You Should NEVER Watch Together',
      tr: 'Randevu Gecesi Felaketleri: Asla Birlikte İzlenmemesi Gereken 10 Film'
    },
    excerpt: {
      en: 'Some movies kill the romance. Avoid these relationship-destroying films on your next date night.',
      tr: 'Bazı filmler romantizmi öldürür. Bir sonraki randevu gecenizde bu ilişki yıkıcı filmlerden kaçının.'
    },
    date: 'January 9, 2025',
    readTime: '6 min read',
    category: 'Entertainment',
  },
  {
    slug: 'date-night-movie-ideas',
    title: {
      en: 'Perfect Date Night Movies for Every Type of Couple',
      tr: 'Her Çift Türü İçin Mükemmel Randevu Gecesi Filmleri'
    },
    excerpt: {
      en: 'From romantic comedies to thrilling adventures - find the ideal movie for your next date night.',
      tr: 'Romantik komedilerden heyecan verici maceralara - bir sonraki randevu geceniz için ideal filmi bulun.'
    },
    date: 'January 9, 2025',
    readTime: '8 min read',
    category: 'Entertainment',
  },
  {
    slug: 'tiktok-changing-movie-discovery',
    title: {
      en: 'How TikTok is Completely Changing Movie Discovery',
      tr: 'TikTok Film Keşfini Nasıl Tamamen Değiştiriyor'
    },
    excerpt: {
      en: 'BookTok made reading cool again. Now MovieTok is revolutionizing how Gen Z discovers films.',
      tr: 'BookTok okumayı yeniden havalı yaptı. Şimdi MovieTok, Z kuşağının film keşfetme şeklini devrimleştiriyor.'
    },
    date: 'January 8, 2025',
    readTime: '7 min read',
    category: 'Trends',
  },
  {
    slug: 'best-binge-worthy-shows-2025',
    title: {
      en: 'Most Binge-Worthy TV Shows of 2025 (You Can\'t Stop Watching)',
      tr: '2025\'in En Bağımlılık Yapıcı Dizileri (İzlemeyi Bırakamayacaksınız)'
    },
    excerpt: {
      en: 'Can\'t stop watching? These addictive series will consume your entire weekend and you won\'t regret it.',
      tr: 'İzlemeyi bırakamıyor musunuz? Bu bağımlılık yapıcı diziler tüm hafta sonunuzu alacak ve pişman olmayacaksınız.'
    },
    date: 'January 8, 2025',
    readTime: '10 min read',
    category: 'TV Shows',
  },
  {
    slug: 'korean-drama-obsession-explained',
    title: {
      en: 'Why Everyone is Obsessed with Korean Dramas Right Now',
      tr: 'Herkes Neden Şu Anda Kore Dizilerine Takıntılı'
    },
    excerpt: {
      en: 'K-dramas are taking over Netflix. Here\'s the psychology behind why you can\'t stop watching them.',
      tr: 'K-diziler Netflix\'i ele geçiriyor. Onları izlemeyi neden bırakamadığınızın psikolojisi burada.'
    },
    date: 'January 7, 2025',
    readTime: '8 min read',
    category: 'Trends',
  },
  {
    slug: 'how-ai-recommends-movies',
    title: {
      en: 'How AI Recommends Movies Based on Your Mood (Full Breakdown)',
      tr: 'AI Ruh Halinize Göre Nasıl Film Önerir (Tam Analiz)'
    },
    excerpt: {
      en: 'Learn how artificial intelligence analyzes your emotions and preferences to suggest the perfect movie for any moment.',
      tr: 'Yapay zekanın duygularınızı ve tercihlerinizi analiz ederek her an için mükemmel filmi nasıl önerdiğini öğrenin.'
    },
    date: 'January 12, 2025',
    readTime: '18 min read',
    category: 'AI & Technology',
  },
  {
    slug: 'dark-side-recommendation-algorithms',
    title: {
      en: 'The Dark Side of Movie Recommendation Algorithms',
      tr: 'Film Öneri Algoritmalarının Karanlık Yüzü'
    },
    excerpt: {
      en: 'Netflix and YouTube algorithms are manipulating what you watch. Here\'s how they control your viewing habits.',
      tr: 'Netflix ve YouTube algoritmaları ne izlediğinizi manipüle ediyor. İzleme alışkanlıklarınızı nasıl kontrol ettiklerini öğrenin.'
    },
    date: 'January 6, 2025',
    readTime: '9 min read',
    category: 'AI & Technology',
  },
  {
    slug: 'ai-vs-human-recommendations',
    title: {
      en: 'AI vs Human: Who Actually Gives Better Movie Recommendations?',
      tr: 'AI vs İnsan: Kim Gerçekten Daha İyi Film Önerisi Veriyor?'
    },
    excerpt: {
      en: 'The ultimate showdown between artificial intelligence and your movie-buff friend. The results will surprise you.',
      tr: 'Yapay zeka ile film tutkunu arkadaşınız arasındaki nihai karşılaşma. Sonuçlar sizi şaşırtacak.'
    },
    date: 'January 6, 2025',
    readTime: '7 min read',
    category: 'AI & Technology',
  },
  {
    slug: 'worst-movies-high-ratings',
    title: {
      en: 'Overrated Movies Everyone Loves (But Secretly Suck)',
      tr: 'Herkesin Sevdiği Aşırı Değerli Filmler (Ama Gizlice Kötü)'
    },
    excerpt: {
      en: 'These critically acclaimed films have high ratings but are actually boring as hell. Change our mind.',
      tr: 'Bu eleştirmenlerin beğendiği filmler yüksek puanlara sahip ama aslında son derece sıkıcı. Fikrimizi değiştirin.'
    },
    date: 'January 5, 2025',
    readTime: '6 min read',
    category: 'Entertainment',
  },
  {
    slug: 'psychology-of-movie-recommendations',
    title: {
      en: 'The Psychology Behind Why We Love Certain Movies',
      tr: 'Belirli Filmleri Neden Sevdiğimizin Psikolojisi'
    },
    excerpt: {
      en: 'Ever wondered why some movies resonate deeply while others don\'t? Neuroscience has the answer.',
      tr: 'Bazı filmlerin neden derinden etkilediğini hiç merak ettiniz mi? Nörobilim cevabı biliyor.'
    },
    date: 'January 5, 2025',
    readTime: '10 min read',
    category: 'Psychology',
  },
  {
    slug: 'best-scifi-movies-all-time',
    title: {
      en: 'Top 25 Best Sci-Fi Movies of All Time (Ranked)',
      tr: 'Tüm Zamanların En İyi 25 Bilim Kurgu Filmi (Sıralı)'
    },
    excerpt: {
      en: 'From Blade Runner to Interstellar - explore the greatest science fiction films ever made, ranked by fans.',
      tr: 'Blade Runner\'dan Interstellar\'a - hayranlar tarafından sıralanan, şimdiye kadar yapılmış en iyi bilim kurgu filmlerini keşfedin.'
    },
    date: 'January 4, 2025',
    readTime: '12 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'movies-changed-cinema-forever',
    title: {
      en: '15 Movies That Changed Cinema Forever (And Why)',
      tr: 'Sinemayı Sonsuza Dek Değiştiren 15 Film (Ve Nedenleri)'
    },
    excerpt: {
      en: 'These groundbreaking films revolutionized filmmaking. Cinema was never the same after these masterpieces.',
      tr: 'Bu çığır açan filmler sinemacılığı devrimleştirdi. Bu başyapıtlardan sonra sinema asla eskisi gibi olmadı.'
    },
    date: 'January 4, 2025',
    readTime: '11 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'netflix-alternatives-2024',
    title: {
      en: 'Top 10 Netflix Alternatives for Movie Discovery in 2024',
      tr: '2024\'te Film Keşfi İçin En İyi 10 Netflix Alternatifi'
    },
    excerpt: {
      en: 'Tired of endless scrolling? These innovative apps make finding great movies 10x easier than Netflix.',
      tr: 'Sonsuz kaydırmadan bıktınız mı? Bu yenilikçi uygulamalar harika filmler bulmayı Netflix\'ten 10 kat daha kolay hale getiriyor.'
    },
    date: 'January 3, 2025',
    readTime: '8 min read',
    category: 'Streaming',
  },
  {
    slug: 'movie-recommendation-algorithms',
    title: {
      en: 'Understanding Movie Recommendation Algorithms (Complete Guide)',
      tr: 'Film Öneri Algoritmalarını Anlamak (Tam Rehber)'
    },
    excerpt: {
      en: 'A deep dive into how recommendation systems work and why mood-based AI is the future of streaming.',
      tr: 'Öneri sistemlerinin nasıl çalıştığına ve ruh hali tabanlı AI\'ın neden yayın platformlarının geleceği olduğuna derin bir dalış.'
    },
    date: 'January 2, 2025',
    readTime: '10 min read',
    category: 'Technology',
  },
  {
    slug: 'plot-twists-never-saw-coming',
    title: {
      en: '20 Plot Twists You NEVER Saw Coming (Spoiler-Free)',
      tr: 'Asla Beklemediğiniz 20 Senaryo Dönüşü (Spoiler\'sız)'
    },
    excerpt: {
      en: 'These mind-blowing plot twists will leave your jaw on the floor. No spoilers, just pure shock value.',
      tr: 'Bu akıllara durgunluk veren senaryo dönüşleri ağzınızı açık bırakacak. Spoiler yok, sadece saf şok değeri.'
    },
    date: 'January 1, 2025',
    readTime: '9 min read',
    category: 'Entertainment',
  },
  {
    slug: 'movies-everyone-lying-about',
    title: {
      en: 'Movies Everyone Pretends to Understand (But Actually Don\'t)',
      tr: 'Herkesin Anladığını İddia Ettiği (Ama Aslında Anlamadığı) Filmler'
    },
    excerpt: {
      en: 'Inception? Interstellar? Tenet? Yeah, nobody actually understands these movies. We break them down.',
      tr: 'Inception? Interstellar? Tenet? Evet, kimse bu filmleri gerçekten anlamıyor. Biz açıklıyoruz.'
    },
    date: 'November 30, 2024',
    readTime: '8 min read',
    category: 'Entertainment',
  },
  {
    slug: 'anime-movies-non-anime-fans',
    title: {
      en: 'Best Anime Movies for People Who "Don\'t Watch Anime"',
      tr: '"Anime İzlemem" Diyenler İçin En İyi Anime Filmleri'
    },
    excerpt: {
      en: 'Think you don\'t like anime? These masterpieces will change your mind in under 2 hours.',
      tr: 'Anime sevmediğinizi mi düşünüyorsunuz? Bu başyapıtlar 2 saatten kısa sürede fikrinizi değiştirecek.'
    },
    date: 'November 29, 2024',
    readTime: '7 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'streaming-services-worth-money',
    title: {
      en: 'Which Streaming Services Are Actually Worth Your Money in 2024?',
      tr: 'Hangi Yayın Platformları 2024\'te Gerçekten Paranıza Değer?'
    },
    excerpt: {
      en: 'Netflix, Disney+, Prime, HBO Max... We ranked every major streaming service so you don\'t waste money.',
      tr: 'Netflix, Disney+, Prime, HBO Max... Para israf etmemeniz için tüm büyük yayın platformlarını sıraladık.'
    },
    date: 'November 28, 2024',
    readTime: '9 min read',
    category: 'Streaming',
  },
  {
    slug: 'breaking-bad-things-never-knew',
    title: {
      en: 'Breaking Bad: 15 Insane Things You Never Knew About the Show',
      tr: 'Breaking Bad: Dizi Hakkında Hiç Bilmediğiniz 15 İnanılmaz Şey'
    },
    excerpt: {
      en: 'From real chemistry to hidden Easter eggs - shocking secrets from one of TV\'s greatest shows.',
      tr: 'Gerçek kimyadan gizli detaylara - televizyonun en büyük dizilerinden birinin şok edici sırları.'
    },
    date: 'January 14, 2025',
    readTime: '10 min read',
    category: 'TV Shows',
  },
  {
    slug: 'stranger-things-hidden-details',
    title: {
      en: 'Stranger Things: 20 Hidden Details You Completely Missed',
      tr: 'Stranger Things: Tamamen Kaçırdığınız 20 Gizli Detay'
    },
    excerpt: {
      en: 'Mind-blowing Easter eggs, references, and secrets hidden in every season of Stranger Things.',
      tr: 'Stranger Things\'in her sezonunda gizlenmiş akıllara durgunluk veren detaylar, göndermeler ve sırlar.'
    },
    date: 'January 13, 2025',
    readTime: '12 min read',
    category: 'TV Shows',
  },
  {
    slug: 'game-of-thrones-behind-scenes',
    title: {
      en: 'Game of Thrones: Behind-the-Scenes Secrets That Will Blow Your Mind',
      tr: 'Game of Thrones: Aklınızı Uçuracak Kamera Arkası Sırları'
    },
    excerpt: {
      en: 'From budget nightmares to actor injuries - the untold stories behind Westeros.',
      tr: 'Bütçe kabuslarından oyuncu yaralanmalarına - Westeros\'un anlatılmamış hikayeleri.'
    },
    date: 'January 12, 2025',
    readTime: '11 min read',
    category: 'TV Shows',
  },
  {
    slug: 'the-office-facts-fans-dont-know',
    title: {
      en: 'The Office: 25 Hilarious Facts Even Superfans Don\'t Know',
      tr: 'The Office: Süper Hayranların Bile Bilmediği 25 Komik Gerçek'
    },
    excerpt: {
      en: 'Improvised moments, deleted scenes, and secrets from Dunder Mifflin you never knew existed.',
      tr: 'Doğaçlama anlar, silinmiş sahneler ve Dunder Mifflin\'den varlığını hiç bilmediğiniz sırlar.'
    },
    date: 'January 11, 2025',
    readTime: '9 min read',
    category: 'TV Shows',
  },
  {
    slug: 'marvel-mcu-mind-blowing-facts',
    title: {
      en: 'Marvel MCU: 30 Mind-Blowing Facts About the Infinity Saga',
      tr: 'Marvel MCU: Infinity Saga Hakkında 30 İnanılmaz Gerçek'
    },
    excerpt: {
      en: 'Secret cameos, deleted scenes, and connections you missed across 23 films.',
      tr: 'Gizli kamera görünümleri, silinmiş sahneler ve 23 filmde kaçırdığınız bağlantılar.'
    },
    date: 'January 10, 2025',
    readTime: '14 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'harry-potter-magical-trivia',
    title: {
      en: 'Harry Potter: Magical Behind-the-Scenes Trivia Fans Will Love',
      tr: 'Harry Potter: Hayranların Bayılacağı Büyülü Kamera Arkası Bilgileri'
    },
    excerpt: {
      en: 'From casting secrets to prop mishaps - wizarding world facts that will amaze you.',
      tr: 'Seçme sırlarından sahne kazalarına - sizi şaşırtacak büyücülük dünyası gerçekleri.'
    },
    date: 'January 9, 2025',
    readTime: '10 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'dark-knight-hidden-details',
    title: {
      en: 'The Dark Knight: Christopher Nolan\'s Hidden Details You Never Noticed',
      tr: 'The Dark Knight: Christopher Nolan\'ın Hiç Fark Etmediğiniz Gizli Detayları'
    },
    excerpt: {
      en: 'Heath Ledger\'s method acting, practical effects, and symbolism that makes this a masterpiece.',
      tr: 'Heath Ledger\'ın metod oyunculuğu, pratik efektler ve bunu başyapıt yapan sembolizm.'
    },
    date: 'January 8, 2025',
    readTime: '9 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'inception-dream-secrets-explained',
    title: {
      en: 'Inception: Every Dream Layer Explained + Hidden Details',
      tr: 'Inception: Her Rüya Katmanı Açıklandı + Gizli Detaylar'
    },
    excerpt: {
      en: 'Finally understand Nolan\'s masterpiece. Plus Easter eggs you missed on first watch.',
      tr: 'Nolan\'ın başyapıtını sonunda anlayın. Ayrıca ilk izleyişte kaçırdığınız gizli detaylar.'
    },
    date: 'January 7, 2025',
    readTime: '11 min read',
    category: 'Genre Guide',
  },
  {
    slug: 'friends-secrets-from-set',
    title: {
      en: 'Friends: 20 Secrets From the Set That Will Surprise You',
      tr: 'Friends: Sizi Şaşırtacak 20 Set Sırrı'
    },
    excerpt: {
      en: 'From real-life romances to improvised lines - what really happened behind Central Perk.',
      tr: 'Gerçek hayat romanslarından doğaçlama repliklere - Central Perk\'ün arkasında gerçekten neler oldu.'
    },
    date: 'January 6, 2025',
    readTime: '8 min read',
    category: 'TV Shows',
  },
  {
    slug: 'peaky-blinders-historical-facts',
    title: {
      en: 'Peaky Blinders: Real Historical Facts vs Fiction',
      tr: 'Peaky Blinders: Gerçek Tarihsel Olaylar ve Kurgu Karşılaştırması'
    },
    excerpt: {
      en: 'How accurate is the show? The true story behind Birmingham\'s most notorious gang.',
      tr: 'Dizi ne kadar gerçekçi? Birmingham\'ın en kötü şöhretli çetesinin gerçek hikayesi.'
    },
    date: 'January 5, 2025',
    readTime: '10 min read',
    category: 'TV Shows',
  },
];

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Featured post (most recent) - ALWAYS English for global audience
  const featuredPost = {
    ...blogPosts[0],
    title: typeof blogPosts[0].title === 'string' ? blogPosts[0].title : blogPosts[0].title.en,
    excerpt: typeof blogPosts[0].excerpt === 'string' ? blogPosts[0].excerpt : blogPosts[0].excerpt.en
  };

  // Filter posts by category
  const filteredPosts = blogPosts.slice(1).filter(post =>
    selectedCategory === 'All' || post.category === selectedCategory
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  // Blog content ALWAYS in English for global audience
  const regularPosts = filteredPosts.slice(startIndex, endIndex).map(post => ({
    ...post,
    title: typeof post.title === 'string' ? post.title : post.title.en,
    excerpt: typeof post.excerpt === 'string' ? post.excerpt : post.excerpt.en
  }));

  // Scroll to top when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Translations
  const blogTranslations = {
    tr: {
      header: 'Son Yazılar',
      subtitle: 'AI destekli eğlence, akış trendleri ve film keşfinin geleceği hakkında derinlemesine analizler',
      featured: 'Öne Çıkan',
      followUs: 'Takip Et:',
      all: 'Tümü',
      ctaTitle: 'AI destekli önerileri deneyimlemek ister misiniz?',
      ctaSubtitle: 'WatchPulse\'u indirin ve mükemmel izlemeyi keşfedin!',
      ctaButton: 'Daha Fazla Bilgi',
      categories: {
        'All': 'Tümü',
        'Technology': 'Teknoloji',
        'Streaming': 'Yayın',
        'AI & Technology': 'AI & Teknoloji',
        'Mood Guide': 'Ruh Hali',
        'Genre Guide': 'Tür Rehberi',
        'Psychology': 'Psikoloji',
        'Entertainment': 'Eğlence',
        'TV Shows': 'Diziler',
        'Trends': 'Trendler'
      }
    },
    en: {
      header: 'Latest Insights',
      subtitle: 'Deep dives into AI-powered entertainment, streaming trends, and the future of movie discovery',
      featured: 'Featured',
      followUs: 'Follow:',
      all: 'All',
      ctaTitle: 'Want to experience AI-powered recommendations?',
      ctaSubtitle: 'Download WatchPulse and discover your perfect watch!',
      ctaButton: 'Learn More',
      categories: {
        'All': 'All',
        'Technology': 'Technology',
        'Streaming': 'Streaming',
        'AI & Technology': 'AI & Tech',
        'Mood Guide': 'Mood',
        'Genre Guide': 'Genre',
        'Psychology': 'Psychology',
        'Entertainment': 'Fun',
        'TV Shows': 'TV Shows',
        'Trends': 'Trends'
      }
    }
  };

  // Blog is ALWAYS in English - no Turkish translations
  const trans = blogTranslations['en'];

  return (
    <main className="min-h-screen bg-background-dark">
      <Header hideLanguageSwitcher forceEnglish />

      {/* Sticky Waitlist Button */}
      <WaitlistCTA variant="sticky" language="en" />

      <Container className="py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 px-4">
          <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-brand-primary/10 rounded-full text-brand-primary text-xs md:text-sm font-semibold mb-3 md:mb-4 border border-brand-primary/20">
            {trans?.header || 'Latest Insights'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-hero bg-clip-text text-transparent">
            WatchPulse Blog
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed px-2">
            {trans?.subtitle || 'Deep dives into AI-powered entertainment, streaming trends, and the future of movie discovery'}
          </p>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-8 md:mb-16 pb-8 md:pb-12 border-b border-brand-primary/10 px-4">
          <span className="text-sm md:text-base text-text-secondary font-medium">{trans?.followUs || 'Follow:'}</span>
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${SOCIAL_LINKS.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 transition-all group hover:scale-110"
              title="Email"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors" />
            </a>

            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 transition-all group hover:scale-110"
              title="X (Twitter)"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 transition-all group hover:scale-110"
              title="TikTok"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>

            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 transition-all group hover:scale-110"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors" />
            </a>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
            <span className="text-brand-accent font-semibold text-sm">{trans?.featured || 'Featured'}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
          </div>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-gradient-primary rounded-3xl overflow-hidden border border-brand-primary/20 hover:border-brand-primary/50 transition-all duration-300"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/20 rounded-full text-brand-accent text-sm font-semibold mb-4 w-fit border border-brand-accent/30">
                  {featuredPost.category}
                </div>
                <h2 className="text-4xl font-bold mb-4 text-text-primary group-hover:text-brand-accent transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
                  📖
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const displayCategory = trans?.categories?.[category as keyof typeof trans.categories] || category;

            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 rounded-full border transition-all text-xs font-semibold whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-primary text-background-dark border-brand-primary shadow-lg shadow-brand-primary/30'
                    : 'bg-background-card border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 text-text-secondary hover:text-brand-primary'
                }`}
              >
                {displayCategory}
              </button>
            );
          })}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-background-card rounded-2xl p-6 h-full border border-brand-primary/10 hover:border-brand-primary/30 transition-all duration-300 hover:transform hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-primary/10">
                {/* Category Badge */}
                <div className="inline-block px-3 py-1.5 bg-brand-primary/20 rounded-full text-brand-primary text-xs font-semibold mb-4 border border-brand-primary/30">
                  {post.category}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 text-text-primary group-hover:text-brand-primary transition-colors leading-tight">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-text-secondary mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-brand-primary/10">
                  <span>{post.date}</span>
                  <span className="font-semibold text-brand-primary">{post.readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-background-card border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background-card transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-brand-primary" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[44px] h-11 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-brand-primary text-background-dark border-2 border-brand-primary shadow-lg shadow-brand-primary/30'
                    : 'bg-background-card text-text-secondary border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 hover:text-brand-primary'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-background-card border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background-card transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-brand-primary" />
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-primary rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            {trans?.ctaTitle || 'Want to experience AI-powered recommendations?'}
          </h2>
          <p className="text-lg text-text-secondary mb-6">
            {trans?.ctaSubtitle || 'Download WatchPulse and discover your perfect watch!'}
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-brand-accent rounded-lg font-bold hover:bg-brand-gold transition-colors"
          >
            {trans?.ctaButton || 'Learn More'}
          </Link>
        </div>
      </Container>

      <Footer forceEnglish />
    </main>
  );
}

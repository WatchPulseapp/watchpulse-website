import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Kategoriler
const CATEGORIES = [
  'Technology', 'Streaming', 'AI & Technology', 'Mood Guide',
  'Genre Guide', 'Psychology', 'Entertainment', 'TV Shows', 'Trends'
];

// Farklı blog açıları - her biri benzersiz içerik üretir
const BLOG_ANGLES = [
  { id: 'personal-story', tone: 'samimi ve arkadaşça', style: 'kişisel hikaye anlatımı' },
  { id: 'data-analysis', tone: 'profesyonel ve analitik', style: 'veri odaklı araştırma' },
  { id: 'controversial', tone: 'cesur ve tartışmacı', style: 'popüler görüşlere karşı çıkış' },
  { id: 'tutorial', tone: 'yardımcı ve öğretici', style: 'adım adım rehber' },
  { id: 'listicle', tone: 'eğlenceli ve çekici', style: 'sıralı liste formatı' },
  { id: 'psychological', tone: 'düşünceli ve derinlikli', style: 'psikolojik analiz' },
  { id: 'industry-insider', tone: 'uzman ve içeriden', style: 'sektör sırları' },
  { id: 'comparison', tone: 'dengeli ve kapsamlı', style: 'karşılaştırma analizi' },
  { id: 'future-trends', tone: 'vizyon sahibi', style: 'gelecek tahminleri' },
  { id: 'nostalgia', tone: 'sıcak ve hatırlayıcı', style: 'geçmişe bakış' },
  { id: 'hidden-gems', tone: 'keşifçi', style: 'gizli hazineler' },
  { id: 'marathon-guide', tone: 'pratik', style: 'maraton izleme rehberi' }
];

// Her açı için benzersiz giriş cümleleri
const UNIQUE_OPENINGS: Record<string, string[]> = {
  'personal-story': [
    "Last Tuesday at 2 AM, I found myself ugly-crying over a movie I'd avoided for years. Here's what finally made me watch it.",
    "My roommate hasn't spoken to me in three days because of a movie recommendation gone wrong. Let me explain.",
    "I accidentally watched 43 movies in one week during a power outage. What I discovered about myself was unsettling.",
    "The movie that saved my mental health last winter wasn't what you'd expect. It was a random Tuesday night pick.",
    "I've been keeping a secret from my friends: I rewatch the same 5 movies every month. Here's why that's not as sad as it sounds."
  ],
  'data-analysis': [
    "A Stanford study just revealed that 78% of streaming subscribers spend more time choosing than watching. The solution exists.",
    "Netflix's internal data shows users abandon 23% of movies within 15 minutes. Here's what the algorithm isn't telling you.",
    "I analyzed 10,000 movie reviews using AI. The patterns I found completely changed how I pick movies.",
    "The streaming industry's dirty secret: 62% of content never gets watched. Here's why, and how to find the hidden gems.",
    "After tracking my viewing habits for 365 days, I discovered I was wasting 47 hours yearly on bad choices."
  ],
  'controversial': [
    "Hot take: The Marvel fatigue everyone's talking about isn't fatigue at all. It's something far more concerning.",
    "I'm about to say something that will make half of you unsubscribe: Your favorite streaming service is actively making you dumber.",
    "Unpopular opinion: 90% of 'critically acclaimed' movies are actually unwatchable. Here's the proof.",
    "The streaming wars have a clear loser, and it's you. Here's the uncomfortable truth nobody wants to admit.",
    "Why I canceled all my streaming subscriptions and became a happier person. The backlash I received was insane."
  ],
  'tutorial': [
    "Stop scrolling. In the next 4 minutes, I'll teach you a system that guarantees you'll never waste another evening on bad content.",
    "The 'Perfect Movie Matrix' I created has helped 50,000 people find their next favorite film in under 60 seconds.",
    "Here's exactly how I went from 'decision paralysis' to picking perfect movies in 30 seconds flat.",
    "I reverse-engineered Netflix's algorithm. Here's how to use it to your advantage in 5 simple steps.",
    "The Japanese 'Mood Matching' technique for choosing movies will revolutionize your entertainment experience."
  ],
  'listicle': [
    "After watching 2,000+ movies across every platform, these are the only 12 that genuinely changed my perspective on life.",
    "I asked 100 film critics their guilty pleasure movies. The results destroyed my faith in professional critics.",
    "These 15 underrated masterpieces have fewer than 5,000 views each. That's a cultural tragedy.",
    "The 10 movie plot twists that still haunt me years later. Number 7 made me pause the movie for 20 minutes.",
    "Every streaming platform's single best hidden gem, ranked by someone who's watched way too much content."
  ],
  'psychological': [
    "There's a neuroscientific reason you keep rewatching The Office instead of trying new shows. It's called 'comfort addiction.'",
    "Your movie choices reveal your attachment style better than any relationship quiz. Here's what the research shows.",
    "Why do we watch sad movies when we're already depressed? A psychologist explains this counterintuitive coping mechanism.",
    "The 'Paradox of Choice' is destroying your movie nights. Here's the psychology behind your endless scrolling.",
    "Film therapists are real, and they're helping people heal trauma through carefully selected movies. Here's how it works."
  ],
  'industry-insider': [
    "I spent 4 years at a major streaming company. Here's what they don't want you to know about how they manipulate your choices.",
    "A former Netflix product manager revealed their algorithm's biggest flaw to me. It changed how I watch movies forever.",
    "Why streaming services intentionally make their search features terrible. An insider perspective.",
    "The content acquisition secrets streaming platforms don't want you to know. I was there when these deals were made.",
    "How streaming services use 'mood manipulation' to keep you watching. A former behavioral psychologist speaks out."
  ],
  'comparison': [
    "Netflix vs Max vs Disney+ vs Hulu: I've been subscribed to all four for 18 months. Here's the definitive, brutally honest verdict.",
    "I watched the same genre across 6 platforms for 3 months straight. The quality difference is staggering.",
    "AI recommendations vs human curation: I tested both approaches for 60 days. The winner wasn't even close.",
    "Original content showdown: Which streaming service actually makes the best shows? I analyzed 500 releases.",
    "The hidden costs of 'free' streaming services. A comprehensive comparison that will change how you subscribe."
  ],
  'future-trends': [
    "By 2028, AI will know what you want to watch before you sit down. Early trials are already showing 94% accuracy.",
    "The death of traditional streaming is closer than you think. Here's what's replacing it, and why you'll love it.",
    "Neural interfaces for entertainment are no longer science fiction. I tried an early prototype, and it was terrifying.",
    "Why Gen Z is abandoning streaming services entirely. The shift happening right now will reshape entertainment.",
    "The 'personalized movie' is coming: AI-generated content tailored to your exact preferences. I've seen demos."
  ],
  'nostalgia': [
    "Remember when choosing a movie meant driving to Blockbuster? That experience was actually psychologically healthier.",
    "I rewatched every movie from my childhood in chronological order. Only 4 held up. Here's what that taught me.",
    "The '90s had something streaming will never replicate: the joy of limited choice. Here's why abundance makes us miserable.",
    "Why my parents' 20 VHS tapes provided better entertainment than my 4 streaming subscriptions ever will.",
    "The lost art of the 'random movie pick.' How algorithms destroyed the joy of cinematic surprise."
  ],
  'hidden-gems': [
    "I've made it my mission to find movies with under 1,000 IMDB ratings that deserve millions. These 8 changed my life.",
    "The foreign films Americans are missing out on could fill an entire lifetime. Start with these masterpieces.",
    "Why the best movies of 2024 aren't on any 'Best of' lists. The algorithm buries them, but I found them.",
    "These 12 movies were complete box office failures but are absolute cinematic treasures. Critics got it wrong.",
    "The streaming platforms' hidden catalogs contain gold. Here's exactly how to access what they're not showing you."
  ],
  'marathon-guide': [
    "The perfect 48-hour movie marathon exists, and I've scientifically designed it for maximum emotional impact.",
    "How to structure a movie marathon that won't destroy your mental health: a guide from someone who learned the hard way.",
    "Genre-hopping marathons hit different. Here's the exact sequence for the ultimate weekend viewing experience.",
    "The 'emotional rollercoaster' marathon format that will leave you feeling genuinely transformed. Trust the order.",
    "I've hosted 50+ movie marathons. These are the unbreakable rules I've learned for keeping everyone engaged."
  ]
};

// Trend konular - gerçek SEO değeri olan
const TRENDING_TOPICS = [
  "best movies to watch when feeling lonely 2025",
  "how AI is changing movie recommendations",
  "why Netflix algorithm recommends bad movies",
  "movies that will make you cry healing tears",
  "underrated sci-fi movies on streaming platforms",
  "psychological thriller recommendations by mood",
  "best comfort movies for anxiety",
  "hidden gems on Netflix nobody talks about",
  "movies to watch based on your zodiac sign",
  "how to break out of your movie comfort zone",
  "best foreign films Americans are missing",
  "movies that changed people's perspective on life",
  "streaming service comparison 2025",
  "why we rewatch the same movies psychology",
  "best movie marathons for weekends",
  "AI movie recommendations vs human curators",
  "movies to watch when you can't sleep",
  "best feel-good movies for depression",
  "underrated horror movies streaming now",
  "movies with unexpected plot twists",
  "best documentaries that will change your mind",
  "romantic comedies that aren't cringe",
  "action movies with actual good plots",
  "animated movies for adults only",
  "best movie soundtracks for productivity",
  "movies based on true stories worth watching",
  "cult classic movies streaming in 2025",
  "movies to watch before you die updated list",
  "best international thrillers on Netflix",
  "movies that are better than the book"
];

interface BlogContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  content: string | string[];
}

interface BlogSuggestion {
  slug: string;
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  content: BlogContent[];
  category: string;
  readTime: string;
  tags: string[];
}

// Mevcut blogları kontrol et
async function getExistingBlogSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const blogs = await Blog.find({}).select('slug title').lean();
    const slugs = blogs.map((b: { slug?: string }) => b.slug?.toLowerCase() || '');
    const titles = blogs.map((b: { title?: { en?: string } }) => b.title?.en?.toLowerCase() || '');
    return [...slugs, ...titles];
  } catch {
    return [];
  }
}

// Benzersiz topic seç
function selectUniqueTopic(existingContent: string[]): { topic: string; angle: typeof BLOG_ANGLES[0] } {
  const shuffledTopics = [...TRENDING_TOPICS].sort(() => Math.random() - 0.5);
  const shuffledAngles = [...BLOG_ANGLES].sort(() => Math.random() - 0.5);

  for (const topic of shuffledTopics) {
    const topicWords = topic.toLowerCase().split(' ');
    const isUsed = existingContent.some(existing => {
      const existingWords = existing.toLowerCase().split(/[-\s]/);
      const matchCount = topicWords.filter(w => existingWords.includes(w)).length;
      return matchCount >= 3; // 3 veya daha fazla ortak kelime varsa benzersiz değil
    });

    if (!isUsed) {
      return { topic, angle: shuffledAngles[0] };
    }
  }

  // Hiçbiri benzersiz değilse, random kombinasyon oluştur
  const randomAngle = shuffledAngles[0];
  const randomTopic = `${shuffledTopics[Math.floor(Math.random() * 5)]} - ${randomAngle.style}`;
  return { topic: randomTopic, angle: randomAngle };
}

// Tek blog üret
async function generateSingleBlog(
  topic: string,
  angleConfig: typeof BLOG_ANGLES[0],
  existingSlugs: string[]
): Promise<BlogSuggestion | null> {

  const openings = UNIQUE_OPENINGS[angleConfig.id] || UNIQUE_OPENINGS['personal-story'];
  const selectedOpening = openings[Math.floor(Math.random() * openings.length)];

  const prompt = `Create a comprehensive, SEO-optimized blog post about "${topic}" for WatchPulse, an AI-powered movie recommendation app.

WRITING ANGLE: ${angleConfig.style}
TONE: ${angleConfig.tone}

STRICT REQUIREMENTS:
1. Write 1000+ words with 7-10 detailed sections
2. Include at least 6 SPECIFIC movie/show titles with years (e.g., "Inception (2010)")
3. Mention streaming platforms (Netflix, HBO Max, Disney+, Amazon Prime, Hulu)
4. Include 2-3 real statistics or research findings
5. Reference WatchPulse's mood-based AI recommendations naturally 3-4 times
6. Add actionable tips readers can immediately use
7. Create engaging subheadings that work as standalone insights
8. Include a compelling call-to-action mentioning WatchPulse app
9. Make it shareable on social media

SEO OPTIMIZATION:
- Title must be catchy and include main keywords
- Excerpt must be compelling and 150-160 characters
- Include relevant tags for discoverability
- Slug should be SEO-friendly and descriptive

ALREADY EXISTING SLUGS TO AVOID (create something completely different):
${existingSlugs.slice(0, 20).join(', ')}

RESPOND IN VALID JSON FORMAT ONLY:
{
  "slug": "unique-seo-friendly-url-slug",
  "title": {
    "en": "Compelling English Title with Keywords",
    "tr": "Anahtar Kelimelerle Türkçe Başlık"
  },
  "excerpt": {
    "en": "Engaging 150-char description that makes people want to read more...",
    "tr": "Okuyucuyu çeken 150 karakterlik Türkçe açıklama..."
  },
  "content": [
    {"type": "paragraph", "content": "Opening paragraph..."},
    {"type": "heading", "content": "First Section Title"},
    {"type": "paragraph", "content": "Section content with movie examples..."},
    {"type": "list", "content": ["Point 1", "Point 2", "Point 3"]},
    {"type": "quote", "content": "Memorable quote or statistic"},
    {"type": "heading", "content": "Another Section"},
    {"type": "paragraph", "content": "More valuable content..."}
  ],
  "category": "One of: Technology, Streaming, AI & Technology, Mood Guide, Genre Guide, Psychology, Entertainment, TV Shows, Trends",
  "readTime": "X min read",
  "tags": ["relevant", "seo", "tags", "for", "discovery"]
}`;

  const models = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'mixtral-8x7b-32768'
  ];

  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `You are an expert content creator specializing in entertainment and streaming content. Write in a ${angleConfig.tone} style. Create unique, engaging, SEO-optimized content that drives traffic. Return ONLY valid JSON, no markdown.`
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.9,
          max_tokens: 8000,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Model ${model} failed:`, response.status, errorData);
        continue;
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content?.trim();

      if (!content) continue;

      // JSON temizle
      content = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      // JSON'u parse et
      const blog = JSON.parse(content) as BlogSuggestion;

      // İlk paragrafı benzersiz açılış ile değiştir
      if (blog.content?.length > 0 && blog.content[0].type === 'paragraph') {
        blog.content[0].content = selectedOpening;
      }

      // Slug'ın benzersiz olduğunu kontrol et
      const cleanSlug = blog.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      if (existingSlugs.includes(cleanSlug)) {
        blog.slug = `${cleanSlug}-${Date.now().toString(36)}`;
      } else {
        blog.slug = cleanSlug;
      }

      return blog;

    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      continue;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== ADMIN_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Invalid admin key'
      }, { status: 401 });
    }

    // API key kontrolü
    if (!GROQ_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'GROQ_API_KEY environment variable is not configured. Please add it to your Vercel environment variables.',
        hint: 'Go to Vercel Dashboard > Settings > Environment Variables > Add GROQ_API_KEY'
      }, { status: 500 });
    }

    // API key formatı kontrolü
    if (!GROQ_API_KEY.startsWith('gsk_')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid GROQ_API_KEY format. Key should start with "gsk_"',
        hint: 'Get your API key from https://console.groq.com/keys'
      }, { status: 500 });
    }

    const body = await request.json();
    const { topic: userTopic, count = 3 } = body;

    // Mevcut blog'ları al
    const existingSlugs = await getExistingBlogSlugs();
    console.log(`Found ${existingSlugs.length} existing blogs`);

    // Her blog için farklı açı ve topic seç
    const blogConfigs: Array<{ topic: string; angle: typeof BLOG_ANGLES[0] }> = [];
    const usedAngles = new Set<string>();
    const usedTopics = new Set<string>();

    for (let i = 0; i < count; i++) {
      let config: { topic: string; angle: typeof BLOG_ANGLES[0] };

      if (userTopic) {
        // Kullanıcı topic verdiyse, farklı açılar kullan
        const availableAngles = BLOG_ANGLES.filter(a => !usedAngles.has(a.id));
        const angle = availableAngles[Math.floor(Math.random() * availableAngles.length)] || BLOG_ANGLES[0];
        config = { topic: userTopic, angle };
      } else {
        // Topic verilmediyse, trending topics'ten benzersiz seç
        let attempts = 0;
        do {
          config = selectUniqueTopic([...existingSlugs, ...Array.from(usedTopics)]);
          attempts++;
        } while (usedTopics.has(config.topic) && attempts < 10);
      }

      usedAngles.add(config.angle.id);
      usedTopics.add(config.topic);
      blogConfigs.push(config);
    }

    // Blogları paralel olarak oluştur
    const blogPromises = blogConfigs.map(config =>
      generateSingleBlog(config.topic, config.angle, existingSlugs)
    );

    const results = await Promise.all(blogPromises);
    const suggestions = results.filter((blog): blog is BlogSuggestion => blog !== null);

    if (suggestions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Failed to generate any blogs. Please try again.',
        debug: {
          apiKeyPresent: !!GROQ_API_KEY,
          apiKeyFormat: GROQ_API_KEY?.substring(0, 8) + '...',
          attemptedCount: count
        }
      }, { status: 500 });
    }

    // Metadata ekle
    const validSuggestions = suggestions.map((suggestion) => ({
      ...suggestion,
      category: CATEGORIES.includes(suggestion.category) ? suggestion.category : 'Entertainment',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      author: 'WatchPulse Team',
      isPublished: false
    }));

    return NextResponse.json({
      success: true,
      suggestions: validSuggestions,
      count: validSuggestions.length,
      message: `Successfully generated ${validSuggestions.length} unique blog suggestions`
    });

  } catch (error) {
    console.error('Blog suggestions error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error while generating blogs',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 });
  }
}

// Trending topics endpoint - trafik için
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    topics: TRENDING_TOPICS,
    angles: BLOG_ANGLES.map(a => ({ id: a.id, style: a.style })),
    categories: CATEGORIES
  });
}

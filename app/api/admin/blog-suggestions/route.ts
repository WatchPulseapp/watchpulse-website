import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// WatchPulse kategorileri
const CATEGORIES = [
  'Technology',
  'Streaming',
  'AI & Technology',
  'Mood Guide',
  'Genre Guide',
  'Psychology',
  'Entertainment',
  'TV Shows',
  'Trends'
];

// Unique angle generators for variety
const CONTENT_ANGLES = [
  'controversial opinion piece that challenges common beliefs',
  'data-driven analysis with specific statistics and research',
  'personal storytelling narrative with relatable experiences',
  'expert interview style with Q&A format',
  'step-by-step tutorial or how-to guide',
  'comparison and versus analysis',
  'historical perspective tracing evolution over time',
  'prediction and future trends forecast',
  'problem-solution case study',
  'myth-busting and fact-checking approach',
  'listicle with deep dives into each item',
  'behind-the-scenes industry insights',
  'beginner-friendly explainer',
  'advanced tips for enthusiasts'
];

const WRITING_STYLES = [
  'witty and humorous with pop culture references',
  'journalistic and investigative',
  'friendly and conversational like talking to a friend',
  'authoritative and expert-driven',
  'storytelling with narrative arcs',
  'direct and no-nonsense practical advice'
];

const UNIQUE_HOOKS = [
  'Start with a shocking statistic that grabs attention',
  'Begin with a personal anecdote or relatable scenario',
  'Open with a provocative question that challenges assumptions',
  'Start with a bold controversial statement',
  'Begin by describing a common frustration readers experience',
  'Open with a surprising fact most people don\'t know'
];

interface BlogSuggestion {
  slug: string;
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  content: Array<{ type: string; content: string | string[] }>;
  category: string;
  readTime: string;
  tags: string[];
}

// Function to get random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Different blog angles to ensure variety
const BLOG_ANGLES = [
  { angle: 'personal-story', tone: 'casual and friendly', opening: 'personal anecdote about watching movies' },
  { angle: 'data-analysis', tone: 'professional and analytical', opening: 'surprising statistic from research' },
  { angle: 'controversial', tone: 'bold and provocative', opening: 'unpopular opinion that challenges norms' },
  { angle: 'tutorial', tone: 'helpful and instructional', opening: 'step-by-step guide introduction' },
  { angle: 'listicle', tone: 'fun and engaging', opening: 'countdown or ranked list teaser' },
  { angle: 'industry-insider', tone: 'knowledgeable and insider', opening: 'behind-the-scenes industry insight' },
  { angle: 'psychological', tone: 'thoughtful and analytical', opening: 'psychology or behavior pattern' },
  { angle: 'comparison', tone: 'balanced and thorough', opening: 'versus or comparison setup' },
  { angle: 'future-trends', tone: 'forward-thinking', opening: 'prediction about future of entertainment' },
  { angle: 'nostalgia', tone: 'warm and reminiscent', opening: 'throwback to classic era' }
];

// Pre-written unique opening sentences - AI must continue from these
const UNIQUE_OPENINGS: Record<string, string[]> = {
  'personal-story': [
    "Last Tuesday at 3 AM, I found myself crying over a movie I'd avoided for years. Here's what finally made me watch it.",
    "My best friend hasn't spoken to me in three days because of a movie recommendation I made. Let me explain.",
    "I accidentally watched 47 movies in one week during a power outage. Here's what I learned about myself."
  ],
  'data-analysis': [
    "A Stanford study revealed that 73% of Netflix users spend more time choosing what to watch than actually watching.",
    "The streaming industry generated $120 billion in 2024, but 68% of subscribers say they can't find anything to watch.",
    "New research shows the average person will spend 1.3 years of their life deciding what to stream. That ends today."
  ],
  'controversial': [
    "Unpopular opinion: Marvel movies ruined an entire generation's ability to appreciate cinema. Fight me.",
    "Hot take: The algorithm knows you better than your therapist, and that's not a good thing.",
    "I'm about to say something that will make half of you unsubscribe: Your favorite movie is actually terrible."
  ],
  'tutorial': [
    "Stop. Before you scroll Netflix for another 45 minutes, read this 3-minute guide that will change everything.",
    "In exactly 7 steps, I'm going to show you how to find your perfect movie in under 60 seconds.",
    "Here's the system I use to never waste another evening on a bad movie. It works every time."
  ],
  'listicle': [
    "After watching 1,247 movies across every streaming platform, here are the only 15 that actually matter.",
    "I asked 50 film critics their guilty pleasure movies. Number 7 shocked everyone.",
    "These 10 underrated gems on Netflix have less than 10,000 views. That's criminal."
  ],
  'psychological': [
    "There's a scientific reason you keep rewatching Friends instead of trying new shows. It's called nostalgia addiction.",
    "Your movie choices reveal more about your personality than any Myers-Briggs test. Here's the psychology.",
    "Why do we watch sad movies when we're already sad? A psychologist explains the counterintuitive truth."
  ],
  'industry-insider': [
    "I spent 5 years working at a streaming company. Here's what they don't want you to know about recommendations.",
    "A Netflix executive once told me the secret behind their algorithm. It changed how I watch movies forever.",
    "The streaming wars are rigged. Here's insider knowledge on how to actually find good content."
  ],
  'comparison': [
    "Netflix vs HBO Max vs Disney+: I subscribed to all three for a year. Here's the definitive verdict.",
    "I watched the same genre on 5 different platforms. The differences will surprise you.",
    "Algorithm recommendations vs human curation: I tested both for 30 days. The winner shocked me."
  ],
  'future-trends': [
    "By 2030, you won't choose what to watch. AI will know your mood before you do. Here's why that's terrifying.",
    "The future of entertainment is personalized to your DNA. Early trials are already happening.",
    "Streaming as we know it will be dead in 5 years. Here's what's replacing it."
  ],
  'nostalgia': [
    "Remember when choosing a movie meant going to Blockbuster? Here's why that experience was actually better.",
    "The golden age of cinema wasn't the 1970s. It's happening right now, and you're missing it.",
    "I rewatched every movie from my childhood. Only 3 held up. Here's what that taught me about nostalgia."
  ]
};

async function generateSingleBlog(topic: string, angleConfig: typeof BLOG_ANGLES[0], blogNumber: number): Promise<BlogSuggestion | null> {
  // Get a pre-written unique opening
  const openings = UNIQUE_OPENINGS[angleConfig.angle] || UNIQUE_OPENINGS['personal-story'];
  const selectedOpening = openings[Math.floor(Math.random() * openings.length)];

  const prompt = `Write a blog post about "${topic}" for WatchPulse (AI movie recommendation app).

STYLE: ${angleConfig.tone}
ANGLE: ${angleConfig.angle}

REQUIREMENTS:
- 800+ words, 6-8 sections
- Include 4-5 SPECIFIC movie titles
- Mention streaming platforms
- Include 1-2 statistics
- Mention WatchPulse 2-3 times
- End with call-to-action

JSON FORMAT ONLY:
{"slug":"url","title":{"en":"Title","tr":"Başlık"},"excerpt":{"en":"Description","tr":"Açıklama"},"content":[{"type":"paragraph","content":"Opening..."},{"type":"heading","content":"Section"},{"type":"paragraph","content":"Content"},{"type":"list","content":["Item"]}],"category":"Entertainment","readTime":"8 min","tags":["tag1","tag2"]}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a creative ${angleConfig.tone} content writer. Write in ${angleConfig.tone} style. Your opening MUST be unique and match the ${angleConfig.angle} angle. Return valid JSON only.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.95,
        max_tokens: 8000,
        top_p: 0.9
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    let content = data.choices[0]?.message?.content?.trim();
    if (!content) return null;

    // Clean markdown
    if (content.startsWith('```json')) content = content.slice(7);
    if (content.startsWith('```')) content = content.slice(3);
    if (content.endsWith('```')) content = content.slice(0, -3);
    content = content.trim();

    const blog = JSON.parse(content) as BlogSuggestion;

    // Replace the first paragraph with our unique pre-written opening
    if (blog.content && blog.content.length > 0 && blog.content[0].type === 'paragraph') {
      blog.content[0].content = selectedOpening;
    }

    return blog;
  } catch (e) {
    console.error('Parse error for blog:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'GROQ_API_KEY is not configured'
      }, { status: 500 });
    }

    const body = await request.json();
    const { topic, count = 3 } = body;

    // Get random unique angles for each blog
    const shuffledAngles = [...BLOG_ANGLES].sort(() => Math.random() - 0.5).slice(0, count);

    // Generate blogs in parallel with different prompts
    const blogPromises = shuffledAngles.map((angle, i) =>
      generateSingleBlog(topic || 'movies and streaming', angle, i + 1)
    );

    const results = await Promise.all(blogPromises);
    const suggestions = results.filter((blog): blog is BlogSuggestion => blog !== null);

    if (suggestions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Failed to generate blogs'
      }, { status: 500 });
    }

    // Add metadata
    const validSuggestions = suggestions.map((suggestion) => ({
      ...suggestion,
      slug: suggestion.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
      category: CATEGORIES.includes(suggestion.category) ? suggestion.category : 'Entertainment',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      author: 'WatchPulse Team'
    }));

    return NextResponse.json({
      success: true,
      suggestions: validSuggestions,
      count: validSuggestions.length
    });

  } catch (error) {
    console.error('Blog suggestions error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

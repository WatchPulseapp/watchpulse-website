import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { buildStoryBrief, type StoryBrief, type TitleRef } from '@/lib/blog-stories';
import { translateArticle } from '@/lib/blog-translate';

/**
 * Autonomous blog generation pipeline (Groq).
 *
 * Two calls per article, each sized to what the models actually do well — this
 * split was arrived at by measuring, not by guessing:
 *
 *   1) WRITER   — the long English article, grounded in a TMDB fact sheet.
 *                 llama-3.3-70b is the only model in the free tier that reliably
 *                 produces 1000+ words of valid JSON.
 *   2) HEADLINE — title and excerpt as their own small call. The writer nails
 *                 the body but consistently phones in the headline, returning
 *                 things like "The Dark Side" or "New Movies in Theaters".
 *                 gpt-oss-120b handles this well, but ONLY with
 *                 reasoning_effort:'low' — without it, it burns its budget on
 *                 reasoning tokens and returns an empty body every time.
 *
 * A third EDITOR call invents a topic, but only on the fallback path where TMDB
 * is unavailable; normally the topic comes from the story brief.
 *
 * Note on max_tokens: Groq's free tier counts prompt + max_tokens against a
 * per-model tokens-per-minute limit (12k for llama-3.3-70b, 8k for gpt-oss-120b,
 * 6k for llama-3.1-8b). Requesting a flat 8000 gets the request rejected with a
 * 413 before any work happens, so each model carries its own budget below.
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

interface ModelConfig {
  id: string;
  maxTokens: number;
  /** Extra body params, e.g. reasoning_effort for the gpt-oss family. */
  extra?: Record<string, unknown>;
}

// Measured output lands at 1000-1900 words (~3,500 tokens), so 5,000 is ample
// headroom. Asking for more only eats into the per-minute budget the headline
// call still needs.
//
// The fallback is llama-3.1-8b, NOT gpt-oss-120b. gpt-oss is a reasoning model
// and cannot finish a long JSON article inside its budget — it fails every time
// with "max completion tokens reached before generating a valid document", so
// having it here meant the writer effectively had no fallback at all. The 8b
// model produces a shorter but structurally valid article (measured: 1058 words,
// 22 blocks, 2.6s), which is exactly what a fallback needs to do.
const WRITER_MODELS: ModelConfig[] = [
  { id: 'llama-3.3-70b-versatile', maxTokens: 5000 },
  { id: 'llama-3.1-8b-instant', maxTokens: 4000 },
];

// Falling back to llama-3.1-8b rather than llama-3.3-70b matters: the 70b has
// just spent most of its per-minute token budget writing the body, and stacking
// another call on it was what pushed runs into HTTP 429.
const HEADLINE_MODELS: ModelConfig[] = [
  { id: 'openai/gpt-oss-120b', maxTokens: 600, extra: { reasoning_effort: 'low' } },
  { id: 'llama-3.1-8b-instant', maxTokens: 600 },
];

const EDITOR_MODELS: ModelConfig[] = [
  { id: 'llama-3.1-8b-instant', maxTokens: 300 },
  { id: 'llama-3.3-70b-versatile', maxTokens: 300 },
];

export const CATEGORIES = [
  'Technology',
  'Streaming',
  'AI & Technology',
  'Mood Guide',
  'Genre Guide',
  'Psychology',
  'Entertainment',
  'TV Shows',
  'Trends',
  'Hidden Gems',
  'Binge Worthy',
  'Weekend Watch',
  'Date Night',
  'Family Time',
];

// Each angle gives the writer a distinct voice and structure, so two articles on
// neighbouring topics never read the same.
const BLOG_ANGLES = [
  { id: 'personal-story', tone: 'warm and conversational', style: 'personal story woven through the advice' },
  { id: 'data-analysis', tone: 'analytical and precise', style: 'evidence-led breakdown of how it works' },
  { id: 'contrarian', tone: 'bold and opinionated', style: 'challenging the popular consensus' },
  { id: 'tutorial', tone: 'clear and encouraging', style: 'step-by-step how-to guide' },
  { id: 'listicle', tone: 'punchy and fun', style: 'ranked list with a strong hook per item' },
  { id: 'psychological', tone: 'thoughtful and curious', style: 'psychology-led explanation of viewer behaviour' },
  { id: 'industry-insider', tone: 'authoritative and knowing', style: 'how the streaming industry actually works' },
  { id: 'comparison', tone: 'balanced and fair', style: 'head-to-head comparison ending in a verdict' },
  { id: 'future-trends', tone: 'visionary but grounded', style: 'where this is heading over the next few years' },
  { id: 'nostalgia', tone: 'affectionate and reflective', style: 'looking back at how things used to be' },
  { id: 'hidden-gems', tone: 'excited and discovery-driven', style: 'surfacing overlooked titles worth finding' },
  { id: 'myth-busting', tone: 'direct and clarifying', style: 'debunking widely believed misconceptions' },
  { id: 'beginners-guide', tone: 'patient and welcoming', style: 'a primer for complete newcomers' },
  { id: 'deep-dive', tone: 'rigorous and detailed', style: 'exhaustive deep dive into the mechanics' },
];

// Only used when the editor call fails — a safety net, not the main source.
const FALLBACK_TOPICS = [
  'why streaming autoplay quietly ruins your attention span',
  'how your mood decides which films you finish and which you abandon',
  'the psychology behind the endless streaming scroll',
  'underrated sci-fi films that deserved a far bigger audience',
  'how streaming platforms decide what to show you first',
  'building a movie night ritual that actually sticks',
  'what your favourite genre reveals about how you unwind',
  'the rise of the ninety-minute film and why viewers love it',
  'how to find great films outside the algorithm bubble',
  'why sequels dominate every streaming homepage',
];

export interface BlogContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  content: string | string[];
}

/** What the writer call returns — English only. */
interface WriterOutput {
  slug: string;
  title: string;
  excerpt: string;
  content: BlogContentBlock[];
  category: string;
  tags: string[];
}

export interface GeneratedArticle {
  slug: string;
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  content: BlogContentBlock[];
  category: string;
  readTime: string;
  tags: string[];
  /** TMDB backdrop of the featured title, used as the card and OG image. */
  coverImage?: string;
  words: number;
  /** Diagnostics, surfaced in the cron response. */
  meta: {
    topic: string;
    angle: string;
    writerModel: string;
    storyFormat: string | null;
    /** Titles the translator must copy verbatim rather than translate. */
    requiredTitles: string[];
    /** The same records with TMDB ids, so the article can link to them. */
    sourceRefs: TitleRef[];
  };
}

export interface GenerationResult {
  ok: boolean;
  slug?: string;
  title?: string;
  topic?: string;
  angle?: string;
  /** Which TMDB story format produced this, or null if the fallback path ran. */
  format?: string | null;
  category?: string;
  model?: string;
  words?: number;
  /** False when the article published but its Turkish side could not be produced. */
  translated?: boolean;
  reason?: string;
}

class RateLimitError extends Error {}

/** Minimal OpenAI-compatible chat call against Groq, in JSON mode. */
async function callGroq(model: ModelConfig, system: string, user: string): Promise<string | null> {
  // The route caps out at 60s. A hung Groq connection with no timeout would burn
  // that entire budget and take the fallback models down with it, so each call
  // gets a hard ceiling that still leaves room for a retry and a fallback model.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  let response: Response;
  try {
    response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.85,
        top_p: 0.95,
        max_tokens: model.maxTokens,
        response_format: { type: 'json_object' },
        ...model.extra,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[blog-generator] ${model.id} timed out after 25s`);
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');

    // 413/429 mean we are over the per-minute token budget. Trying the next
    // model immediately is fine (budgets are per-model) but retrying the SAME
    // one is pointless, so this is surfaced distinctly.
    if (response.status === 413 || response.status === 429) {
      throw new RateLimitError(`${model.id} rate limited (HTTP ${response.status})`);
    }

    console.error(`[blog-generator] ${model.id} -> HTTP ${response.status}`, detail.slice(0, 300));
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

/**
 * Runs a call with one retry on the same model. Groq's JSON-mode validator
 * rejects the occasional malformed generation (`json_validate_failed`), and
 * because generation is stochastic a plain retry usually succeeds.
 */
async function callWithRetry(model: ModelConfig, system: string, user: string): Promise<string | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const result = await callGroq(model, system, user);
    if (result) return result;
    if (attempt === 1) console.warn(`[blog-generator] retrying ${model.id}`);
  }
  return null;
}

/** Parses JSON that may still arrive wrapped in a markdown fence or prose. */
function parseJson<T>(raw: string): T | null {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}

function wordCount(content: BlogContentBlock[]): number {
  return content.reduce((total, block) => {
    const text = Array.isArray(block.content) ? block.content.join(' ') : block.content;
    return total + String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ---------------------------------------------------------------------------
// 1. Editor — invent a topic
// ---------------------------------------------------------------------------

async function inventTopic(recentTitles: string[], angle: (typeof BLOG_ANGLES)[number]): Promise<string> {
  const user = `Propose ONE fresh blog topic for WatchPulse, an AI-powered movie and TV recommendation app, that would attract organic search traffic from people deciding what to watch.

The article will be written in this style: ${angle.style}.

Topics we have ALREADY published — your idea must not overlap with any of these:
${recentTitles.slice(0, 40).map((t) => `- ${t}`).join('\n') || '- (nothing yet)'}

Rules:
- Specific and searchable, not generic. Good: "why streaming autoplay kills your attention span". Bad: "movies are fun".
- Must be about movies, TV, streaming, viewing habits, or entertainment discovery.
- 6-14 words.

Return JSON: {"topic": "your topic here"}`;

  for (const model of EDITOR_MODELS) {
    try {
      const raw = await callWithRetry(model, 'You generate original blog topics. Return ONLY valid JSON.', user);
      if (!raw) continue;
      const topic = parseJson<{ topic?: string }>(raw)?.topic?.trim();
      if (topic && topic.length > 10) return topic;
    } catch (error) {
      console.error(`[blog-generator] editor ${model.id}:`, error instanceof Error ? error.message : error);
    }
  }

  return FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
}

// ---------------------------------------------------------------------------
// 2. Writer — the English article
// ---------------------------------------------------------------------------

/** How many of the fact sheet's titles the finished article must actually name. */
function requiredMentionCount(brief: StoryBrief | null): number {
  if (!brief || brief.requiredTitles.length === 0) return 0;
  return Math.min(4, Math.max(2, Math.ceil(brief.requiredTitles.length * 0.6)));
}

function buildWriterPrompt(
  topic: string,
  angle: (typeof BLOG_ANGLES)[number],
  existingSlugs: string[],
  brief: StoryBrief | null
): string {
  // With a brief, the article is pinned to verified TMDB data. Without one
  // (no TMDB key, or every format came back empty) the domain is enforced by
  // instruction alone, which is weaker — hence the explicit subject constraint.
  const grounding = brief
    ? `VERIFIED DATA — this is your ONLY permitted source of titles, dates, ratings, cast names and streaming availability:

${brief.factSheet}

GROUNDING RULES — breaking any of these makes the response unusable:
1. Every film, series, person, release date, rating and streaming service you name MUST appear in the VERIFIED DATA above.
2. Do NOT add titles from memory. Do NOT invent box office figures, viewer numbers, survey results or studies.
3. If you are unsure about a detail, write around it rather than guessing.
4. Name at least ${requiredMentionCount(brief)} of the VERIFIED DATA titles using their exact spelling.

WHAT TO WRITE:
${brief.instructions}`
    : `SUBJECT CONSTRAINT: this article must be about films, television, cinema or streaming — specific titles, genres, filmmakers, viewing habits or the streaming industry. Do not drift into generic technology or productivity writing.

Do NOT invent box office figures, viewer numbers, survey results or studies. Only name films and series you are confident actually exist, always with their release year.`;

  return `Write a long-form, SEO-optimized article for the WatchPulse blog. WatchPulse is an AI-powered movie and TV recommendation app that suggests titles based on the viewer's mood.

TOPIC: ${topic}

WRITING ANGLE: ${angle.style}
TONE: ${angle.tone}

${grounding}

STRUCTURE — follow this exactly, it is not a suggestion:
- 1 opening "paragraph" block of 100-140 words that hooks the reader.
- Then EXACTLY 8 sections. Each section = 1 "heading" block followed by 2 "paragraph" blocks of 100-140 words EACH.
- Insert 2 "list" blocks (4-5 items each) and 1 "quote" block at natural points between sections.
- The "content" array must therefore contain AT LEAST 28 blocks.
- A response with fewer than 28 blocks, or with paragraphs shorter than 100 words, is a FAILED response.

CONTENT RULES:
1. Always give a title's release year the first time you name it, e.g. "Inception (2010)".
2. Give concrete, actionable advice the reader can use tonight.
3. Headings must be specific and useful on their own, not generic filler — a heading naming an actual title beats "Why This Matters".
4. Mention WatchPulse's mood-based recommendations naturally 2-3 times, never as a hard sell.
5. The final section ends with a short call-to-action mentioning the WatchPulse app.

AVOID these existing article slugs — pick a genuinely different angle:
${existingSlugs.slice(0, 25).join(', ') || '(none yet)'}

Write in English only. Return ONLY valid JSON:
{
  "slug": "seo-friendly-url-slug",
  "title": "Compelling English title, 25-80 characters, containing the main keyword. Never a vague fragment.",
  "excerpt": "Meta description, 110-200 characters",
  "content": [
    { "type": "paragraph", "content": "..." },
    { "type": "heading", "content": "..." },
    { "type": "list", "content": ["...", "..."] },
    { "type": "quote", "content": "..." }
  ],
  "category": "one of: ${CATEGORIES.join(', ')}",
  "tags": ["four", "to", "six", "tags"]
}`;
}

// Measured English output lands at 1000-1900 words, so this rejects a run that
// quietly produced a stub without rejecting an ordinary short article.
const MIN_WORDS = 700;
const MIN_BLOCKS = 12;

/** Rejects anything we would be embarrassed to publish. */
function validateWriterOutput(blog: WriterOutput | null): string | null {
  if (!blog) return 'unparseable JSON';
  if (!blog.slug || typeof blog.slug !== 'string') return 'missing slug';
  if (!blog.title || typeof blog.title !== 'string') return 'missing title';
  if (!blog.excerpt || typeof blog.excerpt !== 'string') return 'missing excerpt';
  if (!Array.isArray(blog.content) || blog.content.length < MIN_BLOCKS) {
    return `only ${blog.content?.length ?? 0} content blocks (need ${MIN_BLOCKS})`;
  }

  const validTypes = new Set(['paragraph', 'heading', 'list', 'quote']);
  const malformed = blog.content.find(
    (b) =>
      !b ||
      !validTypes.has(b.type) ||
      (Array.isArray(b.content) ? b.content.length === 0 : !String(b.content || '').trim())
  );
  if (malformed) return 'malformed content block';

  const words = wordCount(blog.content);
  if (words < MIN_WORDS) return `article too short (${words} words, need ${MIN_WORDS})`;

  return null;
}

/** Flattens the article to plain text for content checks. */
function articleText(content: BlogContentBlock[]): string {
  return content
    .map((b) => (Array.isArray(b.content) ? b.content.join(' ') : b.content))
    .join(' ')
    .toLowerCase();
}

/**
 * Confirms the article is really about the films it was handed. A model that
 * ignores the fact sheet and writes a generic streaming essay will name few or
 * none of them, so this doubles as the guard that keeps the blog on-domain.
 */
function checkGrounding(content: BlogContentBlock[], brief: StoryBrief | null): string | null {
  const required = requiredMentionCount(brief);
  if (!brief || required === 0) return null;

  const text = articleText(content);
  const mentioned = brief.requiredTitles.filter((title) => text.includes(title.toLowerCase()));

  if (mentioned.length < required) {
    return `only named ${mentioned.length}/${brief.requiredTitles.length} of the supplied titles (need ${required})`;
  }
  return null;
}

// Fallback-path safety net: without a fact sheet there are no titles to check
// against, so the article at least has to read like film writing.
const DOMAIN_TERMS = [
  'film', 'movie', 'series', 'show', 'season', 'episode', 'cinema', 'streaming',
  'director', 'cast', 'genre', 'watch', 'netflix', 'screen',
];

function checkDomain(content: BlogContentBlock[]): string | null {
  const text = articleText(content);
  const hits = DOMAIN_TERMS.filter((term) => text.includes(term)).length;
  return hits >= 5 ? null : `off-domain: only ${hits} film/TV terms found`;
}

// ---------------------------------------------------------------------------
// 2b. Headline repair
// ---------------------------------------------------------------------------

// The writer reliably nails the body but consistently phones in the headline —
// measured output included "The Dark Side" (13 chars) on top of 1159 good words,
// and "New Movies in Theaters", which carries no searchable keyword at all.
// The headline is therefore written by its own dedicated call.
const TITLE_MIN = 30;
const TITLE_MAX = 80;
const EXCERPT_MIN = 110;
const EXCERPT_MAX = 200;

function headlineLooksGood(title: string, excerpt: string): boolean {
  return (
    title.length >= TITLE_MIN &&
    title.length <= TITLE_MAX &&
    excerpt.length >= EXCERPT_MIN &&
    excerpt.length <= EXCERPT_MAX
  );
}

/** True when the headline actually names one of the films the article covers. */
function namesAFeaturedTitle(title: string, featuredTitles: string[]): boolean {
  const normalized = normalizeForMatch(title);
  return featuredTitles.some((t) => t.length > 3 && normalized.includes(normalizeForMatch(t)));
}

/**
 * Writes title + excerpt from the article body.
 *
 * When the article is grounded in TMDB data, the headline is told to name two
 * or three of the actual films. Naming real titles is what turns a headline into
 * a long-tail search target: "Most Anticipated 2026 Movies After July: Clayface,
 * Spider-Man & More" earns traffic that "New Movies in Theaters" never will.
 */
async function writeHeadline(
  content: BlogContentBlock[],
  topic: string,
  featuredTitles: string[] = []
): Promise<{ title: string; excerpt: string } | null> {
  const body = content
    .filter((b) => b.type === 'paragraph' || b.type === 'heading')
    .slice(0, 6)
    .map((b) => (Array.isArray(b.content) ? b.content.join(' ') : b.content))
    .join('\n\n')
    .slice(0, 2500);

  const namingRule = featuredTitles.length
    ? `- The title MUST name 2-3 of these films or series, spelled exactly as given: ${featuredTitles.slice(0, 6).join(', ')}. Naming real titles is what makes the headline findable in search.`
    : `- The title must contain the main keyword someone would actually search for.`;

  const user = `Write a headline and meta description for this article on the blog of WatchPulse, an AI movie recommendation app.

TOPIC: ${topic}

ARTICLE OPENING:
${body}

Rules:
- Title: ${TITLE_MIN}-${TITLE_MAX} characters. Specific and click-worthy. Never a vague fragment like "The Dark Side" or a generic label like "New Movies in Theaters".
${namingRule}
- The title must do more than list names. Pair the titles with what the reader gets from the article — "Nosferatu, Jaws & The Thing: Must-Watch Horror Classics That Still Terrify" works; "Obsession, Masters of the Universe" does not.
- Excerpt: between ${EXCERPT_MIN} and ${EXCERPT_MAX} characters, written as a search-result meta description that makes someone click.
- English only.

Return JSON: {"title": "...", "excerpt": "..."}`;

  let nameless: { title: string; excerpt: string } | null = null;

  for (const model of HEADLINE_MODELS) {
    try {
      const raw = await callWithRetry(model, 'You are an SEO headline writer. Return ONLY valid JSON.', user);
      if (!raw) continue;

      const parsed = parseJson<{ title?: string; excerpt?: string }>(raw);
      const title = parsed?.title?.trim() || '';
      const excerpt = parsed?.excerpt?.trim() || '';
      if (!headlineLooksGood(title, excerpt)) continue;

      // Asking for real titles is not enough on its own — measured output
      // included "Where to Stream the Titles Everyone Is Talking About – A Bold
      // Challenge to the Consensus", which names no film and leaks the writing
      // angle into the headline. A headline with no title in it is the single
      // biggest SEO loss available here, so it is rejected outright.
      if (featuredTitles.length && !namesAFeaturedTitle(title, featuredTitles)) {
        if (!nameless) nameless = { title, excerpt };
        console.warn(`[blog-generator] headline names no featured title: "${title}"`);
        continue;
      }

      return { title, excerpt };
    } catch (error) {
      console.error(`[blog-generator] headline ${model.id}:`, error instanceof Error ? error.message : error);
    }
  }

  // Better a well-formed headline without a title in it than the writer's own.
  return nameless;
}

// ---------------------------------------------------------------------------
// Title matching
// ---------------------------------------------------------------------------

/**
 * Normalizes typographic variants so a title comparison is not defeated by the
 * model swapping in a curly apostrophe or a non-breaking hyphen — it returns
 * "X‑Men ’97" where the fact sheet said "X-Men '97".
 */
function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[‘’ʼ´`]/g, "'")
    .replace(/[‐-―−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

/**
 * Runs the full generation pipeline. Does NOT touch the database, so it can be
 * exercised without DB access; `generateAndPublish` wraps it with persistence.
 */
export async function generateArticle(
  existingSlugs: string[] = [],
  existingTitles: string[] = []
): Promise<{ article: GeneratedArticle | null; reason?: string }> {
  if (!GROQ_API_KEY) return { article: null, reason: 'GROQ_API_KEY is not set' };

  const angle = BLOG_ANGLES[Math.floor(Math.random() * BLOG_ANGLES.length)];

  // Preferred path: a real TMDB story. Falls back to a model-invented topic only
  // when TMDB is unconfigured or every format came back empty.
  const brief = await buildStoryBrief();
  if (!brief) console.warn('[blog-generator] no TMDB story brief available, falling back to invented topic');

  const topic = brief ? brief.topic : await inventTopic(existingTitles, angle);
  const prompt = buildWriterPrompt(topic, angle, existingSlugs, brief);
  const system = `You are an expert entertainment writer producing long-form SEO content about film and television. Write in a ${angle.tone} voice. You always hit the requested structure and length, and you never state a fact you were not given. Return ONLY valid JSON.`;

  let lastReason = 'no writer model produced a valid article';

  for (const model of WRITER_MODELS) {
    try {
      // Two attempts per model. Generation is stochastic and a rejection is
      // usually bad luck rather than an incapable model — a measured run had
      // the 8b fallback return 535 words (below the gate) on one call and 1058
      // on the next. Without this the article for that slot is simply lost.
      let raw: string | null = null;
      let parsed: WriterOutput | null = null;
      let problem: string | null = 'no attempt succeeded';

      for (let attempt = 1; attempt <= 2; attempt++) {
        raw = await callGroq(model, system, prompt);
        if (!raw) {
          problem = 'returned no usable response';
          continue;
        }

        parsed = parseJson<WriterOutput>(raw);
        problem =
          validateWriterOutput(parsed) ||
          (parsed ? checkGrounding(parsed.content, brief) : null) ||
          (parsed && !brief ? checkDomain(parsed.content) : null);

        if (!problem) break;
        console.warn(`[blog-generator] ${model.id} attempt ${attempt} rejected: ${problem}`);
      }

      if (problem || !parsed) {
        lastReason = `${model.id}: ${problem}`;
        continue;
      }

      const words = wordCount(parsed.content);
      let titleEn = parsed.title.trim();
      let excerptEn = parsed.excerpt.trim();

      // With a fact sheet the dedicated headline call always wins — it can name
      // the actual films, which the writer's own title reliably fails to do.
      // Without one it is only a repair step for a headline that failed the checks.
      if (brief || !headlineLooksGood(titleEn, excerptEn)) {
        const written = await writeHeadline(parsed.content, topic, brief?.requiredTitles || []);
        if (written) {
          titleEn = written.title;
          excerptEn = written.excerpt;
        } else if (!headlineLooksGood(titleEn, excerptEn)) {
          console.warn(`[blog-generator] headline call failed, keeping weak original ("${titleEn}")`);
        }
      }

      return {
        article: {
          slug: slugify(parsed.slug) || slugify(titleEn),
          // Written in English, then translated by generateAndPublish. The tr
          // fields mirror the English until that runs, so a translation failure
          // leaves a readable page rather than an empty one.
          title: { en: titleEn, tr: titleEn },
          excerpt: { en: excerptEn, tr: excerptEn },
          content: parsed.content,
          // The brief's category is derived from the TMDB query that produced the
          // story, so it beats the model's guess whenever there is one.
          category: brief?.category || (CATEGORIES.includes(parsed.category) ? parsed.category : 'Entertainment'),
          // Derived from the real body rather than trusting the model's claim.
          readTime: `${Math.max(3, Math.round(words / 200))} min read`,
          tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [],
          coverImage: brief?.coverImage,
          words,
          meta: {
            topic,
            angle: angle.id,
            writerModel: model.id,
            storyFormat: brief?.format || null,
            // The exact film and series names the article is grounded in. The
            // translator needs them verbatim so it copies rather than renders
            // them — "Fall 2: Deadpoint" must not become "Sonbahar 2".
            requiredTitles: brief?.requiredTitles || [],
            sourceRefs: brief?.sourceRefs || [],
          },
        },
      };
    } catch (error) {
      lastReason = error instanceof RateLimitError ? error.message : `${model.id} threw: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[blog-generator] ${lastReason}`);
    }
  }

  return { article: null, reason: lastReason };
}

/** Titles and slugs already published, used for de-duplication. */
async function getPublishedIdentity(limit = 60): Promise<{ slugs: string[]; titles: string[] }> {
  const blogs = await Blog.find().select('slug title').sort({ createdAt: -1 }).limit(limit).lean();
  const rows = blogs as Array<{ slug?: string; title?: { en?: string } }>;
  return {
    slugs: rows.map((b) => b.slug?.toLowerCase() || '').filter(Boolean),
    titles: rows.map((b) => b.title?.en || '').filter(Boolean),
  };
}

/** Guarantees the slug is unique in the collection. */
async function uniqueSlug(candidate: string): Promise<string> {
  const base = candidate || `watchpulse-${Date.now().toString(36)}`;
  if (!(await Blog.exists({ slug: base }))) return base;

  for (let i = 2; i <= 5; i++) {
    const next = `${base}-${i}`;
    if (!(await Blog.exists({ slug: next }))) return next;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Generates one article and saves it as a published post. Returns a result
 * object rather than throwing, so a cron run can always report cleanly.
 */
export async function generateAndPublish(): Promise<GenerationResult> {
  try {
    await connectDB();
    const { slugs, titles } = await getPublishedIdentity(60);
    const { article, reason } = await generateArticle(slugs, titles);

    if (!article) return { ok: false, reason };

    const slug = await uniqueSlug(article.slug);

    // The Turkish side of the same article. A failure here is not a failure of
    // the run: the article is good, so it is published with the English body
    // mirrored into the Turkish fields and can be translated on a later pass.
    const turkish = await translateArticle(
      { title: article.title.en, excerpt: article.excerpt.en, content: article.content },
      'tr',
      article.meta.requiredTitles
    );

    if (!turkish) {
      console.warn(`[blog-generator] "${slug}" published without a Turkish translation`);
    }

    await Blog.create({
      slug,
      title: { en: article.title.en, tr: turkish?.title || article.title.en },
      excerpt: { en: article.excerpt.en, tr: turkish?.excerpt || article.excerpt.en },
      content: article.content,
      contentTr: turkish?.content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: article.readTime,
      category: article.category,
      tags: article.tags,
      coverImage: article.coverImage,
      author: 'WatchPulse Team',
      isPublished: true,
      lang: 'en',
      autoGenerated: true,
      // Kept so repairMissingTranslation can redo the Turkish side later and
      // still copy these names verbatim rather than rendering them.
      sourceTitles: article.meta.requiredTitles,
      // Both editions carry the same names verbatim, so one set of ids serves
      // the English and the Turkish body alike.
      sourceRefs: article.meta.sourceRefs,
    });

    console.log(
      `[blog-generator] published "${slug}" (${article.words} words, ${article.meta.storyFormat || 'no-brief'}, ${article.meta.writerModel}, tr: ${turkish ? 'yes' : 'no'})`
    );

    return {
      ok: true,
      slug,
      title: article.title.en,
      topic: article.meta.topic,
      angle: article.meta.angle,
      format: article.meta.storyFormat,
      category: article.category,
      model: article.meta.writerModel,
      words: article.words,
      translated: Boolean(turkish),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error('[blog-generator] publish failed:', reason);
    return { ok: false, reason };
  }
}

/** How many auto-generated posts were created since midnight UTC. */
export interface RepairResult {
  /** Slug that was repaired, or null when there was nothing to repair. */
  slug: string | null;
  ok: boolean;
}

/**
 * Gives a Turkish side to one article that published without one.
 *
 * A translation failure never blocks publishing — the article goes out with the
 * English text mirrored into the Turkish fields — but without this it would stay
 * that way forever, and a Turkish reader would keep finding an English page at a
 * Turkish URL. Every scheduled run repairs at most one, so a backlog drains at
 * the publishing rate rather than all at once inside a single request.
 *
 * Starts one model along in the translator chain: the fresh article published in
 * the same request has just spent the first model's per-minute budget, and Groq
 * meters those per model.
 */
export async function repairMissingTranslation(): Promise<RepairResult> {
  await connectDB();

  const stale = await Blog.findOne({
    isPublished: true,
    $or: [{ contentTr: { $exists: false } }, { contentTr: { $size: 0 } }],
  })
    .select('slug title excerpt content sourceTitles')
    .sort({ createdAt: -1 })
    .lean();

  if (!stale) return { slug: null, ok: true };

  const doc = stale as unknown as {
    _id: unknown;
    slug: string;
    title: { en: string };
    excerpt: { en: string };
    content: BlogContentBlock[];
    sourceTitles?: string[];
  };

  const turkish = await translateArticle(
    { title: doc.title.en, excerpt: doc.excerpt.en, content: doc.content },
    'tr',
    doc.sourceTitles || [],
    1
  );

  if (!turkish) {
    console.warn(`[blog-generator] could not repair the Turkish side of "${doc.slug}"`);
    return { slug: doc.slug, ok: false };
  }

  await Blog.updateOne(
    { _id: doc._id },
    {
      $set: {
        'title.tr': turkish.title,
        'excerpt.tr': turkish.excerpt,
        contentTr: turkish.content,
      },
    }
  );

  console.log(`[blog-generator] repaired the Turkish side of "${doc.slug}"`);
  return { slug: doc.slug, ok: true };
}

export async function countTodaysAutoPosts(): Promise<number> {
  await connectDB();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  // One counter, not one per language: an article is a single document that
  // both editions serve, so publishing it costs the day's budget exactly once.
  return Blog.countDocuments({ autoGenerated: true, createdAt: { $gte: startOfDay } });
}

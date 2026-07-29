import type { BlogContentBlock } from '@/lib/blog-generator';

/**
 * Turkish translation for a published article.
 *
 * Every article is written once, in English, and then translated — so the two
 * editions carry the same journalism rather than two disjoint archives, and a
 * reader who switches language lands on the piece they were already reading.
 *
 * Two things make this harder than it looks, and both are handled structurally
 * rather than by asking the model nicely:
 *
 *  - The block structure must survive. Rather than asking for translated blocks
 *    and hoping the shape comes back intact, the article is flattened to a list
 *    of plain strings, translated as a list, and reassembled here. A model that
 *    merges two paragraphs changes the array length, which is caught, instead of
 *    silently reshaping the article.
 *
 *  - Film titles must not be translated. Measured: every candidate model turned
 *    "Fall 2: Deadpoint" into "Sonbahar 2: Deadpoint" — a title a Turkish reader
 *    cannot search for. Naming the titles explicitly fixed it in testing, and
 *    the result is verified afterwards rather than trusted.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

interface TranslatorModel {
  id: string;
  /** Prompt + max_tokens is metered against this, so the ceiling is derived from it. */
  tpm: number;
  extra?: Record<string, unknown>;
}

// Measured on a 5,717-character article (35 strings):
//   gpt-oss-120b  3.7s  35/35  titles kept  — best Turkish prose
//   gpt-oss-20b   3.8s  35/35  titles kept  — drifted on facts ("Çekimlere Çıkan")
//   qwen3.6-27b   fails json_validate every time, so it is not in the chain
//
// llama-3.3-70b is last deliberately: it also writes the article body, and by
// the time this runs it has just spent most of its own per-minute budget.
const TRANSLATOR_MODELS: TranslatorModel[] = [
  { id: 'openai/gpt-oss-120b', tpm: 8000, extra: { reasoning_effort: 'low' } },
  { id: 'openai/gpt-oss-20b', tpm: 8000, extra: { reasoning_effort: 'low' } },
  { id: 'llama-3.3-70b-versatile', tpm: 12000 },
];

export type TargetLanguage = 'tr' | 'en';

const SYSTEM: Record<TargetLanguage, string> = {
  tr: `You are a professional Turkish translator specialising in film and television journalism.
You translate English editorial copy into Turkish that reads as though it were written in Turkish, not translated into it.
Return ONLY valid JSON.`,
  en: `You are a professional English translator specialising in film and television journalism.
You translate Turkish editorial copy into English that reads as though it were written in English, not translated into it.
Return ONLY valid JSON.`,
};

const LANGUAGE_RULES: Record<TargetLanguage, string> = {
  tr: `- It must read like Turkish written by a Turkish film writer.
- Grammar and orthography must be perfect. Use ç, ğ, ı, İ, ö, ş, ü correctly.
- Address the reader with "siz", the way a magazine would.
- Use the vocabulary Turkish film writing actually uses. In particular: a "title"
  meaning a film or a series is "yapım" or "film/dizi" — NEVER "başlık", which
  means a heading and reads as a machine translation. "Streaming" is "yayın
  platformu" or the platform's own name, not "yayın akışı", which is broadcast
  scheduling. "Show" meaning a series is "dizi", not "şov". "Release date" is
  "vizyon tarihi" for films and "yayın tarihi" for series.
- Do not translate an English idiom word for word. If it has no Turkish
  equivalent, write what it means.`,
  en: `- It must read like English written by a British film writer, not like a translation.
- Grammar and punctuation must be perfect. No Turkish characters anywhere in the output.
- Address the reader as "you", the way a magazine would.`,
};

export interface TranslatableArticle {
  title: string;
  excerpt: string;
  content: BlogContentBlock[];
}

/**
 * Flattens an article to the strings a translator should see, and remembers
 * enough to put it back together. List blocks contribute one string per item, so
 * a five-item list comes back as five items rather than one run-on paragraph.
 */
function flatten(article: TranslatableArticle): { items: string[]; shape: Array<number | null> } {
  const items: string[] = [article.title, article.excerpt];
  // null marks a scalar block; a number is the item count of a list block.
  const shape: Array<number | null> = [];

  for (const block of article.content) {
    if (Array.isArray(block.content)) {
      shape.push(block.content.length);
      items.push(...block.content);
    } else {
      shape.push(null);
      items.push(block.content);
    }
  }

  return { items, shape };
}

function rebuild(
  article: TranslatableArticle,
  items: string[],
  shape: Array<number | null>
): TranslatableArticle {
  const [title, excerpt] = items;
  let cursor = 2;

  const content = article.content.map((block, i) => {
    const listLength = shape[i];
    if (listLength === null) return { type: block.type, content: items[cursor++] };
    const slice = items.slice(cursor, cursor + listLength);
    cursor += listLength;
    return { type: block.type, content: slice };
  });

  return { title, excerpt, content };
}

/** Groq's own count is close to characters/3.6 on this mixed English/JSON input. */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.6);
}

function buildPrompt(items: string[], protectedNames: string[], target: TargetLanguage): string {
  const language = target === 'tr' ? 'Turkish' : 'English';
  const protectedBlock = protectedNames.length
    ? `\nPROTECTED NAMES — copy these character for character wherever they appear. They are titles, not words; translating one makes it unsearchable:\n${protectedNames.map((n) => `  ${n}`).join('\n')}\nAny other film, series, brand or platform name is protected too, even if it is not listed.\n`
    : `\nFilm, series, brand and platform names are protected: copy them character for character. Never invent a ${language} name for a title.\n`;

  return `Translate every string in the "items" array below into ${language}.

RULES:
- Return exactly ${items.length} strings, in the same order, as {"items": [...]}.
- Translate meaning, not words.
${LANGUAGE_RULES[target]}
- Do not add, drop, merge or split strings. Do not add commentary.
- Do not change any fact, date, number or name.
${protectedBlock}
{"items": ${JSON.stringify(items)}}`;
}

/** Rejects a translation that came back the wrong shape, empty, or untranslated. */
function validate(
  items: unknown,
  expected: number,
  protectedNames: string[],
  target: TargetLanguage
): string | null {
  if (!Array.isArray(items)) return 'response had no items array';
  if (items.length !== expected) return `returned ${items.length} strings, expected ${expected}`;
  if (items.some((s) => typeof s !== 'string' || !s.trim())) return 'contained an empty string';

  const joined = items.join(' ');

  // Turkish-only characters are the cheapest signal that the model translated
  // rather than echoed. Prose of this length always has plenty of them; English
  // prose of this length should have none.
  const turkishChars = (joined.match(/[ğşıİĞŞçöüÇÖÜ]/g) || []).length;
  if (target === 'tr' && turkishChars < Math.max(10, Math.floor(joined.length / 400))) {
    return `does not look like Turkish (${turkishChars} Turkish characters in ${joined.length})`;
  }
  if (target === 'en' && turkishChars > Math.max(4, Math.floor(joined.length / 2000))) {
    return `still contains Turkish (${turkishChars} Turkish characters)`;
  }

  const lost = protectedNames.filter((n) => !joined.includes(n));
  if (lost.length) return `translated protected titles: ${lost.join(', ')}`;

  if (target === 'tr') {
    const tell = MISTRANSLATIONS.find((phrase) => joined.toLowerCase().includes(phrase));
    if (tell) return `word-for-word translation ("${tell}")`;
  }

  return null;
}

/**
 * Phrases that only appear when the model translated the words instead of the
 * meaning. Each was published before it was caught:
 *
 *   "yayın akışı"  — literally "broadcast flow", i.e. a TV schedule. It is what
 *                    you get by translating "streaming" a word at a time, and a
 *                    Turkish reader parses it as the opposite of what it means.
 *   "şov"          — a transliteration of "show". Turkish for a series is
 *                    "dizi"; "şov" is a stage performance.
 *
 * Deliberately short, and deliberately not including "başlık" — that one really
 * is the word for a heading, so it cannot be rejected on sight even though it is
 * wrong for "title" meaning a film. The prompt handles that; this catches only
 * what is unambiguous, because a false rejection costs the article its Turkish
 * side until the repair pass comes round.
 */
const MISTRANSLATIONS = ['yayın akışı', 'yayın akışında', ' şov '];

async function callTranslator(
  model: TranslatorModel,
  prompt: string,
  maxTokens: number,
  target: TargetLanguage
): Promise<unknown | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          { role: 'system', content: SYSTEM[target] },
          { role: 'user', content: prompt },
        ],
        // Low, unlike the writer: this is a faithful rendering, not composition.
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        ...model.extra,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error(`[blog-translate] ${model.id} -> HTTP ${response.status}`, detail.slice(0, 200));
      return null;
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      console.error(`[blog-translate] ${model.id} returned unparseable JSON`);
      return null;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[blog-translate] ${model.id} timed out after 25s`);
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Translates one article into Turkish, or returns null if no model produced an
 * acceptable result. Null is not fatal: the caller publishes the English side
 * and the Turkish side can be filled in later.
 */
export async function translateArticle(
  article: TranslatableArticle,
  target: TargetLanguage,
  protectedNames: string[] = [],
  // Which model in the chain to start from. Groq meters tokens per model, so a
  // second translation in the same minute — the repair pass running alongside a
  // fresh publish — has a full budget of its own if it starts one model along
  // instead of queueing behind the first.
  modelOffset = 0
): Promise<TranslatableArticle | null> {
  if (!process.env.GROQ_API_KEY) {
    console.error('[blog-translate] GROQ_API_KEY is not set');
    return null;
  }

  const { items, shape } = flatten(article);
  if (!items.length) return null;

  const prompt = buildPrompt(items, protectedNames, target);
  const promptTokens = estimateTokens(SYSTEM[target] + prompt);

  // Turkish runs slightly longer than the English it came from; measured
  // completion was 1.04x the prompt, so 1.4x is headroom rather than a guess.
  const wanted = Math.ceil(promptTokens * 1.4);

  // Rotated rather than sliced, so a caller starting at the second model still
  // falls back to the first — it is the best of the three and by the time the
  // chain reaches it its budget has usually recovered.
  const chain = TRANSLATOR_MODELS.map(
    (_, i) => TRANSLATOR_MODELS[(i + modelOffset) % TRANSLATOR_MODELS.length]
  );

  for (const model of chain) {
    // Groq meters prompt + max_tokens against the per-minute limit, so asking
    // for more than the remainder fails with 413 before generating anything.
    const ceiling = model.tpm - promptTokens - 250;
    if (ceiling < 800) {
      console.warn(`[blog-translate] article too long for ${model.id} (needs ${promptTokens} prompt tokens)`);
      continue;
    }

    const maxTokens = Math.min(wanted, ceiling);

    // Two attempts: JSON mode rejects the occasional malformed generation, and
    // the protected-title check is the kind of miss a resample usually fixes.
    for (let attempt = 1; attempt <= 2; attempt++) {
      const parsed = (await callTranslator(model, prompt, maxTokens, target)) as { items?: unknown } | null;
      if (!parsed) continue;

      const problem = validate(parsed.items, items.length, protectedNames, target);
      if (problem) {
        console.warn(`[blog-translate] ${model.id} attempt ${attempt} rejected: ${problem}`);
        continue;
      }

      const translated = (parsed.items as string[]).map((s) => s.trim());
      console.log(`[blog-translate] ${items.length} strings -> ${target} with ${model.id}`);
      return rebuild(article, translated, shape);
    }
  }

  console.error('[blog-translate] no model produced an acceptable translation');
  return null;
}

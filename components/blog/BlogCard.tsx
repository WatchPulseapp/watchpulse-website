import Link from 'next/link';

export interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage?: string;
  /** The lead story: a wide, image-forward treatment carrying the gold marker. */
  featured?: boolean;
}

/** Category eyebrow. Gold marks the lead story, accent marks everything else. */
function Eyebrow({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span className="journal-eyebrow" style={{ color: gold ? 'var(--marquee)' : 'var(--accent)' }}>
      {children}
    </span>
  );
}

/**
 * A single run of small text rather than a row of icons — clock and calendar
 * glyphs at 13px are noise on a card whose only job is to sell the headline.
 */
function Meta({ date, readTime }: { date: string; readTime: string }) {
  return (
    <p className="journal-meta flex items-center gap-2">
      {date && <span>{date}</span>}
      {date && readTime && (
        <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>
          ·
        </span>
      )}
      {readTime && <span>{readTime}</span>}
    </p>
  );
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readTime,
  coverImage,
  featured,
}: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group block">
        <article className="journal-card grid overflow-hidden rounded-2xl md:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]">
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt=""
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--marquee-soft))' }}
              />
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 p-7 sm:p-9 md:p-10">
            <div className="flex items-center gap-3">
              <Eyebrow gold>Lead story</Eyebrow>
              <span aria-hidden="true" className="h-px w-6" style={{ background: 'var(--marquee)' }} />
              <Eyebrow>{category}</Eyebrow>
            </div>

            <h2 className="journal-headline text-[1.6rem] leading-[1.2] sm:text-[1.9rem]">{title}</h2>

            <p
              className="line-clamp-3 text-[15px] leading-[1.65]"
              style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {excerpt}
            </p>

            <Meta date={date} readTime={readTime} />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article className="journal-card flex h-full flex-col overflow-hidden rounded-xl">
        {coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-6">
          <Eyebrow>{category}</Eyebrow>

          <h3 className="journal-headline text-[1.1875rem] leading-[1.3]">{title}</h3>

          <p
            className="line-clamp-2 flex-1 text-[14.5px] leading-[1.6]"
            style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {excerpt}
          </p>

          <div className="mt-1 border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
            <Meta date={date} readTime={readTime} />
          </div>
        </div>
      </article>
    </Link>
  );
}

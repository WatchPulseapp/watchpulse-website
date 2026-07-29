'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Locale } from '@/lib/blog-locale';
import { strings } from '@/lib/blog-i18n';

/**
 * The trailers an article is about, playable.
 *
 * The generator has always fetched real trailer keys — the writer is handed the
 * video's name and how recently it went up — and then the finished article
 * described a trailer the reader could not watch. Showing them is the obvious
 * thing, and it is also what earns VideoObject markup, which the article page
 * emits alongside this.
 *
 * Nothing from YouTube loads until someone asks for it. An embedded iframe
 * pulls close to a megabyte of player code, and seven of them on one article
 * would cost more than the rest of the page put together — on a roundup where
 * most readers will play one trailer, or none. Until a click, this is a
 * thumbnail and a button.
 */

export interface ArticleVideo {
  youtubeKey: string;
  videoName: string;
  titleName: string;
  publishedAt?: string;
}

function Trailer({ video, locale }: { video: ArticleVideo; locale: Locale }) {
  const [playing, setPlaying] = useState(false);
  const t = strings(locale);

  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ aspectRatio: '16 / 9', backgroundColor: 'var(--card)' }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeKey}?autoplay=1&rel=0`}
            title={`${video.titleName} — ${video.videoName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t.playTrailer(video.titleName)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* hqdefault exists for every video; maxresdefault does not, and a
                missing one renders as a grey placeholder. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.youtubeKey}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/65 backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
            </span>
          </button>
        )}
      </div>

      <figcaption className="journal-meta mt-2.5">
        {video.titleName} — {video.videoName}
      </figcaption>
    </figure>
  );
}

export default function TrailerStrip({
  videos,
  locale = 'en',
}: {
  videos: ArticleVideo[];
  locale?: Locale;
}) {
  if (videos.length === 0) return null;
  const t = strings(locale);

  return (
    <section className="mt-14 border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
      <h2 className="journal-headline text-[1.3rem] leading-[1.3] sm:text-[1.45rem]">{t.watchTrailers}</h2>
      <div className="mt-6 grid gap-7 sm:grid-cols-2">
        {videos.map((video) => (
          <Trailer key={video.youtubeKey} video={video} locale={locale} />
        ))}
      </div>
    </section>
  );
}

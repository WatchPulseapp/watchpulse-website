'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * The social half of the landing page: matching, posts, chat.
 *
 * The three mock-ups are drawn from the app's own widgets rather than invented
 * for the web — a visitor who installs after seeing this should recognise what
 * they are looking at. Every measurement below has a source:
 *
 *   match card   widgets/matching_tab.dart — 24px radius, hairline border, the
 *                score carried by a ring sweeping around the avatar over 900ms
 *                with no percentage printed anywhere, name at 22/800/-0.5, the
 *                tier in small caps at 2.4 letter-spacing, outline-only genre
 *                chips at radius 14, insights joined with a spaced middot.
 *   post card    screens/social_screen.dart — not a card at all: a flat row
 *                with a 0.5px bottom rule, the title in the accent colour at
 *                12.5/600 followed by " · " and the post type.
 *   chat         screens/chat_screen.dart — bubbles at 18/18/18/4 outgoing and
 *                18/18/4/18 incoming, so the tail sits on the sender's side;
 *                voice notes with a 38px round play button and 3px waveform
 *                bars 2.5px apart; the typing dots on a 1200ms loop where each
 *                dot rises and brightens for 400ms, staggered by a third.
 *
 * The films are real records — the poster paths come from TMDB, so the tiles
 * show the actual artwork rather than grey boxes.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * The app's icons, not lookalikes.
 *
 * Flutter draws Material Symbols in the rounded style — favorite_rounded,
 * chat_bubble_outline_rounded, repeat_rounded, done_all_rounded and so on. A
 * generic icon set gets close enough to look deliberate and wrong enough that
 * someone arriving from the site notices the app is not the thing they saw.
 * These are the official path data at Google's own 0 -960 960 960 viewBox, so
 * every curve is the one the app renders.
 */
const ICONS = {
  favorite:
    'M451.5-152q-14.5-5-25.5-16l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5q-14 0-28.5-5Z',
  favoriteBorder:
    'M451.5-152q-14.5-5-25.5-16l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5q-14 0-28.5-5ZM442-690q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z',
  chatBubbleOutline:
    'm240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm-34-80h594v-480H160v525l46-45Zm-46 0v-480 480Z',
  repeat:
    'm274-200 34 34q12 12 11.5 28T308-110q-12 12-28.5 12.5T251-109L148-212q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l103-103q12-12 28.5-11.5T308-370q11 12 11.5 28T308-314l-34 34h406v-120q0-17 11.5-28.5T720-440q17 0 28.5 11.5T760-400v120q0 33-23.5 56.5T680-200H274Zm412-480H280v120q0 17-11.5 28.5T240-520q-17 0-28.5-11.5T200-560v-120q0-33 23.5-56.5T280-760h406l-34-34q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T709-851l103 103q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L709-589q-12 12-28.5 11.5T652-590q-11-12-11.5-28t11.5-28l34-34Z',
  bookmarkBorder:
    'm480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Zm0-88 200 86v-518H280v518l200-86Zm0-432H280h400-200Z',
  playArrow:
    'M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z',
  doneAll:
    'M70-438q-12-12-11.5-28T71-494q12-11 28-11.5t28 11.5l142 142 14 14 14 14q12 12 11.5 28T296-268q-12 11-28 11.5T240-268L70-438Zm424 85 340-340q12-12 28-11.5t28 12.5q11 12 11.5 28T890-636L522-268q-12 12-28 12t-28-12L296-438q-11-11-11-27.5t11-28.5q12-12 28.5-12t28.5 12l141 141Zm169-282L522-494q-11 11-27.5 11T466-494q-12-12-12-28.5t12-28.5l141-141q11-11 27.5-11t28.5 11q12 12 12 28.5T663-635Z',
  personAdd:
    'M720-520h-80q-17 0-28.5-11.5T600-560q0-17 11.5-28.5T640-600h80v-80q0-17 11.5-28.5T760-720q17 0 28.5 11.5T800-680v80h80q17 0 28.5 11.5T920-560q0 17-11.5 28.5T880-520h-80v80q0 17-11.5 28.5T760-400q-17 0-28.5-11.5T720-440v-80Zm-473-7q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Z',
  forum:
    'M840-136q-8 0-15-3t-13-9l-92-92H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v463q0 18-12 29.5T840-136ZM120-336q-16 0-28-11.5T80-377v-423q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240l-92 92q-6 6-13 9t-15 3Z',
} as const;

/** Renders a Material Symbol at the viewBox Google ships it in. */
function Icon({ path, className, style }: { path: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 -960 960 960" className={className} style={style} aria-hidden="true" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

const CARDS = [
  // The same symbols the app uses for these surfaces.
  { key: 'match', path: ICONS.favorite },
  { key: 'chat', path: ICONS.forum },
  { key: 'posts', path: ICONS.chatBubbleOutline },
  { key: 'follow', path: ICONS.personAdd },
] as const;

const POSTER = 'https://image.tmdb.org/t/p/w185';

/** Real TMDB records, so the posters are the real artwork. */
const SHARED = [
  { path: '/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg', title: 'Cinema Paradiso' },
  { path: '/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', title: 'Peaky Blinders' },
  { path: '/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', title: 'Interstellar' },
  { path: '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', title: 'Dark' },
  { path: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg', title: 'Whiplash' },
];

/**
 * The app's own fallback amplitude pattern, trimmed to what fits the bubble.
 * Bars are 3px wide with a 2.5px gap and rounded caps, as _WaveformPainter
 * draws them; played bars sit at 85% opacity against 20% for the rest.
 */
const WAVE = [
  0.22, 0.38, 0.52, 0.68, 0.42, 0.82, 0.58, 0.92, 0.48, 0.78, 0.95, 0.62,
  0.88, 0.52, 0.72, 0.42, 0.85, 0.58, 0.92, 0.68, 0.48, 0.78, 0.38, 0.62,
  0.52, 0.72, 0.32, 0.55,
];

/** Fraction of the voice note already played, mirrored in the bar colours. */
const PLAYED = 0.42;

function Waveform() {
  return (
    <span className="flex h-[34px] flex-1 items-center gap-[2.5px]" aria-hidden="true">
      {WAVE.map((amplitude, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-full"
          style={{
            height: `${Math.max(3, amplitude * 30)}px`,
            backgroundColor: i / WAVE.length < PLAYED ? 'rgba(240,242,245,0.85)' : 'rgba(240,242,245,0.2)',
          }}
        />
      ))}
    </span>
  );
}

/**
 * Three dots on a 1200ms loop. Each rises by 70% of its own size and brightens
 * from 0.45 to 1 over 400ms, then waits 800ms — staggered by 400ms so one is
 * always in flight. That is the triangle wave _TypingDots runs, expressed as
 * keyframes.
 */
function TypingDots({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[5px] w-[5px] rounded-full bg-brand-light"
          animate={reduceMotion ? { opacity: 0.7 } : { y: [0, -3.5, 0], opacity: [0.45, 1, 0.45] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 0.4, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 0.8, delay: i * 0.4, ease: 'linear' }
          }
        />
      ))}
    </span>
  );
}

function MockLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
      {children}
    </p>
  );
}

export default function SocialBand() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const shellClass =
    'rounded-3xl border border-[#F0F2F5]/[0.06] bg-background-card p-5 shadow-card h-full';

  return (
    <section
      id="social"
      className="relative py-20 md:py-28 bg-background-dark/60 border-y border-white/5 scroll-mt-16 overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-brand-primary/8 rounded-full blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Heading */}
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <p className="eyebrow mb-3">{t('social.eyebrow')}</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] text-text-primary mb-5">
            {t('social.title')}
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">{t('social.desc')}</p>
        </motion.div>

        {/* The three surfaces, as the app draws them */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* ---- Match suggestion ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <MockLabel>{t('socialDemo.matchLabel')}</MockLabel>
            <div className={`${shellClass} flex flex-col items-center text-center`}>
              {/* Avatar in the score ring. The ring is the score; no number is
                  printed, exactly as the app has it. */}
              <div className="relative h-[104px] w-[104px]">
                <svg viewBox="0 0 104 104" className="absolute inset-0 -rotate-90" aria-hidden="true">
                  <circle cx="52" cy="52" r="50" fill="none" stroke="rgba(240,242,245,0.07)" strokeWidth="2.5" />
                  <motion.circle
                    cx="52"
                    cy="52"
                    r="50"
                    fill="none"
                    stroke="#6B7FD7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.92) }}
                    viewport={{ once: true }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: easeOut }}
                  />
                </svg>
                <span className="absolute inset-[9px] grid place-items-center rounded-full bg-gradient-hero text-2xl font-bold text-white">
                  E
                </span>
              </div>

              <p className="mt-3.5 text-[22px] font-extrabold tracking-[-0.5px] text-text-primary">
                {t('socialDemo.matchName')}
              </p>
              <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[2.4px] text-brand-primary/80">
                {t('socialDemo.matchTier')}
              </p>

              <p className="mt-2.5 text-xs text-text-primary/55">{t('socialDemo.matchMutual')}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {(['g1', 'g2', 'g3'] as const).map((g) => (
                  <span
                    key={g}
                    className="rounded-[14px] border border-[#F0F2F5]/10 px-2.5 py-[5px] text-[11px] text-text-primary/50"
                  >
                    {t(`socialDemo.${g}`)}
                  </span>
                ))}
              </div>

              <p className="mt-2.5 text-[11px] text-text-primary/35">{t('socialDemo.matchInsight')}</p>

              {/* Hairline label, then one fixed row of posters. */}
              <div className="mt-4 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-[#F0F2F5]/[0.06]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-primary/35">
                  {t('socialDemo.sharedLabel')}
                </span>
                <span className="h-px flex-1 bg-[#F0F2F5]/[0.06]" />
              </div>
              {/* A grid, not a flex row. As flex children each poster carried
                  w-full and so claimed the whole track, and five of those
                  escaped the card and covered the two beside it — invisible to
                  a page-level overflow check, because the section clips. Five
                  equal columns cannot do that. */}
              <div className="mt-3 grid w-full grid-cols-5 gap-1.5">
                {SHARED.map((s) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={s.path}
                    src={`${POSTER}${s.path}`}
                    alt={s.title}
                    loading="lazy"
                    className="aspect-[2/3] w-full rounded-md object-cover"
                    style={{ backgroundColor: 'rgba(240,242,245,0.04)' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ---- Post ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.08 }}
          >
            <MockLabel>{t('socialDemo.postLabel')}</MockLabel>
            <div className={shellClass}>
              {/* Two posts separated by the 0.5px rule the feed uses — the app
                  has no rounded card per post, just the divider. */}
              <article className="border-b border-[#F0F2F5]/[0.06] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-hero text-xs font-bold text-white">
                    B
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-text-primary">
                      {t('socialDemo.post1User')}{' '}
                      <span className="font-normal text-text-primary/30">· {t('socialDemo.post1Time')}</span>
                    </p>
                    <p className="truncate text-[12.5px]">
                      <span className="font-semibold text-brand-primary">Whiplash</span>
                      <span className="text-text-primary/30"> · {t('socialDemo.post1Type')}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-text-primary/90">
                  {t('socialDemo.post1Body')}
                </p>
                {/* The feed's action row: liked posts fill the heart in the
                    accent colour, the rest sit at 35% — as social_screen does. */}
                <div className="mt-3 flex items-center gap-5 text-text-primary/35">
                  <span className="flex items-center gap-1.5 text-[12px] text-brand-primary">
                    <Icon path={ICONS.favorite} className="h-[18px] w-[18px]" />
                    128
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px]">
                    <Icon path={ICONS.chatBubbleOutline} className="h-[17px] w-[17px]" />
                    24
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px]">
                    <Icon path={ICONS.repeat} className="h-[18px] w-[18px]" />9
                  </span>
                  <span className="ml-auto">
                    <Icon path={ICONS.bookmarkBorder} className="h-[18px] w-[18px]" />
                  </span>
                </div>
              </article>

              {/* A poll — options with a live bar, which is how votePoll renders. */}
              <article className="pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-hero text-xs font-bold text-white">
                    D
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-text-primary">
                      {t('socialDemo.post2User')}{' '}
                      <span className="font-normal text-text-primary/30">· {t('socialDemo.post2Time')}</span>
                    </p>
                    <p className="truncate text-[12.5px]">
                      <span className="font-semibold text-brand-primary">Dark</span>
                      <span className="text-text-primary/30"> · {t('socialDemo.post2Type')}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-text-primary/90">
                  {t('socialDemo.post2Body')}
                </p>
                <div className="mt-3 space-y-2">
                  {([
                    ['opt1', 61],
                    ['opt2', 39],
                  ] as const).map(([key, pct]) => (
                    <div
                      key={key}
                      className="relative overflow-hidden rounded-[10px] border border-[#F0F2F5]/[0.06] px-3 py-2"
                    >
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-brand-primary/20"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: easeOut, delay: 0.2 }}
                        aria-hidden="true"
                      />
                      <span className="relative flex justify-between text-[13px] text-text-primary/85">
                        <span>{t(`socialDemo.${key}`)}</span>
                        <span className="tabular-nums text-text-primary/50">%{pct}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-text-primary/35">{t('socialDemo.pollMeta')}</p>
              </article>
            </div>
          </motion.div>

          {/* ---- Chat ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.16 }}
          >
            <MockLabel>{t('socialDemo.chatLabel')}</MockLabel>
            <div className={`${shellClass} flex flex-col`}>
              {/* Header. The subtitle is the online state OR the compatibility
                  line — the app shows one or the other, never both. */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-hero text-sm font-bold text-white">
                  E
                  <span
                    className="absolute bottom-0 right-0 h-[10px] w-[10px] rounded-full border-2 border-background-card"
                    style={{ backgroundColor: '#4CAF50' }}
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight text-text-primary">
                    {t('social.chatDemo.name')}
                  </p>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-light">
                    {t('social.chatDemo.typing')}
                    <TypingDots reduceMotion={reduceMotion} />
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2.5 py-4">
                {/* Incoming: tail bottom-left (18/18/4/18). */}
                <div
                  className="max-w-[85%] self-start bg-[#F0F2F5]/[0.06] px-3.5 py-2 text-[14.5px] text-text-primary"
                  style={{ borderRadius: '18px 18px 18px 4px' }}
                >
                  {t('social.chatDemo.msg1')}
                </div>

                {/* Outgoing: tail bottom-right (18/18/18/4), primary at 80%. */}
                <div
                  className="max-w-[85%] self-end px-3.5 py-2 text-[14.5px] text-white"
                  style={{ borderRadius: '18px 18px 4px 18px', backgroundColor: 'rgba(107,127,215,0.8)' }}
                >
                  {t('social.chatDemo.msg2')}
                  <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/70">
                    14:32
                    {/* Read: done_all_rounded in #4FC3F7, the app's exact tick. */}
                    <Icon path={ICONS.doneAll} className="h-[15px] w-[15px]" style={{ color: '#4FC3F7' }} />
                  </span>
                </div>

                {/* Voice note: 38px round play button, waveform, mm:ss. */}
                <div
                  className="flex max-w-[85%] items-center gap-2.5 self-end px-3 py-2"
                  style={{ borderRadius: '18px 18px 4px 18px', backgroundColor: 'rgba(107,127,215,0.8)' }}
                >
                  <span
                    className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: 'rgba(240,242,245,0.2)' }}
                  >
                    <Icon path={ICONS.playArrow} className="h-[22px] w-[22px] text-white" />
                  </span>
                  <Waveform />
                  <span className="shrink-0 text-[11px] tabular-nums text-white/80">0:07</span>
                </div>

                <div
                  className="max-w-[85%] self-start bg-[#F0F2F5]/[0.06] px-3.5 py-2 text-[14.5px] text-text-primary"
                  style={{ borderRadius: '18px 18px 18px 4px' }}
                >
                  {t('social.chatDemo.msg3')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* What each of those is */}
        <div className="mt-14 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {CARDS.map(({ key, path }, i) => (
            <motion.div
              key={key}
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.06 }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-light">
                <Icon path={path} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="mb-1.5 font-semibold text-text-primary">{t(`social.${key}.title`)}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{t(`social.${key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

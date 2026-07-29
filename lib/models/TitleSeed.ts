import mongoose, { Schema, Document } from 'mongoose';

/**
 * A film or series the site has decided to publish a page for.
 *
 * The /movie/[id] and /tv/[id] routes will render anything TMDB knows about, so
 * nothing here creates a page — the pages already exist for every id in the
 * world. What this records is which ones the site *claims*: which appear in the
 * sitemap and get submitted to IndexNow. Without a list of those, the only title
 * pages a crawler ever hears about are the handful the articles happen to name.
 *
 * Kept deliberately small. The page itself is rendered from live TMDB data at
 * request time, so mirroring the record here would only give it a second copy to
 * go stale. The name and popularity are stored for reporting, not for rendering.
 */
export interface ITitleSeed extends Document {
  tmdbId: number;
  type: 'movie' | 'tv';
  name: string;
  /** TMDB popularity at the moment it was seeded. Diagnostics only. */
  popularity: number;
  /** Which TMDB query surfaced it, so a bad source can be traced and dropped. */
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const TitleSeedSchema = new Schema<ITitleSeed>(
  {
    tmdbId: { type: Number, required: true },
    type: { type: String, enum: ['movie', 'tv'], required: true },
    name: { type: String, required: true },
    popularity: { type: Number, default: 0 },
    source: { type: String, default: 'unknown' },
  },
  { timestamps: true }
);

// A title reaches the seeder from several queries at once — trending this week
// is also popular this week — and it gets one page either way.
TitleSeedSchema.index({ tmdbId: 1, type: 1 }, { unique: true });
// The sitemap reads these newest-first and the seeder counts them.
TitleSeedSchema.index({ createdAt: -1 });

export default mongoose.models.TitleSeed ||
  mongoose.model<ITitleSeed>('TitleSeed', TitleSeedSchema, 'titleseeds');

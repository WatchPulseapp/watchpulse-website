import mongoose, { Schema, Document } from 'mongoose';

/**
 * One record per automated blog generation attempt.
 *
 * Without this, a failed run leaves no trace anywhere the operator can see —
 * the reason only reaches the HTTP response the scheduler throws away and the
 * server log, which nobody is watching at 06:17. Persisting every attempt is
 * what makes "did today's five articles actually publish?" an
 * answerable question.
 */
export interface IBlogRun extends Document {
  ok: boolean;
  /** Populated on success. */
  slug?: string;
  title?: string;
  format?: string;
  words?: number;
  writerModel?: string;
  /** Populated on failure — the reason the attempt produced nothing. */
  reason?: string;
  /** True when the daily cap was already reached and nothing was attempted. */
  skipped: boolean;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogRunSchema = new Schema<IBlogRun>(
  {
    ok: { type: Boolean, required: true },
    slug: String,
    title: String,
    format: String,
    words: Number,
    writerModel: String,
    reason: String,
    skipped: { type: Boolean, default: false },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogRunSchema.index({ createdAt: -1 });
BlogRunSchema.index({ ok: 1, createdAt: -1 });

// Roughly 5 runs a day means ~1,800 records a year; 90 days is plenty of history
// for spotting a problem and keeps the collection from growing without bound.
BlogRunSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.models.BlogRun || mongoose.model<IBlogRun>('BlogRun', BlogRunSchema, 'blogruns');

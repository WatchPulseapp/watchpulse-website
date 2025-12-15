import mongoose, { Schema, Model } from 'mongoose';

export interface IWaitlist {
  email: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

const WaitlistSchema = new Schema<IWaitlist>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip: {
      type: String,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      default: 'unknown',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Waitlist: Model<IWaitlist> =
  mongoose.models.Waitlist || mongoose.model<IWaitlist>('Waitlist', WaitlistSchema);

export default Waitlist;

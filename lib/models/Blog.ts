import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  content: string | string[];
}

export interface IBlog extends Document {
  slug: string;
  title: {
    en: string;
    tr: string;
  };
  excerpt: {
    en: string;
    tr: string;
  };
  content: IBlogContent[];
  date: string;
  readTime: string;
  category: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogContentSchema = new Schema({
  type: {
    type: String,
    enum: ['paragraph', 'heading', 'list', 'quote'],
    required: true
  },
  content: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const BlogSchema = new Schema<IBlog>({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    en: { type: String, required: true },
    tr: { type: String, required: true }
  },
  excerpt: {
    en: { type: String, required: true },
    tr: { type: String, required: true }
  },
  content: [BlogContentSchema],
  date: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'WatchPulse Team'
  },
  tags: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance (slug index already defined via unique: true)
BlogSchema.index({ category: 1 });
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ createdAt: -1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

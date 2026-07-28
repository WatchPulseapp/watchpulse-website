import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  role: string;
  displayName: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true },
  role: { type: String, default: 'user' },
  displayName: { type: String, default: '' },
}, { strict: false });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

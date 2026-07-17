import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  avatar: string;
  createdAt: Date;
}

const ProfileSchema: Schema = new Schema({
  name: { type: String, required: true, enum: ['Chung', 'Trang'] },
  avatar: { type: String, required: true },
}, {
  timestamps: true,
  collection: 'profiles'
});

export const ProfileModel = mongoose.model<IProfile>('Profile', ProfileSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  owner: mongoose.Types.ObjectId;
  darkMode: boolean;
  sound: boolean;
  animation: boolean;
  language: string;
}

const SettingSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Profile', required: true, unique: true },
  darkMode: { type: Boolean, default: false },
  sound: { type: Boolean, default: true },
  animation: { type: Boolean, default: true },
  language: { type: String, default: 'en', enum: ['en', 'vi'] },
}, {
  timestamps: true,
  collection: 'settings'
});

export const SettingModel = mongoose.model<ISetting>('Setting', SettingSchema);

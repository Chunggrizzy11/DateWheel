import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string;
  color: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
}, {
  timestamps: true,
  collection: 'categories'
});

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);

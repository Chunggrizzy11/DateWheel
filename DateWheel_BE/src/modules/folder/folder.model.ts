import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const FolderSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, {
  timestamps: true,
  collection: 'folders'
});

export const FolderModel = mongoose.model<IFolder>('Folder', FolderSchema);

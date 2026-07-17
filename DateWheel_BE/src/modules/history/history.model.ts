import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  category: mongoose.Types.ObjectId;
  mode: string;
  owner: mongoose.Types.ObjectId;
  candidates: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  mode: { type: String, required: true, enum: ['random', 'weighted', 'no_repeat'] },
  owner: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  candidates: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, {
  timestamps: true,
  collection: 'spin_histories'
});

export const HistoryModel = mongoose.model<IHistory>('History', HistorySchema);

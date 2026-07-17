import { Category } from './category';
import { SpinMode } from './wheel';

export interface SpinHistory {
  _id: string;
  category: Category;
  mode: SpinMode;
  owner: string;
  candidates: string[];
  createdAt: string;
}

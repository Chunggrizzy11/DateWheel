import { Category } from './category';

export type SpinMode = 'random' | 'weighted' | 'no_repeat';

export interface SpinRequest {
  owner: string;
  mode: SpinMode;
  categoryIds: string[];
}

export interface SpinResult {
  winner: Category;
  mode: SpinMode;
  candidates: string[];
  historyId: string;
}

import { ICategory } from '../category/category.model';

export const pickWinner = (categories: ICategory[], mode: 'random' | 'weighted' | 'no_repeat'): ICategory => {
  if (categories.length === 0) {
    throw new Error('No categories to pick from');
  }

  if (categories.length === 1) {
    return categories[0];
  }

  // 'random', 'weighted', or 'no_repeat' will just pick randomly from the provided list
  // The filtering for 'no_repeat' is handled BEFORE calling this algorithm
  // Note: categories don't have weights currently, so weighted falls back to random.
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
};

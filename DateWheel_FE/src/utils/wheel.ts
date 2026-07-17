import { Category } from '../types/category';
import { SpinMode } from '../types/wheel';

export function pickWinner(categories: Category[], mode: SpinMode): Category {
  if (categories.length === 0) throw new Error('No categories to pick from');
  if (categories.length === 1) return categories[0];

  // All modes use simple random pick for categories
  const index = Math.floor(Math.random() * categories.length);
  return categories[index];
}

export function getWheelAngle(totalCategories: number, winnerIndex: number): number {
  const segmentAngle = 360 / totalCategories;
  // Spin multiple full rotations + land on winner
  const fullRotations = 5 + Math.random() * 3; // 5-8 full rotations
  const targetAngle = 360 - (winnerIndex * segmentAngle + segmentAngle / 2);
  return fullRotations * 360 + targetAngle;
}

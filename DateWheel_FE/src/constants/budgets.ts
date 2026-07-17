export const BUDGET_RANGES = [
  { label: 'Under 50K', min: 0, max: 50000 },
  { label: '50K - 100K', min: 50000, max: 100000 },
  { label: '100K - 200K', min: 100000, max: 200000 },
  { label: '200K - 500K', min: 200000, max: 500000 },
  { label: '500K - 1M', min: 500000, max: 1000000 },
  { label: 'Over 1M', min: 1000000, max: Infinity },
] as const;

export const formatBudget = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
};

import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from '../category/category.model';
import { HistoryModel } from '../history/history.model';
import { pickWinner } from './wheel.algorithm';

export const spinWheel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner, categoryIds, mode = 'random' } = req.body;
    
    if (!owner || !categoryIds || categoryIds.length === 0) {
      return res.status(400).json({ message: 'Owner and categories are required' });
    }

    const categories = await CategoryModel.find({ _id: { $in: categoryIds } });
    
    if (categories.length === 0) {
      return res.status(400).json({ message: 'No valid categories found' });
    }

    let candidates = [...categories];

    // Guarantee 0% chance of consecutive repetition if there are >= 2 categories
    if (candidates.length > 1) {
      const lastHistory = await HistoryModel.findOne({ owner }).sort({ createdAt: -1 });
      if (lastHistory && lastHistory.category) {
        const lastWinnerId = lastHistory.category.toString();
        const filtered = candidates.filter(c => c._id.toString() !== lastWinnerId);
        if (filtered.length > 0) {
          candidates = filtered;
        }
      }
    }

    // Run the algorithm to pick the winner
    const winner = pickWinner(candidates, mode);

    // Save to history
    const history = await HistoryModel.create({
      category: winner._id,
      mode,
      owner,
      candidates: categoryIds
    });

    res.status(200).json({ 
      success: true,
      data: {
        winner, 
        historyId: history._id,
        mode,
        candidates: categoryIds
      }
    });
  } catch (error) {
    next(error);
  }
};

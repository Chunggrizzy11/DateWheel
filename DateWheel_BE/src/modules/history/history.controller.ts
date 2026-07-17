import { Request, Response, NextFunction } from 'express';
import { HistoryModel } from './history.model';

export const getHistories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    
    // Populate category to get name and icon
    const histories = await HistoryModel.find(filter)
      .sort({ createdAt: -1 })
      .populate('category');
      
    res.status(200).json({ success: true, data: histories });
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const history = await HistoryModel.findByIdAndDelete(id);
    if (!history) return res.status(404).json({ message: 'History not found' });
    res.status(200).json({ success: true, message: 'History deleted successfully' });
  } catch (error) {
    next(error);
  }
};

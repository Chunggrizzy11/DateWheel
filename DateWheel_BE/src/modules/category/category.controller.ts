import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from './category.model';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    const categories = await CategoryModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await CategoryModel.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

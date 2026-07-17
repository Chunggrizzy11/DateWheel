import { Request, Response, NextFunction } from 'express';
import { FolderModel } from './folder.model';

export const getFolders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    const folders = await FolderModel.find(filter).populate('categories').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: folders });
  } catch (error) {
    next(error);
  }
};

export const createFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = await FolderModel.create(req.body);
    const populated = await folder.populate('categories');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const folder = await FolderModel.findByIdAndUpdate(id, req.body, { new: true }).populate('categories');
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.status(200).json({ success: true, data: folder });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const folder = await FolderModel.findByIdAndDelete(id);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.status(200).json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    next(error);
  }
};

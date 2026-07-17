import { Request, Response, NextFunction } from 'express';
import { SettingModel } from './setting.model';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.query;
    if (!owner) return res.status(400).json({ message: 'Owner is required' });
    
    let setting = await SettingModel.findOne({ owner });
    if (!setting) {
      setting = await SettingModel.create({ owner });
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.params; // we'll use owner ID for updating settings
    const setting = await SettingModel.findOneAndUpdate({ owner }, req.body, { new: true });
    if (!setting) return res.status(404).json({ message: 'Settings not found' });
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};

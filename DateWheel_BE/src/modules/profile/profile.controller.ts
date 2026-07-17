import { Request, Response, NextFunction } from 'express';
import { ProfileModel } from './profile.model';

export const getProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await ProfileModel.find().select('-__v');
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    next(error);
  }
};

import { Router } from 'express';
import profileRoutes from '../modules/profile/profile.route';
import categoryRoutes from '../modules/category/category.route';
import historyRoutes from '../modules/history/history.route';
import settingRoutes from '../modules/setting/setting.route';
import wheelRoutes from '../modules/wheel/wheel.route';
import aiRoutes from '../modules/ai/ai.route';
import folderRoutes from '../modules/folder/folder.route';

const router = Router();

router.use('/profiles', profileRoutes);
router.use('/categories', categoryRoutes);
router.use('/histories', historyRoutes);
router.use('/settings', settingRoutes);
router.use('/wheel', wheelRoutes);
router.use('/ai', aiRoutes);
router.use('/folders', folderRoutes);

export default router;

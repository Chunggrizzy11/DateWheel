import { Router } from 'express';
import { spinWheel } from './wheel.controller';

const router = Router();

router.post('/spin', spinWheel);

export default router;

import { Router } from 'express';
import { generateIconUrl } from './ai.controller';

const router = Router();

router.post('/generate-icon', generateIconUrl);

export default router;

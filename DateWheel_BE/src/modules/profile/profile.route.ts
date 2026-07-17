import { Router } from 'express';
import { getProfiles } from './profile.controller';

const router = Router();

router.get('/', getProfiles);

export default router;

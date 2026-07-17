import { Router } from 'express';
import { getHistories, deleteHistory } from './history.controller';

const router = Router();

router.get('/', getHistories);
router.delete('/:id', deleteHistory);

export default router;

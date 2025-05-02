import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { listMeasuresController } from '../controllers/measuresList.controller';

const router = Router();
const prisma = new PrismaClient();

router.get('/:customer_code/list', listMeasuresController(prisma));

export default router;

import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { confirmController } from '../controllers/confirm.controller';

const router = Router();
const prisma = new PrismaClient();

router.patch('/confirm', confirmController(prisma));

export default router;

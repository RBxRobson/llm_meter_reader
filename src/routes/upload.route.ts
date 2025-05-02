import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { uploadController } from '../controllers/upload.controller';

const router = Router();
const prisma = new PrismaClient();

router.post('/upload', uploadController(prisma));

export default router;

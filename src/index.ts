import path from 'path';

import { PrismaClient } from '@prisma/client';
import compression from 'compression';
import express from 'express';

import confirmRoute from './routes/confirm.route';
import measuresListRoute from './routes/measuresList.route';
import readmeRoute from './routes/readme.route';
import uploadRoute from './routes/upload.route';

const app = express();
const prisma = new PrismaClient();

// Usa o compression para otimizar as requisições
app.use(compression());

// Middleware de JSON com limite
app.use(express.json({ limit: '10mb' }));

// Servir a pasta public
app.use('/public', express.static(path.join('/app/public')));

// Servir as imagens enviadas nas medições
app.use(
  '/uploads',
  express.static('/app/uploads', {
    maxAge: '7d',
    etag: false,
  })
);

// Rotas da aplicação
app.use(readmeRoute);
app.use(uploadRoute);
app.use(confirmRoute);
app.use(measuresListRoute);

// Tratamento de encerramento do servidor
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

try {
  app.listen(80, () => {
    console.log('Servidor Ativo, Porta 80: http://localhost:80');
  });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
}

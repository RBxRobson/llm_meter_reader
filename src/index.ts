import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import uploadRoute from './routes/upload.route';
import confirmRoute from './routes/confirm.route';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

// Middleware de JSON com limite
app.use(express.json({ limit: '10mb' }));

// Rotas da aplicação
app.get('/', (req: Request, res: Response) => {
  res.send('API de Medições Ativa');
});

app.use(uploadRoute);
app.use(confirmRoute);
app.use('/uploads', express.static(path.join('/app/uploads')));

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

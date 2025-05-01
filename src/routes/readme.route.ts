import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const readmePath = path.join('/app/README.md');
  const templatePath = path.join('/app/dist/templates/readme.template.html');

  try {
    const [md, template] = await Promise.all([
      fs.promises.readFile(readmePath, 'utf-8'),
      fs.promises.readFile(templatePath, 'utf-8'),
    ]);

    const html = await marked(md);
    const final = template.replace('<!-- CONTENT -->', html);
    res.send(final);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao renderizar README');
  }
});

export default router;

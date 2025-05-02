import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

import { InvalidTypeError, MeasuresNotFoundError } from '../errors';
import { listQuerySchema } from '../schemas/measuresList.schema';
import { getMeasureListService } from '../services/measuresList.service';

export const listMeasuresController =
  (prisma: PrismaClient): RequestHandler =>
  async (req, res) => {
    try {
      // Recupera o valor passado na URL
      const customer_code = req.params.customer_code;

      // Valida os dados da query string
      const parsedQuery = listQuerySchema.safeParse(req.query);
      if (!parsedQuery.success) {
        throw new InvalidTypeError();
      }

      const { measure_type } = parsedQuery.data;

      // Consulta as medições no banco com o service
      const measures = await getMeasureListService(
        { customer_code, measure_type },
        prisma
      );

      res.status(200).json(measures);
    } catch (err: unknown) {
      // Erro para tipo de medição inválido
      if (err instanceof InvalidTypeError) {
        res.status(400).json({
          error_code: err.code,
          error_description: err.message,
        });
      }
      // Erro para medições não encontradas
      else if (err instanceof MeasuresNotFoundError) {
        res.status(404).json({
          error_code: err.code,
          error_description: err.message,
        });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  };

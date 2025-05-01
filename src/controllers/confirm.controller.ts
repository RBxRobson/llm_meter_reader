import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import { confirmSchema } from '../schemas/confirm.schema';
import { confirmMeasureService } from '../services/confirmMeasure.service';
import {
  ConfirmationDuplicateError,
  InvalidDataError,
  MeasureNotFoundError,
} from '../errors';

export const confirmController =
  (prisma: PrismaClient): RequestHandler =>
  async (req, res) => {
    try {
      // Valida os dados da requisição conforme o schema
      const parsed = confirmSchema.safeParse(req.body);

      // Se a validação falhar, lança um erro
      if (!parsed.success) {
        const errorMessage = parsed.error.errors
          .map((e) => e.message)
          .join(', ');
        throw new InvalidDataError(errorMessage);
      }

      const { measure_uuid, confirmed_value } = parsed.data;

      // Chama o serviço para confirmar a medição
      const result = await confirmMeasureService(
        {
          measure_uuid,
          confirmed_value,
        },
        prisma
      );

      // Retorna o resultado da criação da medição
      res.status(200).json(result);
    } catch (err: any) {
      // Erro de dados inválidos
      if (err instanceof InvalidDataError) {
        res.status(400).json({
          error_code: err.code,
          error_description: err.message,
        });
      }
      // Erro de medição não encontrada pelo uuid
      else if (err instanceof MeasureNotFoundError) {
        res.status(404).json({
          error_code: err.code,
          error_description: err.message,
        });
      }
      // Erro de tentativa de confirmação já feita
      else if (err instanceof ConfirmationDuplicateError) {
        res.status(409).json({
          error_code: err.code,
          error_description: err.message,
        });
      }
      // Outros erros internos do servidor
      else {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  };

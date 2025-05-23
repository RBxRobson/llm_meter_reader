import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

import { DoubleReportError, InvalidDataError } from '../errors';
import { uploadSchema } from '../schemas/upload.schema';
import { createMeasureService } from '../services/createMeasure.service';
import { base64Checker } from '../utils/base64Checker.util';

export const uploadController =
  (prisma: PrismaClient): RequestHandler =>
  async (req, res) => {
    try {
      // Valida os dados da requisição conforme o schema
      const parsed = uploadSchema.safeParse(req.body);

      // Se a validação falhar, lança um erro
      if (!parsed.success) {
        const errorMessage = parsed.error.errors
          .map((e) => e.message)
          .join(', ');
        throw new InvalidDataError(errorMessage);
      }

      const { customer_code, measure_datetime, measure_type } = parsed.data;
      let { image } = parsed.data;

      // Verifica se o arquivo base64 enviado é válido
      const validatedImage = await base64Checker(image);
      if (!validatedImage) {
        throw new InvalidDataError(
          'O arquivo base64 enviado não é um formato suportado para leitura.'
        );
      }

      // Ajusta o formato da imagem com base na validação
      image = validatedImage.base64;

      // Chama o serviço para criar a medição
      const result = await createMeasureService(
        {
          image,
          customer_code,
          measure_datetime,
          measure_type,
        },
        prisma,
        validatedImage.mimeType
      );

      // Retorna o resultado da criação da medição
      res.status(200).json(result);
    } catch (err: unknown) {
      // Erro de dados inválidos no upload
      if (err instanceof InvalidDataError) {
        res.status(400).json({
          error_code: err.code,
          error_description: err.message,
        });
      }
      // Erro de reporte duplo
      else if (err instanceof DoubleReportError) {
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

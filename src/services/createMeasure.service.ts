import fs from 'fs';
import path from 'path';

import { PrismaClient } from '@prisma/client';
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuidv4 } from 'uuid';

import { DoubleReportError } from '../errors';

import { processImage } from './processImage.service';

export const createMeasureService = async (
  data: {
    image: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
  },
  prisma: PrismaClient,
  mimeType: string
) => {
  // Calcular o início e fim do mês da medição para comparar com registros existentes
  const startOfMonth = new Date(
    data.measure_datetime.getFullYear(),
    data.measure_datetime.getMonth(),
    1
  );
  const startOfNextMonth = new Date(
    data.measure_datetime.getFullYear(),
    data.measure_datetime.getMonth() + 1,
    1
  );

  // Verificar se já existe uma medição para o mesmo cliente, tipo e mês
  const existingMeasure = await prisma.measure.findFirst({
    where: {
      AND: [
        { customerCode: data.customer_code },
        { measureType: data.measure_type },
        {
          measureDatetime: {
            gte: startOfMonth, // Início do mês
            lt: startOfNextMonth, // Início do próximo mês
          },
        },
      ],
    },
  });

  // Se existir medição, lançar erro de reporte duplo
  if (existingMeasure) {
    throw new DoubleReportError();
  }

  // Converter a imagem base64 em buffer para manipulação
  const buffer = Buffer.from(data.image, 'base64');

  // Obter a extensão do arquivo a partir do buffer
  const fileType = await fileTypeFromBuffer(buffer);
  const extension = fileType?.ext;

  // Definir diretórios de upload e nome do arquivo
  const uploadsDir = path.resolve('/app/uploads');
  const imageName = `${uuidv4()}.${extension}`;
  const imagePath = path.join(uploadsDir, imageName);

  // Verificar se o diretório de uploads existe, caso contrário, criá-lo
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Salvar a imagem no diretório local
  fs.writeFileSync(imagePath, buffer);

  // Processar a imagem para obter o valor da medição
  const measureValue = await processImage(data.image, mimeType);

  // Criar a medição no banco de dados
  const newMeasure = await prisma.measure.create({
    data: {
      customerCode: data.customer_code,
      measureType: data.measure_type.toUpperCase(),
      measureDatetime: data.measure_datetime,
      measureValue,
      imageUrl: `/uploads/${imageName}`,
    },
  });

  // Retornar informações sobre a medição criada
  return {
    image_url: newMeasure.imageUrl,
    measure_value: newMeasure.measureValue,
    measure_uuid: newMeasure.id,
  };
};

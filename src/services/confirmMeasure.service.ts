import { PrismaClient } from '@prisma/client';

import { MeasureNotFoundError, ConfirmationDuplicateError } from '../errors';

interface ConfirmMeasureInput {
  measure_uuid: string;
  confirmed_value: number;
}

export const confirmMeasureService = async (
  data: ConfirmMeasureInput,
  prisma: PrismaClient
) => {
  // Buscar a medição no banco de dados pelo UUID informado
  const existingMeasure = await prisma.measure.findUnique({
    where: { id: data.measure_uuid },
  });

  // Se não existir medição com o UUID fornecido, lançar erro
  if (!existingMeasure) {
    throw new MeasureNotFoundError();
  }

  // Se a medição já tiver sido confirmada anteriormente, lançar erro
  if (existingMeasure.hasConfirmed) {
    throw new ConfirmationDuplicateError();
  }

  // Atualizar a medição com o novo valor confirmado e marcar como confirmada
  await prisma.measure.update({
    where: { id: data.measure_uuid },
    data: {
      measureValue: data.confirmed_value,
      hasConfirmed: true,
    },
  });

  return {
    success: true,
  };
};

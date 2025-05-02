import { PrismaClient, Measure } from '@prisma/client';

import { MeasuresNotFoundError } from '../errors';

interface GetMeasureListInput {
  customer_code: string;
  measure_type?: string;
}

export const getMeasureListService = async (
  { customer_code, measure_type }: GetMeasureListInput,
  prisma: PrismaClient
) => {
  // Busca as leituras com base no código do cliente e tipo de medição (se fornecido)
  const measures = await prisma.measure.findMany({
    where: {
      customerCode: customer_code,
      ...(measure_type && { measureType: measure_type }),
    },
    orderBy: { measureDatetime: 'desc' },
  });

  // Se não encontrar nenhuma leitura, lançar erro
  if (measures.length === 0) {
    throw new MeasuresNotFoundError();
  }

  // Retorna a estrutura esperada
  return {
    customer_code,
    measures: measures.map((m: Measure) => ({
      measure_uuid: m.id,
      measure_datetime: m.measureDatetime,
      measure_type: m.measureType,
      has_confirmed: m.hasConfirmed,
      image_url: m.imageUrl,
    })),
  };
};

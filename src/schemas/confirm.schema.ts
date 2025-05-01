import { z } from 'zod';

export const confirmSchema = z.object({
  measure_uuid: z.string().uuid({
    message: 'O campo measure_uuid exige um UUID válido.',
  }),
  confirmed_value: z.preprocess(
    (val) => {
      const coerced = Number(val);
      return Number.isNaN(coerced) ? undefined : coerced;
    },
    z.number().int().nonnegative({
      message: 'O campo confirmed_value deve ser um número inteiro positivo.',
    }),
    {
      required_error: 'O campo confirmed_value é obrigatório.',
      invalid_type_error:
        'O campo confirmed_value deve possuir apenas conteúdo numérico.',
    }
  ),
});

export type ConfirmInput = z.infer<typeof confirmSchema>;

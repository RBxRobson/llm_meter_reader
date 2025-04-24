import { z } from 'zod';

export const uploadSchema = z.object({
  image: z.string().min(1, 'Imagem obrigatória'),
  customer_code: z.string().min(1, 'Código do cliente obrigatório'),
  measure_datetime: z.coerce.date({
    required_error: 'Data da medição obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  measure_type: z.enum(['WATER', 'GAS'], {
    errorMap: () => ({ message: 'Tipo de medição deve ser WATER ou GAS' }),
  }),
});

export type UploadInput = z.infer<typeof uploadSchema>;

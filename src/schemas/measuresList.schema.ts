import { z } from 'zod';

// Query string
export const listQuerySchema = z.object({
  measure_type: z
    .string()
    .optional()
    .transform((value) => (value ? value.toUpperCase() : undefined))
    .refine(
      (value) => value === undefined || ['WATER', 'GAS'].includes(value),
      {
        message: 'Tipo de medição não permitida',
      }
    ),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

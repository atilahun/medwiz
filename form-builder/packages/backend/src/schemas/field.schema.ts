import { z } from 'zod';
import { FieldType } from '@prisma/client';

export const createFieldSchema = z.object({
  sectionId: z.string().uuid(),
  type: z.nativeEnum(FieldType),
  name: z.string().min(1).max(255),
  label: z.string().min(1).max(255),
  placeholder: z.string().optional(),
  orderIndex: z.number().int().min(0),
  required: z.boolean().optional().default(false),
  settings: z.record(z.any()).optional(),
});

export const updateFieldSchema = z.object({
  type: z.nativeEnum(FieldType).optional(),
  name: z.string().min(1).max(255).optional(),
  label: z.string().min(1).max(255).optional(),
  placeholder: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
  required: z.boolean().optional(),
  settings: z.record(z.any()).optional(),
});

export type CreateFieldDto = z.infer<typeof createFieldSchema>;
export type UpdateFieldDto = z.infer<typeof updateFieldSchema>;
import { z } from 'zod';
import { WorkflowStatus } from '@prisma/client';

export const createWorkflowSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.nativeEnum(WorkflowStatus).optional().default(WorkflowStatus.DRAFT),
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkflowStatus).optional(),
});

export type CreateWorkflowDto = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowDto = z.infer<typeof updateWorkflowSchema>;
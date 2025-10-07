import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const pageRouter = Router();

const createPageSchema = z.object({
  workflowId: z.string().uuid(),
  title: z.string().min(1).max(255),
  orderIndex: z.number().int().min(0),
  settings: z.record(z.any()).optional(),
});

const updatePageSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  orderIndex: z.number().int().min(0).optional(),
  settings: z.record(z.any()).optional(),
});

pageRouter.get('/', async (req, res) => {
  const { workflowId } = req.query;
  const pages = await prisma.page.findMany({
    where: workflowId ? { workflowId: workflowId as string } : {},
    orderBy: { orderIndex: 'asc' },
  });
  res.json(pages);
});

pageRouter.get('/:id', async (req, res) => {
  const page = await prisma.page.findUnique({
    where: { id: req.params.id },
    include: {
      sections: {
        orderBy: { orderIndex: 'asc' },
        include: {
          fields: {
            orderBy: { orderIndex: 'asc' },
            include: {
              validations: true,
            },
          },
        },
      },
    },
  });
  res.json(page);
});

pageRouter.post('/', async (req, res) => {
  const data = createPageSchema.parse(req.body);
  const page = await prisma.page.create({
    data,
  });
  res.status(201).json(page);
});

pageRouter.put('/:id', async (req, res) => {
  const data = updatePageSchema.parse(req.body);
  const page = await prisma.page.update({
    where: { id: req.params.id },
    data,
  });
  res.json(page);
});

pageRouter.delete('/:id', async (req, res) => {
  await prisma.page.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

pageRouter.post('/reorder', async (req, res) => {
  const { pageIds } = req.body as { pageIds: string[] };

  await prisma.$transaction(
    pageIds.map((id, index) =>
      prisma.page.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  res.json({ success: true });
});
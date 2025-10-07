import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const sectionRouter = Router();

const createSectionSchema = z.object({
  pageId: z.string().uuid(),
  parentSectionId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
  settings: z.record(z.any()).optional(),
});

const updateSectionSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
  settings: z.record(z.any()).optional(),
});

sectionRouter.get('/', async (req, res) => {
  const { pageId } = req.query;
  const sections = await prisma.section.findMany({
    where: pageId ? { pageId: pageId as string } : {},
    orderBy: { orderIndex: 'asc' },
    include: {
      fields: {
        orderBy: { orderIndex: 'asc' },
      },
      subSections: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
  res.json(sections);
});

sectionRouter.get('/:id', async (req, res) => {
  const section = await prisma.section.findUnique({
    where: { id: req.params.id },
    include: {
      fields: {
        orderBy: { orderIndex: 'asc' },
        include: {
          validations: true,
        },
      },
      subSections: {
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
  res.json(section);
});

sectionRouter.post('/', async (req, res) => {
  const data = createSectionSchema.parse(req.body);
  const section = await prisma.section.create({
    data,
  });
  res.status(201).json(section);
});

sectionRouter.put('/:id', async (req, res) => {
  const data = updateSectionSchema.parse(req.body);
  const section = await prisma.section.update({
    where: { id: req.params.id },
    data,
  });
  res.json(section);
});

sectionRouter.delete('/:id', async (req, res) => {
  await prisma.section.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

sectionRouter.post('/reorder', async (req, res) => {
  const { sectionIds } = req.body as { sectionIds: string[] };

  await prisma.$transaction(
    sectionIds.map((id, index) =>
      prisma.section.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  res.json({ success: true });
});
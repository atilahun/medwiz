import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { createFieldSchema, updateFieldSchema } from '../schemas/field.schema';

export const fieldRouter = Router();

fieldRouter.get('/', async (req, res) => {
  const { sectionId } = req.query;
  const fields = await prisma.field.findMany({
    where: sectionId ? { sectionId: sectionId as string } : {},
    orderBy: { orderIndex: 'asc' },
    include: {
      validations: true,
    },
  });
  res.json(fields);
});

fieldRouter.get('/:id', async (req, res) => {
  const field = await prisma.field.findUnique({
    where: { id: req.params.id },
    include: {
      validations: true,
    },
  });
  res.json(field);
});

fieldRouter.post('/', async (req, res) => {
  const data = createFieldSchema.parse(req.body);
  const field = await prisma.field.create({
    data,
    include: {
      validations: true,
    },
  });
  res.status(201).json(field);
});

fieldRouter.put('/:id', async (req, res) => {
  const data = updateFieldSchema.parse(req.body);
  const field = await prisma.field.update({
    where: { id: req.params.id },
    data,
    include: {
      validations: true,
    },
  });
  res.json(field);
});

fieldRouter.delete('/:id', async (req, res) => {
  await prisma.field.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

fieldRouter.post('/reorder', async (req, res) => {
  const { fieldIds } = req.body as { fieldIds: string[] };

  await prisma.$transaction(
    fieldIds.map((id, index) =>
      prisma.field.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  res.json({ success: true });
});
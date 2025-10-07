import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { ValidationType } from '@prisma/client';

export const validationRouter = Router();

const createValidationSchema = z.object({
  fieldId: z.string().uuid(),
  type: z.nativeEnum(ValidationType),
  value: z.string().optional(),
  errorMessage: z.string(),
});

const updateValidationSchema = z.object({
  type: z.nativeEnum(ValidationType).optional(),
  value: z.string().optional(),
  errorMessage: z.string().optional(),
});

validationRouter.get('/', async (req, res) => {
  const { fieldId } = req.query;
  const validations = await prisma.validation.findMany({
    where: fieldId ? { fieldId: fieldId as string } : {},
  });
  res.json(validations);
});

validationRouter.get('/:id', async (req, res) => {
  const validation = await prisma.validation.findUnique({
    where: { id: req.params.id },
  });
  res.json(validation);
});

validationRouter.post('/', async (req, res) => {
  const data = createValidationSchema.parse(req.body);
  const validation = await prisma.validation.create({
    data,
  });
  res.status(201).json(validation);
});

validationRouter.put('/:id', async (req, res) => {
  const data = updateValidationSchema.parse(req.body);
  const validation = await prisma.validation.update({
    where: { id: req.params.id },
    data,
  });
  res.json(validation);
});

validationRouter.delete('/:id', async (req, res) => {
  await prisma.validation.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});
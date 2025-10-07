import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { createWorkflowSchema, updateWorkflowSchema } from '../schemas/workflow.schema';
import { AppError } from '../middleware/errorHandler';

export const workflowRouter = Router();

workflowRouter.get('/', async (req, res) => {
  const workflows = await prisma.workflow.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(workflows);
});

workflowRouter.get('/:id', async (req, res) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id: req.params.id },
    include: {
      pages: {
        orderBy: { orderIndex: 'asc' },
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
          },
        },
      },
    },
  });

  if (!workflow) {
    throw new AppError('Workflow not found', 404);
  }

  res.json(workflow);
});

workflowRouter.post('/', async (req, res) => {
  const data = createWorkflowSchema.parse(req.body);
  const workflow = await prisma.workflow.create({
    data,
  });
  res.status(201).json(workflow);
});

workflowRouter.put('/:id', async (req, res) => {
  const { pages, ...workflowData } = req.body;

  // Update workflow metadata
  const workflow = await prisma.workflow.update({
    where: { id: req.params.id },
    data: {
      name: workflowData.name,
      description: workflowData.description,
      status: workflowData.status,
    },
  });

  // If pages are provided, update the full structure
  if (pages && Array.isArray(pages)) {
    // Delete existing pages (cascades to sections, fields, validations)
    await prisma.page.deleteMany({
      where: { workflowId: req.params.id },
    });

    // Create new pages with all nested data
    for (const page of pages) {
      await prisma.page.create({
        data: {
          id: page.id || undefined,
          workflowId: req.params.id,
          title: page.title,
          orderIndex: page.orderIndex,
          settings: page.settings || {},
          sections: {
            create: (page.sections || []).map((section: any) => ({
              id: section.id || undefined,
              title: section.title,
              description: section.description,
              orderIndex: section.orderIndex,
              parentSectionId: section.parentSectionId,
              settings: section.settings || {},
              fields: {
                create: (section.fields || []).map((field: any) => ({
                  id: field.id || undefined,
                  type: field.type,
                  name: field.name,
                  label: field.label,
                  placeholder: field.placeholder,
                  orderIndex: field.orderIndex,
                  required: field.required,
                  settings: field.settings || {},
                  validations: {
                    create: (field.validations || []).map((validation: any) => ({
                      type: validation.type,
                      value: validation.value,
                      errorMessage: validation.errorMessage,
                    })),
                  },
                })),
              },
            })),
          },
        },
      });
    }
  }

  // Return updated workflow with full structure
  const updatedWorkflow = await prisma.workflow.findUnique({
    where: { id: req.params.id },
    include: {
      pages: {
        orderBy: { orderIndex: 'asc' },
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
      },
    },
  });

  res.json(updatedWorkflow);
});

workflowRouter.delete('/:id', async (req, res) => {
  await prisma.workflow.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

workflowRouter.post('/:id/duplicate', async (req, res) => {
  const sourceWorkflow = await prisma.workflow.findUnique({
    where: { id: req.params.id },
    include: {
      pages: {
        include: {
          sections: {
            include: {
              fields: {
                include: {
                  validations: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!sourceWorkflow) {
    throw new AppError('Workflow not found', 404);
  }

  const newWorkflow = await prisma.workflow.create({
    data: {
      name: `${sourceWorkflow.name} (Copy)`,
      description: sourceWorkflow.description,
      status: 'DRAFT',
      pages: {
        create: sourceWorkflow.pages.map(page => ({
          title: page.title,
          orderIndex: page.orderIndex,
          settings: page.settings,
          sections: {
            create: page.sections.map(section => ({
              title: section.title,
              description: section.description,
              orderIndex: section.orderIndex,
              settings: section.settings,
              fields: {
                create: section.fields.map(field => ({
                  type: field.type,
                  name: field.name,
                  label: field.label,
                  placeholder: field.placeholder,
                  orderIndex: field.orderIndex,
                  required: field.required,
                  settings: field.settings,
                  validations: {
                    create: field.validations.map(validation => ({
                      type: validation.type,
                      value: validation.value,
                      errorMessage: validation.errorMessage,
                    })),
                  },
                })),
              },
            })),
          },
        })),
      },
    },
  });

  res.status(201).json(newWorkflow);
});
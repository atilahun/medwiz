import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Workflow, Field, Section, FieldType, ValidationType } from '@/types/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormRendererProps {
  workflow: Workflow;
  onSubmit: (data: any) => void;
  className?: string;
}

function renderField(field: Field, register: any, errors: any) {
  const error = errors[field.name];

  const baseInputClasses = "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent";
  const errorClasses = error ? "border-red-500" : "border-gray-300";

  switch (field.type) {
    case FieldType.TEXT:
    case FieldType.EMAIL:
    case FieldType.PASSWORD:
    case FieldType.PHONE:
    case FieldType.URL:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type.toLowerCase()}
            {...register(field.name)}
            placeholder={field.placeholder}
            className={cn(baseInputClasses, errorClasses)}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.TEXTAREA:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            {...register(field.name)}
            placeholder={field.placeholder}
            rows={field.settings?.rows || 4}
            className={cn(baseInputClasses, errorClasses, "resize-y")}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.NUMBER:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            {...register(field.name, { valueAsNumber: true })}
            placeholder={field.placeholder}
            min={field.settings?.min}
            max={field.settings?.max}
            step={field.settings?.step}
            className={cn(baseInputClasses, errorClasses)}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.SELECT:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            {...register(field.name)}
            className={cn(baseInputClasses, errorClasses)}
          >
            <option value="">Select an option</option>
            {field.settings?.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.CHECKBOX:
      return (
        <div key={field.id} className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register(field.name)}
              className="mr-2 rounded"
            />
            <span className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.RADIO:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {field.settings?.options?.map((option: any) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  {...register(field.name)}
                  value={option.value}
                  className="mr-2"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.DATE:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            {...register(field.name)}
            className={cn(baseInputClasses, errorClasses)}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.DATETIME:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="datetime-local"
            {...register(field.name)}
            className={cn(baseInputClasses, errorClasses)}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.TIME:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="time"
            {...register(field.name)}
            className={cn(baseInputClasses, errorClasses)}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.FILE:
    case FieldType.IMAGE:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="file"
            {...register(field.name)}
            accept={field.type === FieldType.IMAGE ? "image/*" : field.settings?.accept}
            multiple={field.settings?.multiple}
            className={cn(baseInputClasses, errorClasses, "py-1")}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.COLOR:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="color"
            {...register(field.name)}
            className="w-20 h-10 border rounded cursor-pointer"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    case FieldType.RANGE:
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="range"
            {...register(field.name)}
            min={field.settings?.min || 0}
            max={field.settings?.max || 100}
            step={field.settings?.step || 1}
            className="w-full"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      );

    default:
      return null;
  }
}

function renderSection(section: Section, register: any, errors: any, level = 0): JSX.Element {
  return (
    <div
      key={section.id}
      className={cn(
        "mb-6",
        level > 0 && "ml-6 pl-4 border-l-2 border-gray-200"
      )}
    >
      <h3 className={cn(
        "font-semibold mb-2",
        level === 0 ? "text-lg" : "text-base"
      )}>
        {section.title}
      </h3>
      {section.description && (
        <p className="text-sm text-gray-600 mb-4">{section.description}</p>
      )}

      <div className="space-y-4">
        {section.fields?.map(field => renderField(field, register, errors))}
        {section.subSections?.map(subSection => renderSection(subSection, register, errors, level + 1))}
      </div>
    </div>
  );
}

export function FormRenderer({ workflow, onSubmit, className }: FormRendererProps) {
  const schema = generateValidationSchema(workflow);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("max-w-3xl mx-auto p-6", className)}
    >
      <h1 className="text-2xl font-bold mb-2">{workflow.name}</h1>
      {workflow.description && (
        <p className="text-gray-600 mb-6">{workflow.description}</p>
      )}

      {workflow.pages?.map((page, pageIndex) => (
        <div key={page.id} className="mb-8">
          {workflow.pages.length > 1 && (
            <h2 className="text-xl font-semibold mb-4">
              Page {pageIndex + 1}: {page.title}
            </h2>
          )}

          {page.sections
            ?.filter(s => !s.parentSectionId)
            .map(section => renderSection(section, register, errors))}
        </div>
      ))}

      <div className="mt-8 flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button type="button" variant="outline">
          Save Draft
        </Button>
      </div>
    </form>
  );
}

function generateValidationSchema(workflow: Workflow) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  workflow.pages?.forEach(page => {
    page.sections?.forEach(section => {
      const processFields = (fields: Field[] | undefined) => {
        fields?.forEach(field => {
          let fieldSchema: z.ZodTypeAny;

          // Base schema based on field type
          switch (field.type) {
            case FieldType.NUMBER:
              fieldSchema = z.number();
              break;
            case FieldType.EMAIL:
              fieldSchema = z.string().email();
              break;
            case FieldType.URL:
              fieldSchema = z.string().url();
              break;
            case FieldType.CHECKBOX:
              fieldSchema = z.boolean();
              break;
            default:
              fieldSchema = z.string();
          }

          // Apply validations
          field.validations?.forEach(validation => {
            switch (validation.type) {
              case ValidationType.MIN_LENGTH:
                if (fieldSchema instanceof z.ZodString) {
                  fieldSchema = fieldSchema.min(parseInt(validation.value || '0'), validation.errorMessage);
                }
                break;
              case ValidationType.MAX_LENGTH:
                if (fieldSchema instanceof z.ZodString) {
                  fieldSchema = fieldSchema.max(parseInt(validation.value || '999'), validation.errorMessage);
                }
                break;
              case ValidationType.MIN_VALUE:
                if (fieldSchema instanceof z.ZodNumber) {
                  fieldSchema = fieldSchema.min(parseInt(validation.value || '0'), validation.errorMessage);
                }
                break;
              case ValidationType.MAX_VALUE:
                if (fieldSchema instanceof z.ZodNumber) {
                  fieldSchema = fieldSchema.max(parseInt(validation.value || '999'), validation.errorMessage);
                }
                break;
              case ValidationType.PATTERN:
                if (fieldSchema instanceof z.ZodString && validation.value) {
                  fieldSchema = fieldSchema.regex(new RegExp(validation.value), validation.errorMessage);
                }
                break;
            }
          });

          // Make optional if not required
          if (!field.required) {
            fieldSchema = fieldSchema.optional();
          }

          schemaFields[field.name] = fieldSchema;
        });
      };

      if (section.fields) processFields(section.fields);
      section.subSections?.forEach(sub => {
        if (sub.fields) processFields(sub.fields);
      });
    });
  });

  return z.object(schemaFields);
}
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Field } from '@/types/form';
import { cn } from '@/lib/utils';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldSettingsModal } from './FieldSettingsModal';

interface SortableFieldProps {
  field: Field;
  onUpdate: (fieldId: string, updates: Partial<Field>) => void;
  onDelete: (fieldId: string) => void;
}

export function SortableField({ field, onUpdate, onDelete }: SortableFieldProps) {
  const [showSettings, setShowSettings] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "bg-white border rounded-lg p-4 flex items-start gap-3",
          isDragging && "opacity-50 shadow-lg"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-move mt-1"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

      <div className="flex-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-1">
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="font-medium text-sm mb-1 w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
              placeholder="Field Label"
            />
            <input
              type="text"
              value={field.name}
              onChange={(e) => onUpdate(field.id, { name: e.target.value })}
              className="text-xs text-gray-500 w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
              placeholder="Field Name (for submission)"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                className="rounded border-gray-300"
              />
              Required
            </label>
          </div>
        </div>

        {field.placeholder && (
          <input
            type="text"
            value={field.placeholder}
            onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
            className="text-sm text-gray-400 w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 mb-2"
            placeholder="Placeholder text"
          />
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">{field.type}</span>
          {field.validations.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 rounded">
              {field.validations.length} validation{field.validations.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 text-destructive"
          onClick={() => onDelete(field.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>

    <FieldSettingsModal
      field={field}
      isOpen={showSettings}
      onClose={() => setShowSettings(false)}
      onSave={onUpdate}
    />
    </>
  );
}
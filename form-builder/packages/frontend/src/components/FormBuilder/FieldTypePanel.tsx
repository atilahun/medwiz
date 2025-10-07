import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FieldType } from '@/types/form';
import { cn } from '@/lib/utils';
import {
  AlignLeft,
  AlignJustify,
  Hash,
  Mail,
  Lock,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Clock,
  FileUp,
  Image,
  Type,
  Phone,
  Link,
  Palette,
  ToggleLeft,
  Star,
  Code,
} from 'lucide-react';

interface FieldTypePanelProps {
  onFieldAdd?: (type: FieldType) => void;
}

const fieldTypes = [
  { type: FieldType.TEXT, label: 'Text Input', icon: AlignLeft },
  { type: FieldType.TEXTAREA, label: 'Text Area', icon: AlignJustify },
  { type: FieldType.NUMBER, label: 'Number', icon: Hash },
  { type: FieldType.EMAIL, label: 'Email', icon: Mail },
  { type: FieldType.PASSWORD, label: 'Password', icon: Lock },
  { type: FieldType.SELECT, label: 'Dropdown', icon: List },
  { type: FieldType.MULTISELECT, label: 'Multi-Select', icon: List },
  { type: FieldType.CHECKBOX, label: 'Checkbox', icon: CheckSquare },
  { type: FieldType.RADIO, label: 'Radio Button', icon: Circle },
  { type: FieldType.DATE, label: 'Date Picker', icon: Calendar },
  { type: FieldType.DATETIME, label: 'DateTime', icon: Calendar },
  { type: FieldType.TIME, label: 'Time Picker', icon: Clock },
  { type: FieldType.FILE, label: 'File Upload', icon: FileUp },
  { type: FieldType.IMAGE, label: 'Image Upload', icon: Image },
  { type: FieldType.RICHTEXT, label: 'Rich Text', icon: Type },
  { type: FieldType.PHONE, label: 'Phone', icon: Phone },
  { type: FieldType.URL, label: 'URL', icon: Link },
  { type: FieldType.COLOR, label: 'Color Picker', icon: Palette },
  { type: FieldType.RANGE, label: 'Range Slider', icon: ToggleLeft },
  { type: FieldType.RATING, label: 'Rating', icon: Star },
  { type: FieldType.CUSTOM, label: 'Custom HTML', icon: Code },
];

function DraggableFieldType({ type, label, icon: Icon }: typeof fieldTypes[0]) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-type-${type}`,
    data: {
      type: 'NEW_FIELD',
      fieldType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 p-3 bg-white border rounded-lg cursor-move hover:shadow-md transition-shadow",
        isDragging && "opacity-50"
      )}
    >
      <Icon className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function FieldTypePanel({ onFieldAdd }: FieldTypePanelProps) {
  return (
    <div className="w-64 bg-gray-50 border-r h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Field Types</h3>
        <div className="space-y-2">
          {fieldTypes.map((fieldType) => (
            <DraggableFieldType key={fieldType.type} {...fieldType} />
          ))}
        </div>
      </div>
    </div>
  );
}
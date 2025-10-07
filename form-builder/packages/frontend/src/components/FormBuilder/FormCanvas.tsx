import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Field, Section, Page, FieldType } from '@/types/form';
import { cn } from '@/lib/utils';
import { SortableField } from './SortableField';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormCanvasProps {
  page: Page;
  onFieldAdd: (sectionId: string, field: Partial<Field>) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<Field>) => void;
  onFieldDelete: (fieldId: string) => void;
  onSectionAdd: (section: Partial<Section>) => void;
  onSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onSectionDelete: (sectionId: string) => void;
}

function SectionComponent({
  section,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  onSectionUpdate,
  onSectionDelete,
  level = 0,
}: {
  section: Section;
  onFieldAdd: (sectionId: string, field: Partial<Field>) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<Field>) => void;
  onFieldDelete: (fieldId: string) => void;
  onSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onSectionDelete: (sectionId: string) => void;
  level?: number;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: {
      type: 'SECTION',
      section,
    },
  });

  const fieldIds = section.fields.map(f => f.id);

  return (
    <div
      className={cn(
        "border rounded-lg p-4 mb-4",
        level > 0 && "ml-6 border-dashed",
        isOver && "bg-blue-50 border-blue-400"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={section.title}
            onChange={(e) => onSectionUpdate(section.id, { title: e.target.value })}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
            placeholder="Section Title"
          />
        </div>
        <div className="flex gap-2">
          {level === 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newSubSection: Partial<Section> = {
                  pageId: section.pageId,
                  parentSectionId: section.id,
                  title: 'New Subsection',
                  orderIndex: section.subSections?.length || 0,
                  fields: [],
                };
                // Handle subsection add
              }}
            >
              Add Subsection
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onSectionDelete(section.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      {section.description && (
        <input
          type="text"
          value={section.description}
          onChange={(e) => onSectionUpdate(section.id, { description: e.target.value })}
          className="text-sm text-gray-600 mb-3 w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
          placeholder="Section description"
        />
      )}

      {!isCollapsed && (
        <>
          <div
            ref={setNodeRef}
            className={cn(
              "min-h-[100px] space-y-2 p-2",
              section.fields.length === 0 && "border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400"
            )}
          >
            {section.fields.length === 0 ? (
              <span>Drop fields here</span>
            ) : (
              <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
                {section.fields.map(field => (
                  <SortableField
                    key={field.id}
                    field={field}
                    onUpdate={onFieldUpdate}
                    onDelete={onFieldDelete}
                  />
                ))}
              </SortableContext>
            )}
          </div>

          {section.subSections && section.subSections.length > 0 && (
            <div className="mt-4">
              {section.subSections.map(subSection => (
                <SectionComponent
                  key={subSection.id}
                  section={subSection}
                  onFieldAdd={onFieldAdd}
                  onFieldUpdate={onFieldUpdate}
                  onFieldDelete={onFieldDelete}
                  onSectionUpdate={onSectionUpdate}
                  onSectionDelete={onSectionDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function FormCanvas({
  page,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  onSectionAdd,
  onSectionUpdate,
  onSectionDelete,
}: FormCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
    data: {
      type: 'CANVAS',
    },
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{page.title}</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const newSection: Partial<Section> = {
                  pageId: page.id,
                  title: `Section ${page.sections.length + 1}`,
                  orderIndex: page.sections.length,
                  fields: [],
                };
                onSectionAdd(newSection);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className={cn(
            "min-h-[400px]",
            page.sections.length === 0 && "border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-gray-400",
            isOver && "bg-blue-50"
          )}
        >
          {page.sections.length === 0 ? (
            <div className="text-center">
              <p className="text-lg mb-2">No sections yet</p>
              <p className="text-sm">Add a section to start building your form</p>
            </div>
          ) : (
            page.sections
              .filter(s => !s.parentSectionId)
              .map(section => (
                <SectionComponent
                  key={section.id}
                  section={section}
                  onFieldAdd={onFieldAdd}
                  onFieldUpdate={onFieldUpdate}
                  onFieldDelete={onFieldDelete}
                  onSectionUpdate={onSectionUpdate}
                  onSectionDelete={onSectionDelete}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
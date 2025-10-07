import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Workflow, Page, Section, Field, FieldType } from '@/types/form';
import { FieldTypePanel } from './FieldTypePanel';
import { FormCanvas } from './FormCanvas';
import { Button } from '@/components/ui/button';
import { Save, Eye, Settings } from 'lucide-react';

interface FormBuilderProps {
  workflow: Workflow;
  onSave: (workflow: Workflow) => void;
}

export function FormBuilder({ workflow: initialWorkflow, onSave }: FormBuilderProps) {
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentPage = workflow.pages[currentPageIndex];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle new field drop
    if (activeData?.type === 'NEW_FIELD' && overData?.type === 'SECTION') {
      const fieldType = activeData.fieldType as FieldType;
      const targetSection = overData.section as Section;

      const newField: Field = {
        id: `field-${Date.now()}`,
        sectionId: targetSection.id,
        type: fieldType,
        name: `field_${Date.now()}`,
        label: `New ${fieldType} Field`,
        placeholder: '',
        orderIndex: targetSection.fields.length,
        required: false,
        validations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      handleFieldAdd(targetSection.id, newField);
    }

    // Handle field reordering
    if (activeData?.type === 'FIELD' && overData?.type === 'FIELD') {
      // Implementation for field reordering within sections
    }

    setActiveId(null);
  };

  const handleFieldAdd = useCallback((sectionId: string, field: Partial<Field>) => {
    setWorkflow(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => {
        if (idx !== currentPageIndex) return page;

        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                fields: [...section.fields, field as Field],
              };
            }
            // Handle subsections
            if (section.subSections) {
              return {
                ...section,
                subSections: section.subSections.map(sub => {
                  if (sub.id === sectionId) {
                    return {
                      ...sub,
                      fields: [...sub.fields, field as Field],
                    };
                  }
                  return sub;
                }),
              };
            }
            return section;
          }),
        };
      }),
    }));
  }, [currentPageIndex]);

  const handleFieldUpdate = useCallback((fieldId: string, updates: Partial<Field>) => {
    setWorkflow(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => {
        if (idx !== currentPageIndex) return page;

        return {
          ...page,
          sections: page.sections.map(section => ({
            ...section,
            fields: section.fields.map(field =>
              field.id === fieldId ? { ...field, ...updates } : field
            ),
            subSections: section.subSections?.map(sub => ({
              ...sub,
              fields: sub.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            })),
          })),
        };
      }),
    }));
  }, [currentPageIndex]);

  const handleFieldDelete = useCallback((fieldId: string) => {
    setWorkflow(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => {
        if (idx !== currentPageIndex) return page;

        return {
          ...page,
          sections: page.sections.map(section => ({
            ...section,
            fields: section.fields.filter(field => field.id !== fieldId),
            subSections: section.subSections?.map(sub => ({
              ...sub,
              fields: sub.fields.filter(field => field.id !== fieldId),
            })),
          })),
        };
      }),
    }));
  }, [currentPageIndex]);

  const handleSectionAdd = useCallback((section: Partial<Section>) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      pageId: currentPage.id,
      title: section.title || 'New Section',
      description: section.description,
      orderIndex: section.orderIndex || currentPage.sections.length,
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...section,
    };

    setWorkflow(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => {
        if (idx !== currentPageIndex) return page;
        return {
          ...page,
          sections: [...page.sections, newSection],
        };
      }),
    }));
  }, [currentPage, currentPageIndex]);

  const handleSectionUpdate = useCallback((sectionId: string, updates: Partial<Section>) => {
    setWorkflow(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => {
        if (idx !== currentPageIndex) return page;

        return {
          ...page,
          sections: page.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          ),
        };
      }),
    }));
  }, [currentPageIndex]);

  const handleSectionDelete = useCallback((sectionId: string) => {
    setWorkflow(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => {
        if (idx !== currentPageIndex) return page;

        return {
          ...page,
          sections: page.sections.filter(section => section.id !== sectionId),
        };
      }),
    }));
  }, [currentPageIndex]);

  const handleSave = () => {
    onSave(workflow);
  };

  if (!currentPage) {
    return <div>No pages in workflow</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{workflow.name}</h1>
            {workflow.pages.length > 1 && (
              <div className="flex gap-1">
                {workflow.pages.map((page, idx) => (
                  <Button
                    key={page.id}
                    variant={idx === currentPageIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPageIndex(idx)}
                  >
                    {page.title}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/workflows/${workflow.id}/preview`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <FieldTypePanel />
          <FormCanvas
            page={currentPage}
            onFieldAdd={handleFieldAdd}
            onFieldUpdate={handleFieldUpdate}
            onFieldDelete={handleFieldDelete}
            onSectionAdd={handleSectionAdd}
            onSectionUpdate={handleSectionUpdate}
            onSectionDelete={handleSectionDelete}
          />
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <div className="bg-white border rounded-lg p-4 shadow-lg opacity-80">
            Dragging...
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
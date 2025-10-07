import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Field, FieldType, Validation, ValidationType } from '@/types/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FieldSettingsModalProps {
  field: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldId: string, updates: Partial<Field>) => void;
}

export function FieldSettingsModal({ field, isOpen, onClose, onSave }: FieldSettingsModalProps) {
  const [fieldData, setFieldData] = useState<Partial<Field>>({});
  const [validations, setValidations] = useState<Partial<Validation>[]>([]);

  useEffect(() => {
    if (field) {
      setFieldData({
        label: field.label,
        name: field.name,
        placeholder: field.placeholder,
        required: field.required,
        settings: field.settings || {},
      });
      setValidations(field.validations || []);
    }
  }, [field]);

  if (!isOpen || !field) return null;

  const handleSave = () => {
    onSave(field.id, {
      ...fieldData,
      validations: validations as Validation[],
    });
    onClose();
  };

  const handleAddValidation = () => {
    setValidations([
      ...validations,
      {
        type: ValidationType.REQUIRED,
        errorMessage: 'This field is required',
      },
    ]);
  };

  const handleRemoveValidation = (index: number) => {
    setValidations(validations.filter((_, i) => i !== index));
  };

  const needsOptions = [
    FieldType.SELECT,
    FieldType.MULTISELECT,
    FieldType.RADIO,
  ].includes(field.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Field Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Basic Settings */}
            <div>
              <h3 className="font-medium mb-2">Basic Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <input
                    type="text"
                    value={fieldData.label || ''}
                    onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Field Name</label>
                  <input
                    type="text"
                    value={fieldData.name || ''}
                    onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={fieldData.placeholder || ''}
                    onChange={(e) => setFieldData({ ...fieldData, placeholder: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fieldData.required || false}
                      onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Required Field</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Field Type Specific Settings */}
            {needsOptions && (
              <div>
                <h3 className="font-medium mb-2">Options</h3>
                <div className="space-y-2">
                  {(fieldData.settings?.options || []).map((option: any, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...(fieldData.settings?.options || [])];
                          newOptions[index] = { ...newOptions[index], label: e.target.value };
                          setFieldData({
                            ...fieldData,
                            settings: { ...fieldData.settings, options: newOptions },
                          });
                        }}
                        placeholder="Label"
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => {
                          const newOptions = [...(fieldData.settings?.options || [])];
                          newOptions[index] = { ...newOptions[index], value: e.target.value };
                          setFieldData({
                            ...fieldData,
                            settings: { ...fieldData.settings, options: newOptions },
                          });
                        }}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = fieldData.settings?.options.filter((_: any, i: number) => i !== index);
                          setFieldData({
                            ...fieldData,
                            settings: { ...fieldData.settings, options: newOptions },
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newOptions = [...(fieldData.settings?.options || []), { label: '', value: '' }];
                      setFieldData({
                        ...fieldData,
                        settings: { ...fieldData.settings, options: newOptions },
                      });
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {/* Number Field Settings */}
            {field.type === FieldType.NUMBER && (
              <div>
                <h3 className="font-medium mb-2">Number Settings</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Value</label>
                    <input
                      type="number"
                      value={fieldData.settings?.min || ''}
                      onChange={(e) => setFieldData({
                        ...fieldData,
                        settings: { ...fieldData.settings, min: parseInt(e.target.value) },
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Value</label>
                    <input
                      type="number"
                      value={fieldData.settings?.max || ''}
                      onChange={(e) => setFieldData({
                        ...fieldData,
                        settings: { ...fieldData.settings, max: parseInt(e.target.value) },
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Step</label>
                    <input
                      type="number"
                      value={fieldData.settings?.step || ''}
                      onChange={(e) => setFieldData({
                        ...fieldData,
                        settings: { ...fieldData.settings, step: parseFloat(e.target.value) },
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Validations */}
            <div>
              <h3 className="font-medium mb-2">Validations</h3>
              <div className="space-y-2">
                {validations.map((validation, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Type</label>
                      <select
                        value={validation.type}
                        onChange={(e) => {
                          const newValidations = [...validations];
                          newValidations[index] = { ...newValidations[index], type: e.target.value as ValidationType };
                          setValidations(newValidations);
                        }}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value={ValidationType.REQUIRED}>Required</option>
                        <option value={ValidationType.MIN_LENGTH}>Min Length</option>
                        <option value={ValidationType.MAX_LENGTH}>Max Length</option>
                        <option value={ValidationType.PATTERN}>Pattern</option>
                        <option value={ValidationType.EMAIL}>Email</option>
                        <option value={ValidationType.URL}>URL</option>
                      </select>
                    </div>
                    {[ValidationType.MIN_LENGTH, ValidationType.MAX_LENGTH, ValidationType.PATTERN].includes(validation.type as ValidationType) && (
                      <div className="flex-1">
                        <label className="block text-sm mb-1">Value</label>
                        <input
                          type="text"
                          value={validation.value || ''}
                          onChange={(e) => {
                            const newValidations = [...validations];
                            newValidations[index] = { ...newValidations[index], value: e.target.value };
                            setValidations(newValidations);
                          }}
                          placeholder="Value"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Error Message</label>
                      <input
                        type="text"
                        value={validation.errorMessage || ''}
                        onChange={(e) => {
                          const newValidations = [...validations];
                          newValidations[index] = { ...newValidations[index], errorMessage: e.target.value };
                          setValidations(newValidations);
                        }}
                        placeholder="Error message"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveValidation(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddValidation}>
                  Add Validation
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
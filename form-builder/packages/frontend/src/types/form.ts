export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum FieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  NUMBER = 'NUMBER',
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  RICHTEXT = 'RICHTEXT',
  PHONE = 'PHONE',
  URL = 'URL',
  COLOR = 'COLOR',
  RANGE = 'RANGE',
  RATING = 'RATING',
  CUSTOM = 'CUSTOM',
}

export enum ValidationType {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  PATTERN = 'PATTERN',
  EMAIL = 'EMAIL',
  URL = 'URL',
  PHONE = 'PHONE',
  CUSTOM = 'CUSTOM',
  MATCH_FIELD = 'MATCH_FIELD',
}

export interface Validation {
  id: string;
  fieldId: string;
  type: ValidationType;
  value?: string;
  errorMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Field {
  id: string;
  sectionId: string;
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  orderIndex: number;
  required: boolean;
  settings?: Record<string, any>;
  validations: Validation[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  pageId: string;
  parentSectionId?: string;
  title: string;
  description?: string;
  orderIndex: number;
  settings?: Record<string, any>;
  fields: Field[];
  subSections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  workflowId: string;
  title: string;
  orderIndex: number;
  settings?: Record<string, any>;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldSettings {
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
}
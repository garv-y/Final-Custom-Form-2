// This defines all the possible types of fields a user can add to the form.
// These strings are used to control rendering logic and UI behavior.
export type FieldType =
  | "header"           // Large heading text (non-input)
  | "label"            // Static label text (non-input)
  | "paragraph"        // Descriptive paragraph text (non-input)
  | "linebreak"        // A visual break or separator (non-input)
  | "text"             // Text input field
  | "number"           // Numeric input field
  | "dropdown"         // Dropdown select with options
  | "checkboxes"       // Multiple selection (checkbox group)
  | "multipleChoice"   // Single selection (radio buttons)
  | "tags"             // Tag input (select or create multiple values)
  | "section"         // ✅ Section field to group other fields
  | "date";

// Represents a single option in dropdowns, checkboxes, or multipleChoice
export interface FieldOption {
  label: string; // Text shown to the user
  value: string; // Internal value submitted
}

// Layout type for react-grid-layout
export interface LayoutItem {
  i: string;         // ID of the field
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

// Defines the shape of a single form field — used when rendering or saving a form
export interface Field {
  id: string;                          // Unique ID for this field
  label: string;                       // The label or question text shown to the user
  type: FieldType;                     // One of the types listed above
  required?: boolean;                  // Whether the field is mandatory
  options?: FieldOption[];             // For choice-based fields (dropdown, checkboxes, etc.)
  displayOnShortForm?: boolean;        // Whether to show this field in short form view
  fields?: Field[];                    // ✅ For 'section': nested child fields
  layout?: LayoutItem[];               // ✅ For 'section': layout of nested fields
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

// FieldConfig is identical to Field during creation
export interface FieldConfig extends Field {}

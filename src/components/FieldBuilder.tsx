import React, { useState } from "react";
import type { Field, FieldType } from "../types/types";
import { useTheme } from "./ThemeContext";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface Props {
  field: Field;
  updateField: (updated: Field) => void;
  deleteField: (id: string) => void;
}

const FieldBuilder: React.FC<Props> = ({ field, updateField, deleteField }) => {
  const { theme } = useTheme();
  const [showNested, setShowNested] = useState(true);
  const [enableDrag, setEnableDrag] = useState(true);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField({ ...field, label: e.target.value });

  const handleRequiredChange = () =>
    updateField({ ...field, required: !field.required });

  const handleOptionChange = (index: number, value: string) => {
    const options = [...(field.options || [])];
    options[index] = { label: value, value };
    updateField({ ...field, options });
  };

  const addOption = () =>
    updateField({
      ...field,
      options: [...(field.options || []), { label: "Option", value: "Option" }],
    });

  const deleteOption = (index: number) => {
    const options = field.options?.filter((_, i) => i !== index);
    updateField({ ...field, options });
  };

  const handleAddNestedField = (type: FieldType) => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label:
        type === "date"
          ? "Date of Birth"
          : `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      displayOnShortForm: false,
      options: ["dropdown", "tags", "checkboxes", "multipleChoice"].includes(
        type
      )
        ? [
            { label: "Option 1", value: "option_1" },
            { label: "Option 2", value: "option_2" },
          ]
        : undefined,
    };

    const updatedFields = [...(field.fields || []), newField];
    const updatedLayout = [
      ...(field.layout || []),
      {
        i: newField.id,
        x: 0,
        y: updatedFields.length * 2,
        w: 6,
        h: 6,
      },
    ];

    updateField({ ...field, fields: updatedFields, layout: updatedLayout });
  };

  const updateNestedField = (updatedNested: Field) => {
    const updatedFields = (field.fields || []).map((f) =>
      f.id === updatedNested.id ? updatedNested : f
    );
    updateField({ ...field, fields: updatedFields });
  };

  const deleteNestedField = (id: string) => {
    const updatedFields = (field.fields || []).filter((f) => f.id !== id);
    const updatedLayout = (field.layout || []).filter((l) => l.i !== id);
    updateField({ ...field, fields: updatedFields, layout: updatedLayout });
  };

  const onNestedLayoutChange = (newLayout: any) => {
    const idOrder = newLayout.map((l: any) => l.i);
    const reorderedFields = (field.fields || []).sort(
      (a, b) => idOrder.indexOf(a.id) - idOrder.indexOf(b.id)
    );
    updateField({ ...field, layout: newLayout, fields: reorderedFields });
  };

  const inputClass = `form-control ${
    theme === "dark" ? "bg-dark text-white border-secondary" : ""
  }`;

  return (
    <div
      className={`card p-3 mb-3 ${
        theme === "dark" ? "bg-dark text-white border-light" : ""
      }`}
    >
      <label className="form-label">Field Label</label>
      <input
        className={`${inputClass} mb-3`}
        value={field.label}
        onChange={handleLabelChange}
        placeholder="Enter field label"
        style={{ minHeight: "40px" }}
      />

      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={field.required}
          onChange={handleRequiredChange}
          id={`required-${field.id}`}
        />
        <label className="form-check-label" htmlFor={`required-${field.id}`}>
          Required
        </label>
      </div>

      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={field.displayOnShortForm}
          onChange={() =>
            updateField({
              ...field,
              displayOnShortForm: !field.displayOnShortForm,
            })
          }
          id={`shortform-${field.id}`}
        />
        <label className="form-check-label" htmlFor={`shortform-${field.id}`}>
          Show in Short Form
        </label>
      </div>

      {field.options && (
        <div className="mb-3">
          <label className="form-label">Options:</label>
          {field.options.map((opt, i) => (
            <div key={i} className="d-flex gap-2 align-items-center mb-2">
              <input
                className={inputClass}
                value={opt.label}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteOption(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addOption}
          >
            + Add Option
          </button>
        </div>
      )}

      {field.type === "section" && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Nested Fields</h6>
            <div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setEnableDrag(!enableDrag)}
              >
                {enableDrag ? "Disable" : "Enable"} Drag
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowNested(!showNested)}
              >
                {showNested ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {showNested && (
            <>
              <GridLayout
                className="layout"
                layout={field.layout || []}
                cols={12}
                rowHeight={30}
                width={window.innerWidth > 700 ? 600 : window.innerWidth - 50}
                onLayoutChange={onNestedLayoutChange}
                isDraggable={enableDrag}
                isResizable={enableDrag}
                draggableCancel=".non-draggable"
              >
                {(field.fields || []).map((nestedField) => (
                  <div key={nestedField.id} className="non-draggable">
                    <FieldBuilder
                      field={nestedField}
                      updateField={updateNestedField}
                      deleteField={deleteNestedField}
                    />
                  </div>
                ))}
              </GridLayout>

              <div className="mt-3">
                {[
                  "header",
                  "label",
                  "paragraph",
                  "linebreak",
                  "dropdown",
                  "tags",
                  "checkboxes",
                  "multipleChoice",
                  "text",
                  "number",
                  "date", // ✅ date field included
                ].map((type) => (
                  <button
                    key={type}
                    className="btn btn-sm btn-outline-secondary me-2 mb-2"
                    onClick={() => handleAddNestedField(type as FieldType)}
                  >
                    + {type}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn btn-outline-danger btn-sm mt-4"
        onClick={() => deleteField(field.id)}
      >
        Delete Field
      </button>
    </div>
  );
};

export default FieldBuilder;

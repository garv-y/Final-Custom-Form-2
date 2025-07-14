import React from "react";
import type { Field } from "../types/types";
import { useTheme } from "./ThemeContext";

interface Props {
  field: Field;
  updateField: (updated: Field) => void;
  deleteField: (id: string) => void;
}

const FieldBuilder: React.FC<Props> = ({ field, updateField, deleteField }) => {
  const { theme } = useTheme();

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

  const inputClass = `form-control ${
    theme === "dark" ? "bg-dark text-white border-secondary" : ""
  }`;

  return (
    <div
      className={`card p-3 mb-3 ${
        theme === "dark" ? "bg-dark text-white border-light" : ""
      }`}
    >
      {/* Field Label Input */}
      <label className="form-label">Field Label</label>
      <input
        className={`${inputClass} mb-3`}
        value={field.label}
        onChange={handleLabelChange}
        placeholder="Enter field label"
        style={{ minHeight: "40px" }}
      />

      {/* Required Checkbox */}
      <div className="form-check mb-3">
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

      <div className="form-check mb-3">
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

      {/* Options Editor */}
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

      {/* Delete Field Button */}
      <button
        type="button"
        className="btn btn-outline-danger btn-sm mt-2"
        onClick={() => deleteField(field.id)}
      >
        Delete Field
      </button>
    </div>
  );
};

export default FieldBuilder;

// src/Components/FieldRenderer.tsx

import React from "react";
import type { FieldConfig, FieldOption } from "../types/types";

interface FieldRendererProps {
  field: FieldConfig;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  error?: boolean;
  darkMode?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error = false,
}) => {
  const { label } = field;

  const renderError = () =>
    error && <small className="text-danger">This field is required.</small>;

  const baseInputClass = `form-control ${error ? "is-invalid" : ""}`;
  const borderCheckClass = `${error ? "border border-danger" : ""}`;

  switch (field.type) {
    case "header":
      return (
        <div className="mb-3">
          <h4
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || "")}
          >
            {value || label}
          </h4>
          <input type="hidden" value={value || label} />
        </div>
      );

    case "label":
      return (
        <div className="mb-3">
          <label
            className="form-label fw-bold"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || "")}
          >
            {value || label}
          </label>
          <input type="hidden" value={value || label} />
        </div>
      );

    case "paragraph":
      return (
        <div className="mb-3">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || "")}
          >
            {value || label}
          </p>
          <input type="hidden" value={value || label} />
        </div>
      );

    case "linebreak":
      return <hr className="my-4" />;

    case "text":
      return (
        <div className="mb-3">
          <label>{label}</label>
          <input
            type="text"
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight: "40px" }}
          />
          {renderError()}
        </div>
      );

    case "number":
      return (
        <div className="mb-3">
          <label>{label}</label>
          <input
            type="number"
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight: "40px" }}
          />
          {renderError()}
        </div>
      );

    case "dropdown":
      return (
        <div className="mb-3">
          <label>{label}</label>
          <select
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight: "40px" }}
          >
            <option value="">Select...</option>
            {field.options?.map((opt: FieldOption, i: number) => (
              <option key={i} value={opt.value ?? ""}>
                {opt.label ?? ""}
              </option>
            ))}
          </select>
          {renderError()}
        </div>
      );

    case "checkboxes":
      return (
        <div className="mb-3">
          <label className="d-block">{label}</label>
          {field.options?.map((opt: FieldOption, i: number) => (
            <div key={i} className="form-check">
              <input
                className={`form-check-input ${borderCheckClass}`}
                type="checkbox"
                checked={
                  Array.isArray(value) && value.includes(opt.value ?? "")
                }
                onChange={(e) => {
                  const current = Array.isArray(value) ? value : [];
                  const val = opt.value ?? "";
                  onChange(
                    e.target.checked
                      ? [...current, val]
                      : current.filter((v) => v !== val)
                  );
                }}
              />
              <label className="form-check-label text-wrap">
                {opt.label ?? ""}
              </label>
            </div>
          ))}
          {renderError()}
        </div>
      );

    case "multipleChoice":
      return (
        <div className="mb-3">
          <label className="d-block">{label}</label>
          {field.options?.map((opt: FieldOption, i: number) => (
            <div key={i} className="form-check">
              <input
                className={`form-check-input ${borderCheckClass}`}
                type="radio"
                name={`field-${field.id}`}
                value={opt.value ?? ""}
                checked={value === opt.value}
                onChange={() => onChange(opt.value ?? "")}
              />
              <label className="form-check-label text-wrap">
                {opt.label ?? ""}
              </label>
            </div>
          ))}
          {renderError()}
        </div>
      );

    case "tags":
      return (
        <div className="mb-3">
          <label className="form-label d-block">{label}</label>
          <div className="d-flex flex-wrap gap-2">
            {field.options?.map((opt: FieldOption, idx: number) => {
              const selected =
                Array.isArray(value) && value.includes(opt.value ?? "");
              const val = opt.value ?? "";
              return (
                <span
                  key={idx}
                  className={`badge rounded-pill px-3 py-2 ${
                    selected ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  onClick={() => {
                    const current = Array.isArray(value) ? value : [];
                    onChange(
                      selected
                        ? current.filter((v) => v !== val)
                        : [...current, val]
                    );
                  }}
                >
                  {opt.label ?? ""}
                </span>
              );
            })}
          </div>
          {renderError()}
        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;

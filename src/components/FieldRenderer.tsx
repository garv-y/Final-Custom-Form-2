import React, { useState } from "react";
import type { FieldConfig, FieldOption } from "../types/types";
import FieldRenderer from "./FieldRenderer";
import { useTheme } from "./ThemeContext";
import GridLayout from "react-grid-layout";

interface FieldRendererProps {
  field: FieldConfig;
  value?: string | string[] | Record<string, any>;
  onChange: (value: string | string[] | Record<string, any>) => void;
  error?: boolean | Record<string, boolean>;
  darkMode?: boolean;
}

const Renderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error = false,
}) => {
  const { theme } = useTheme();
  const { label } = field;
  const [isExpanded, setIsExpanded] = useState(true);

  const renderError = () =>
    error && <small className="text-danger">This field is required.</small>;

  const baseInputClass = `form-control ${error ? "is-invalid" : ""}`;
  const borderCheckClass = `${error ? "border border-danger" : ""}`;

  switch (field.type) {
    case "header":
      return (
        <div className="mb-3">
          <h4
            className={`mb-3 ${theme === "dark" ? "text-white" : ""}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || "")}
          >
            {(typeof value === "string" && value) || field.label || "Header"}
          </h4>
          <input type="hidden" value={typeof value === "string" ? value : ""} />
          {renderError()}
        </div>
      );

    case "label":
      return (
        <div className="mb-3">
          <label
            className={`form-label fw-bold ${
              theme === "dark" ? "text-white" : ""
            }`}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || "")}
          >
            {(typeof value === "string" && value) || field.label || "Label"}
          </label>
          <input type="hidden" value={typeof value === "string" ? value : ""} />
          {renderError()}
        </div>
      );

    case "paragraph":
      return (
        <div className="mb-3">
          <p
            className={theme === "dark" ? "text-white" : ""}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || "")}
          >
            {(typeof value === "string" && value) || field.label || "Paragraph"}
          </p>
          <input type="hidden" value={typeof value === "string" ? value : ""} />
          {renderError()}
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

    case "date":
      return (
        <div className="mb-3">
          <label>{label}</label>
          <input
            type="date"
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight: "40px" }}
            max={new Date().toISOString().split("T")[0]} // prevent future dates
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
                checked={typeof value === "string" && value === opt.value}
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

    case "section":
      return (
        <div className="mb-3 p-3 border rounded">
          <div className="d-flex justify-content-between align-items-center">
            <h5>{label}</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "−" : "+"}
            </button>
          </div>

          {isExpanded && (
            <div
              className={`p-2 rounded ${
                theme === "dark" ? "bg-dark-subtle" : "bg-light"
              }`}
            >
              <GridLayout
                className="layout"
                cols={12}
                rowHeight={5}
                width={920}
                layout={field.layout || []}
                isDraggable
                isResizable
                onLayoutChange={(newLayout) =>
                  onChange({ ...field, layout: newLayout })
                }
              >
                {(field.fields || []).map((nestedField) => {
                  const fieldLayoutItem = field.layout?.find(
                    (item) => item.i === nestedField.id
                  ) || {
                    i: nestedField.id,
                    x: 0,
                    y: Infinity,
                    w: 6,
                    h: 8,
                  };

                  return (
                    <div key={nestedField.id} data-grid={fieldLayoutItem}>
                      <FieldRenderer
                        field={nestedField}
                        value={
                          typeof value === "object" && !Array.isArray(value)
                            ? value[nestedField.id]
                            : ""
                        }
                        onChange={(val) =>
                          onChange({
                            ...(typeof value === "object" &&
                            !Array.isArray(value)
                              ? value
                              : {}),
                            [nestedField.id]: val,
                          })
                        }
                        error={
                          typeof error === "object"
                            ? error[nestedField.id]
                            : false
                        }
                      />
                    </div>
                  );
                })}
              </GridLayout>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default Renderer;

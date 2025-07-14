import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GridLayout from "react-grid-layout";
import FieldBuilder from "./FieldBuilder";
import FieldRenderer from "./FieldRenderer";
import { useTheme } from "./ThemeContext";
import type { FieldConfig, FieldType } from "../types/types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const defaultHeightMap: Record<FieldType, number> = {
  header: 7.3,
  label: 7.3,
  paragraph: 7.3,
  linebreak: 7.3,
  text: 7.3,
  number: 7.3,
  dropdown: 11,
  tags: 11,
  checkboxes: 11,
  multipleChoice: 11,
};

type LayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
};

const FormBuilder: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  const [formTitle, setFormTitle] = useState("My Custom Form");
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [, setSubmittedData] = useState<Record<string, any> | null>(null);
  const [useShortForm, setUseShortForm] = useState(false);

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const addField = (type: FieldType) => {
    const id = Date.now().toString();
    const newField: FieldConfig = {
      id,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
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

    const height = defaultHeightMap[type] || 6;

    const baseLayout: LayoutItem = {
      i: id,
      x: (layout.length * 2) % 12,
      y: Infinity,
      w: 6,
      h: height,
    };

    setFields((prev) => [...prev, newField]);
    setLayout((prev) => [...prev, baseLayout]);
  };

  const updateField = (updatedField: FieldConfig) => {
    setFields((prev) =>
      prev.map((f) => (f.id === updatedField.id ? updatedField : f))
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setLayout((prev) => prev.filter((l) => l.i !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    const result: Record<string, any> = {};

    fields.forEach((field) => {
      if (!useShortForm || field.displayOnShortForm) {
        const value = formResponses[field.id];
        const isEmpty =
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);
        if (field.required && isEmpty) {
          newErrors[field.id] = true;
        }
        result[field.label || `Field ${field.id}`] = value;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmittedData(result);
    localStorage.setItem("submittedData", JSON.stringify(result));
    const newEntry = {
      id: Date.now().toString(),
      title: formTitle,
      timestamp: new Date().toISOString(),
      responses: result,
      fields,
    };
    const existing = JSON.parse(localStorage.getItem("recentForms") || "[]");
    localStorage.setItem(
      "recentForms",
      JSON.stringify([newEntry, ...existing])
    );
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="d-flex">
      <div className="container mt-4 flex-grow-1" ref={containerRef}>
        <div
          className={`navbar navbar-expand-lg mb-5 px-3 py-3 rounded ${
            theme === "dark" ? "bg-dark navbar-dark" : "bg-white navbar-light"
          }`}
        >
          <h3 className="mb-0">Form Builder</h3>
          <div className="d-flex gap-2 ms-auto">
            <button
              className={`btn ${
                theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
              }`}
              onClick={toggleTheme}
            >
              Switch to {theme === "light" ? "Dark" : "Light"} Theme
            </button>
            <button
              className={`btn ${
                theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
              }`}
              onClick={() => navigate("/")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Form Title</label>
          <input
            type="text"
            className="form-control"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>

        <GridLayout
          className="layout mb-5"
          layout={layout}
          cols={12}
          rowHeight={35}
          width={containerWidth - 30}
          onLayoutChange={(newLayout: LayoutItem[]) => setLayout(newLayout)}
          isDraggable
          isResizable
          draggableCancel=".non-draggable"
        >
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded p-3 dark-bg-card"
              style={{ overflow: "visible", minHeight: "140px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="non-draggable">
                  Field #{index + 1} - {field.type}
                </h5>
                <button
                  className="btn btn-sm btn-outline-danger non-draggable"
                  onClick={() => removeField(field.id)}
                >
                  Remove
                </button>
              </div>
              <div className="non-draggable">
                <FieldBuilder
                  field={field}
                  updateField={updateField}
                  deleteField={removeField}
                />
              </div>
            </div>
          ))}
        </GridLayout>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="shortFormToggle"
            checked={useShortForm}
            onChange={(e) => setUseShortForm(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="shortFormToggle">
            Show Short Form Only
          </label>
        </div>

        <div
          className={`card shadow-sm border-0 p-4 border rounded form-preview ${
            theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
          }`}
          style={{
            maxHeight: "930px",
            overflowY: "auto",
            resize: "horizontal",
          }}
        >
          <h4 className="mb-3">Live Preview</h4>
          <h5>{formTitle}</h5>
          <form onSubmit={handleSubmit}>
            <GridLayout
              className="layout"
              layout={[
                ...layout.filter((item) => {
                  const field = fields.find((f) => f.id === item.i);
                  return field && (!useShortForm || field.displayOnShortForm);
                }),
                {
                  i: "submit-button",
                  x: 0,
                  y: 0,
                  w: 11,
                  h: 2,
                  static: true,
                },
              ]}
              cols={12}
              rowHeight={5}
              width={containerWidth - 60}
              isDraggable={false}
              isResizable={false}
              compactType={null}
            >
              {fields
                .filter((f) => !useShortForm || f.displayOnShortForm)
                .map((f) => (
                  <div
                    key={f.id}
                    className="non-draggable"
                    style={{ height: "100%" }}
                  >
                    <FieldRenderer
                      field={f}
                      value={formResponses[f.id]}
                      onChange={(val) => {
                        setFormResponses((prev) => ({ ...prev, [f.id]: val }));
                        setErrors((prev) => ({ ...prev, [f.id]: false }));
                      }}
                      error={errors[f.id] || false}
                    />
                  </div>
                ))}

              <div key="submit-button" className="non-draggable">
                <button
                  type="submit"
                  className={`btn mg-3 ${
                    theme === "dark"
                      ? "btn-outline-success"
                      : "btn-outline-success"
                  }`}
                >
                  Submit
                </button>
              </div>
            </GridLayout>
          </form>
          {formSubmitted && (
            <div className="alert alert-success mt-4">
              Form submitted successfully!
            </div>
          )}
        </div>
      </div>

      <div
        className="toolbox-sidebar border-start p-3 dark-bg-card form-preview"
        style={{ width: "220px" }}
      >
        <h5 className="mb-3">Toolbox</h5>
        <ul className="list-unstyled">
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
          ].map((type) => (
            <li key={type}>
              <button
                className={`btn w-100 mb-2 shadow-sm form-preview ${
                  theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                onClick={() => addField(type as FieldType)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormBuilder;

import React, { useState } from "react";
import type { Field } from "../types/types";
import { useTheme } from "./ThemeContext";

interface FABProps {
  mode: "add" | "toggle";
  onAddField?: (type: Field["type"]) => void;
  onClick?: () => void;
}

const fieldTypes: Field["type"][] = [
  "header",
  "paragraph",
  "label",
  "text",
  "number",
  "dropdown",
  "checkboxes",
  "multipleChoice",
  "tags",
  "linebreak",
  "date",
  "section",
];

const FAB: React.FC<FABProps> = ({ mode, onAddField, onClick }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const fabStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 1050,
  };

  if (mode === "toggle") {
    return (
      <button
        className="btn btn-success rounded-circle"
        style={{ ...fabStyle, width: 56, height: 56 }}
        onClick={onClick}
        title="Open Toolbox"
      >
        +
      </button>
    );
  }

  return (
    <div style={fabStyle}>
      {open && (
        <div
          className={`card shadow p-3 rounded ${
            theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
          }`}
          style={{
            position: "absolute",
            bottom: 10,
            right: 0,
            minWidth: "220px",
            maxHeight: "90vh",
          }}
        >
          {/* Close button */}
          <button
            className="btn btn-sm btn-outline-primary rounded-circle"
            style={{
              position: "absolute",
              top: "-18px",
              right: "-18px",
              width: "40px",
              height: "40px",
              fontWeight: "bold",
            }}
            onClick={() => setOpen(false)}
          >
            ×
          </button>

          <h6 className="mb-3">Add Field</h6>
          {fieldTypes.map((type) => (
            <button
              key={type}
              className="btn btn-sm btn-outline-primary mb-2 w-100 text-start"
              onClick={() => {
                onAddField?.(type);
                setOpen(false);
              }}
            >
              + {type}
            </button>
          ))}
        </div>
      )}

      {/* FAB main button */}
      {!open && (
        <button
          className="btn btn-primary rounded-circle"
          style={{ width: 56, height: 56 }}
          onClick={() => setOpen(true)}
          title="Add Field"
        >
          +
        </button>
      )}
    </div>
  );
};

export default FAB;

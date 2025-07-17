import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";

// Type definition for a saved form's data structure
interface FormData {
  id: string;
  title: string;
  timestamp?: string;
  responses?: Record<string, any>; // <-- use any to allow object values
  fields?: any[]; // Optional – present if needed for display (not used here)
  isDeleted?: boolean; // Optional – helpful for soft-deletion
}

const FormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData | null>(null);

  // Fetch form data from localStorage based on ID in URL
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentForms") || "[]");
    const matchedForm = saved.find((f: FormData) => f.id.toString() === id);
    setForm(matchedForm || null);
  }, [id]);

  if (!form) {
    return (
      <div
        className={`container py-5 min-vh-100 ${
          theme === "dark" ? "bg-dark-soft text-white" : ""
        }`}
      >
        <h3>Form not found</h3>
        <button onClick={() => navigate("/")} className="btn btn-dark mt-3">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Format timestamp
  let formattedDate = "Unknown";
  if (form.timestamp) {
    const parsed = new Date(form.timestamp);
    if (!isNaN(parsed.getTime())) {
      formattedDate = parsed.toLocaleString();
    }
  }

  return (
    <div
      className={`container py-5 min-vh-100 ${
        theme === "dark" ? "bg-dark-soft text-white" : ""
      }`}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">{form.title}</h2>
        <div className="d-flex gap-2">
          <button
            onClick={toggleTheme}
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
            }`}
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
          <button
            onClick={() => navigate("/")}
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
            }`}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Timestamp */}
      <p>
        <strong>Submission Time:</strong> {formattedDate}
      </p>

      {/* Submitted Data */}
      <div className="mt-4">
        <h5>Submitted Data:</h5>
        <div
          className={`p-3 rounded ${
            theme === "dark" ? "bg-dark-soft text-white" : "bg-light text-dark"
          }`}
        >
          {form.responses && Object.keys(form.responses).length > 0 ? (
            <ul className="list-group">
              {Object.entries(form.responses).map(([label, val]) => (
                <li key={label} className="list-group-item">
                  <strong>{label}:</strong>{" "}
                  {Array.isArray(val) ? (
                    val.join(", ")
                  ) : typeof val === "object" ? (
                    <pre className="m-0">{JSON.stringify(val, null, 2)}</pre>
                  ) : (
                    val
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No responses submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormView;

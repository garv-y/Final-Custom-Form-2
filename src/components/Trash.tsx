import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

// Trash Page – handles viewing/restoring/deleting soft-deleted forms and templates
const Trash: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Theme hook with toggle
  const navigate = useNavigate();

  // State for deleted forms and templates
  const [forms, setForms] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // On mount, load all deleted forms and templates from localStorage
  useEffect(() => {
    const allForms = JSON.parse(localStorage.getItem("recentForms") || "[]");
    setForms(allForms.filter((f: any) => f.isDeleted));

    const allTemplates = JSON.parse(localStorage.getItem("templates") || "[]");
    setTemplates(allTemplates.filter((t: any) => t.isDeleted));
  }, []);

  // Restore a deleted form by updating its isDeleted flag
  const restoreForm = (id: number) => {
    const all = JSON.parse(localStorage.getItem("recentForms") || "[]");
    const updated = all.map((f: any) =>
      f.id === id ? { ...f, isDeleted: false } : f
    );
    localStorage.setItem("recentForms", JSON.stringify(updated));
    setForms(updated.filter((f: any) => f.isDeleted));
  };

  // Permanently delete a form from localStorage
  const deleteFormPermanently = (id: number) => {
    const all = JSON.parse(localStorage.getItem("recentForms") || "[]");
    const updated = all.filter((f: any) => f.id !== id);
    localStorage.setItem("recentForms", JSON.stringify(updated));
    setForms(updated.filter((f: any) => f.isDeleted));
  };

  // Restore a deleted template
  const restoreTemplate = (id: string) => {
    const all = JSON.parse(localStorage.getItem("templates") || "[]");
    const updated = all.map((t: any) =>
      t.id === id ? { ...t, isDeleted: false } : t
    );
    localStorage.setItem("templates", JSON.stringify(updated));
    setTemplates(updated.filter((t: any) => t.isDeleted));
  };

  // Permanently delete a template
  const deleteTemplatePermanently = (id: string) => {
    const all = JSON.parse(localStorage.getItem("templates") || "[]");
    const updated = all.filter((t: any) => t.id !== id);
    localStorage.setItem("templates", JSON.stringify(updated));
    setTemplates(updated.filter((t: any) => t.isDeleted));
  };

  return (
    <div
      className={`container py-4 min-vh-100 ${
        theme === "dark" ? "bg-dark-soft text-white" : "bg-light text-dark"
      }`}
    >
      {/* Header with Title and Navigation Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Trash</h2>
        <div className="d-flex gap-2 ms-auto">
          <button
            onClick={toggleTheme}
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
            }`}
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
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

      {/* Section: Deleted Templates */}
      <h4 className="mb-3">Deleted Templates</h4>
      {templates.length === 0 ? (
        <div
          className={`alert ${
            theme === "dark" ? "bg-dark text-light border-dark" : "alert-light"
          }`}
        >
          No deleted Templates.
        </div>
      ) : (
        <div className="row">
          {templates.map((t) => (
            <div className="col-md-4 mb-3" key={t.id}>
              <div
                className={`card h-100 ${
                  theme === "dark" ? "bg-dark text-white" : ""
                }`}
              >
                <div className="card-body">
                  <h5>{t.title}</h5>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => restoreTemplate(t.id)}
                    >
                      Restore
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTemplatePermanently(t.id)}
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-5" />

      {/* Section: Deleted Forms */}
      <h4 className="mb-3">Deleted Forms</h4>
      {forms.length === 0 ? (
        <div
          className={`alert ${
            theme === "dark" ? "bg-dark text-light border-dark" : "alert-light"
          }`}
        >
          No deleted forms.
        </div>
      ) : (
        <div className="row">
          {forms.map((form) => (
            <div className="col-md-4 mb-3" key={form.id}>
              <div
                className={`card h-100 ${
                  theme === "dark" ? "bg-dark text-white" : ""
                }`}
              >
                <div className="card-body">
                  <h5>{form.title}</h5>
                  <p className="card-text">
                    Deleted on:{" "}
                    {new Date(
                      form.deletedAt || form.timestamp
                    ).toLocaleString()}
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => restoreForm(form.id)}
                    >
                      Restore
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteFormPermanently(form.id)}
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;

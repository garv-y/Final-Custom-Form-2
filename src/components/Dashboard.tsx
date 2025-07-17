import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import RecentFormCard from "./RecentFormCard";

interface RecentForm {
  id: number;
  title: string;
  timestamp: string;
  isDeleted?: boolean;
}

interface SavedTemplate {
  id: string;
  title: string;
  fields: any[];
  isDeleted?: boolean;
}

interface SubmittedTemplate {
  id: string;
  title: string;
  submittedAt: string;
  responses: Record<string, string | string[]>;
  fields: any[];
  isDeleted?: boolean;
}

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [recentForms, setRecentForms] = useState<RecentForm[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [submittedTemplates, setSubmittedTemplates] = useState<
    SubmittedTemplate[]
  >([]);

  useEffect(() => {
    const forms = (
      JSON.parse(localStorage.getItem("recentForms") || "[]") as any[]
    ).map((f) => ({
      ...f,
      id: Number(f.id),
    }));
    setRecentForms(forms.filter((f) => !f.isDeleted));

    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    setSavedTemplates(templates.filter((t: SavedTemplate) => !t.isDeleted));

    const submissions = JSON.parse(
      localStorage.getItem("submittedTemplates") || "[]"
    );
    setSubmittedTemplates(
      submissions.filter((s: SubmittedTemplate) => !s.isDeleted)
    );
  }, []);

  const softDeleteForm = (id: number) => {
    const forms = (
      JSON.parse(localStorage.getItem("recentForms") || "[]") as any[]
    ).map((f) => ({
      ...f,
      id: Number(f.id),
    }));
    const updated = forms.map((f) =>
      f.id === id ? { ...f, isDeleted: true, deletedAt: Date.now() } : f
    );
    localStorage.setItem("recentForms", JSON.stringify(updated));
    setRecentForms(updated.filter((f) => !f.isDeleted));
  };

  const softDeleteTemplate = (id: string) => {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    const updated = templates.map((t: SavedTemplate) =>
      t.id === id ? { ...t, isDeleted: true, deletedAt: Date.now() } : t
    );
    localStorage.setItem("templates", JSON.stringify(updated));
    setSavedTemplates(updated.filter((t: SavedTemplate) => !t.isDeleted));
  };

  const softDeleteSubmission = (id: string) => {
    const submissions = JSON.parse(
      localStorage.getItem("submittedTemplates") || "[]"
    );
    const updated = submissions.map((s: SubmittedTemplate) =>
      s.id === id ? { ...s, isDeleted: true, deletedAt: Date.now() } : s
    );
    localStorage.setItem("submittedTemplates", JSON.stringify(updated));
    setSubmittedTemplates(
      updated.filter((s: SubmittedTemplate) => !s.isDeleted)
    );
  };

  const defaultTemplates = [
    { id: "feedback", name: "Feedback Form" },
    { id: "registration", name: "Registration Form" },
    { id: "survey", name: "Survey Form" },
  ];

  return (
    <div
      className={`pb-4 min-vh-100 ${
        theme === "dark" ? "bg-dark-soft text-white" : "bg-light text-dark"
      }`}
    >
      <nav
        className={`navbar navbar-expand-lg mb-3 px-3 py-3 shadow-sm ${
          theme === "dark" ? "bg-dark navbar-dark" : "bg-white navbar-light"
        }`}
      >
        <div className="container-fluid">
          <span className="navbar-brand fw-bold fs-3">Forms Dashboard</span>
          <div className="d-flex gap-2">
            <Link to="/form-builder">
              <button className="btn btn-outline-primary">+ Blank Form</button>
            </Link>
            <button
              className={`btn ${
                theme === "light" ? "btn-outline-dark" : "btn-outline-light"
              }`}
              onClick={toggleTheme}
            >
              Switch To {theme === "light" ? "Dark" : "Light"} Mode
            </button>
            <Link to="/trash">
              <button className="btn btn-outline-danger">View Trash</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Default Templates */}
      <h4 className="px-4 py-4">Start with a Template</h4>
      <div className="row px-3 py-3">
        {defaultTemplates.map((template) => (
          <div className="col-md-4" key={template.id}>
            <div
              className={`card h-100 shadow-sm border-0 ${
                theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
              }`}
            >
              <div className="card-body">
                <h5 className="card-title">{template.name}</h5>
                <p className="card-text">
                  {template.name === "Feedback Form" &&
                    "We’d love to hear your thoughts!"}
                  {template.name === "Registration Form" &&
                    "Tell us about yourself to get started!"}
                  {template.name === "Survey Form" &&
                    "Share your experience to help us get better!"}
                </p>
                <Link
                  to={`/template/${template.id}`}
                  className="text-decoration-none"
                >
                  <button className="btn btn-outline-primary btn-sm">
                    Use Template
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Templates */}
      {savedTemplates.length > 0 && (
        <>
          <h4 className="mt-5 mb-4 px-4 py-2">Your Saved Templates</h4>
          <div className="row px-3 py-3">
            {savedTemplates.map((template) => (
              <div className="col-md-4 mb-4" key={template.id}>
                <div
                  className={`card h-100 shadow-sm border-0 ${
                    theme === "dark"
                      ? "bg-dark text-white"
                      : "bg-white text-dark"
                  }`}
                >
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{template.title}</h5>
                      <p className="card-text">Custom template you created.</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <Link
                        to={`/template/${template.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Use
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => softDeleteTemplate(template.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Submitted Templates */}
      {submittedTemplates.length > 0 && (
        <>
          <h4 className="mt-5 mb-4 px-4 py-4">Submitted Templates</h4>
          <div className="row mb-2 px-3 py-3">
            {submittedTemplates.map((submission) => (
              <div className="col-md-4 mb-4" key={submission.id}>
                <div
                  className={`card h-100 shadow-sm border-0 ${
                    theme === "dark"
                      ? "bg-dark text-white"
                      : "bg-white text-dark"
                  }`}
                >
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{submission.title}</h5>
                      <p className="card-text">
                        Submitted at:{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <Link
                        to={`/submission/${submission.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => softDeleteSubmission(submission.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recent Forms */}
      <hr className="my-5" />
      <h4 className="mb-3 px-4 py-3">Recent Forms</h4>
      {recentForms.length === 0 ? (
        <div
          style={{ margin: "20px" }}
          className={`alert ${
            theme === "dark" ? "bg-dark text-light border-dark" : "alert-light"
          }`}
        >
          No recent forms yet.
        </div>
      ) : (
        <div className="row px-3 py-3">
          {recentForms.map((form) => {
            const submission = submittedTemplates.find(
              (s) => s.id === String(form.id)
            );
            return (
              <div className="col-md-4 mb-4" key={form.id}>
                <RecentFormCard
                  form={{
                    id: form.id,
                    title: form.title,
                    timestamp: form.timestamp,
                    data: submission?.responses || {},
                    fields: submission?.fields || [],
                  }}
                  onDelete={softDeleteForm}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

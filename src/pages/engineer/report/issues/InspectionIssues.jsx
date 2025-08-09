import React from "react";
import MediaCaptureUpload from "./MediaCaptureUpload";
import ToggleButton from "./ToggleButton";

export default function InspectionIssues({ title, fields, data, onDataChange }) {
  const handleFieldChange = (key, value) => {
    onDataChange({ ...data, [key]: value });
  };

  return (
    <div className="p-4 border rounded bg-white mb-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-4">
        {fields.map((field, idx) => {
          if (field.type === "number") {
            return (
              <div key={idx}>
                <label className="font-medium">{field.label}</label>
                <input
                  type="number"
                  value={data[field.key] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.key, Number(e.target.value))
                  }
                  className="border p-1 rounded w-full"
                />
              </div>
            );
          }
          if (field.type === "text") {
            return (
              <div key={idx}>
                <label className="font-medium">{field.label}</label>
                <input
                  type="text"
                  value={data[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </div>
            );
          }
          if (field.type === "toggle") {
            return (
              <ToggleButton
                key={idx}
                label={field.label}
                value={!!data[field.key]}
                onChange={(val) => handleFieldChange(field.key, val)}
              />
            );
          }
          if (field.type === "images") {
            return (
              <MediaCaptureUpload
                key={idx}
                label={field.label}
                value={data[field.key] || []}
                onChange={(val) => handleFieldChange(field.key, val)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
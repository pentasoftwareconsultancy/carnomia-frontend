import React from "react";

export default function ToggleButton({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="font-medium">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`px-4 py-1 rounded-full text-white ${
          value ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {value ? "Yes" : "No"}
      </button>
    </div>
  );
}
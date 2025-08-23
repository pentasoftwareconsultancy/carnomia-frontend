import React, { useRef } from "react";

export default function MediaCaptureUpload({ label, value = [], onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    onChange([...(value || []), ...urls]); // add new images
  };

  const handleCapture = (e) => {
    handleFileChange(e);
  };

  const removeImage = (index) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Upload
        </button>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          id="cameraInput"
          onChange={handleCapture}
        />
        <label
          htmlFor="cameraInput"
          className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer"
        >
          Camera
        </label>
      </div>

      <div className="flex gap-2 flex-wrap">
        {value?.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20">
            <img
              src={img}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
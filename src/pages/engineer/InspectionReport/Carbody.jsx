import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaTimes, FaCamera, FaUpload } from "react-icons/fa";

export default function CarBody() {
  const panels = [
    "Bonnet",
    "Front Left Fender",
    "Bumper",
    "Front Left Door",
    "Rear Left Door",
    "Rear Left Panel",
    "Boot",
    "Rear Bumper",
  ];

  return (
    <div className="bg-[#F1FFE0] min-h-screen py-10 font-sans">
      <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-16">
        {panels.map((name, idx) => (
          <BodyPanelCard key={idx} index={idx + 1} label={name} />
        ))}
      </div>
    </div>
  );
}

function BodyPanelCard({ index, label }) {
  const [form, setForm] = useState({
    paintThickness: "",
    issue: "",
    leftOrvm: "",
    cladding: "",
  });
  const update = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  const [photos, setPhotos] = useState([]);
  const [previewIdx, setPreviewIdx] = useState(null);
  const [showCam, setShowCam] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const addPhotos = (files) => {
    const urls = Array.from(files)
      .slice(0, 4 - photos.length)
      .map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls]);
  };

  const removePhoto = (i) => {
    URL.revokeObjectURL(photos[i]);
    setPhotos((p) => p.filter((_, idx) => idx !== i));
  };

  useEffect(() => () => photos.forEach((u) => URL.revokeObjectURL(u)), []);

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && setPreviewIdx(null);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const openLiveCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = s;
      videoRef.current.srcObject = s;
      await videoRef.current.play();
      setShowCam(true);
    } catch {
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    const v = videoRef.current;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob((b) => {
      const url = URL.createObjectURL(b);
      setPhotos((p) => [...p, url].slice(0, 4));
    }, "image/jpeg");
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setShowCam(false);
  };

  const showPaintThickness = label !== "Bumper";
  const showLeftOrvm = label === "Front Left Door";
  const showCladding = [
    "Front Left Door",
    "Rear Left Door",
    "Rear Left Panel",
    "Boot",
    "Rear Bumper",
  ].includes(label);

  return (
    <section
      className={`border border-gray-400 rounded-xl p-5 bg-[#F1FFE0] ${
        index > 1 ? "mt-8" : ""
      }`}
    >
      {index === 1 && <h2 className="text-lg font-bold mb-4">Body Panels</h2>}

      <h3 className="font-medium mb-3">
        {index}. {label}
      </h3>

      <div className="space-y-3">
        {showPaintThickness && (
          <FormRow
            label="Paint Thickness"
            value={form.paintThickness}
            onChange={update("paintThickness")}
          />
        )}
        <FormRow label="Issue" value={form.issue} onChange={update("issue")} />
        {showLeftOrvm && (
          <FormRow
            label="Left ORVM Issue"
            value={form.leftOrvm}
            onChange={update("leftOrvm")}
          />
        )}
        {showCladding && (
          <FormRow
            label="Cladding Issue"
            value={form.cladding}
            onChange={update("cladding")}
          />
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-gray-800 mb-2">
          {photos.length} of 4 photos
        </p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative w-12 h-12 sm:w-14 sm:h-14 border border-gray-600 rounded-md flex items-center justify-center bg-white hover:bg-gray-100 cursor-pointer transition-all"
              onClick={() =>
                photos[i] ? setPreviewIdx(i) : fileInputRef.current?.click()
              }
            >
              {photos[i] ? (
                <>
                  <img
                    src={photos[i]}
                    alt={`panel-${index}-photo-${i}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(i);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <FaPlus className="text-base text-black" />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <ControlBtn icon={FaCamera} label="Take Photo" onClick={openLiveCamera} />
          <ControlBtn
            icon={FaUpload}
            label="Upload from Gallery"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addPhotos(e.target.files)}
          />
        </div>
      </div>

      {showCam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-xl w-full max-w-sm space-y-4">
            <video ref={videoRef} className="w-full rounded-lg" autoPlay muted />
            <div className="flex gap-3">
              <button
                onClick={capturePhoto}
                className="flex-1 bg-green-600 text-white py-2 rounded-md"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="flex-1 bg-gray-500 text-white py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {previewIdx !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <img
            src={photos[previewIdx]}
            alt="Full preview"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold"
            onClick={() => setPreviewIdx(null)}
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
}

function FormRow({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 bg-white"
      />
    </div>
  );
}

const ControlBtn = ({ icon: Icon, label, ...rest }) => (
  <button
    {...rest}
    className="flex items-center gap-2 border border-gray-400 bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded-md text-xs sm:text-sm shadow-sm"
  >
    <Icon className="text-sm" /> {label}
  </button>
);
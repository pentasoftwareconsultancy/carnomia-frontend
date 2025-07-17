import React, { useRef, useState, useEffect } from "react";
import { FaCamera, FaUpload, FaPlus, FaUser, FaTimes } from "react-icons/fa";

export default function Report() {
  return (
    <div className="bg-[#F1FFE0] min-h-screen py-10 font-sans">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
          <h1 className="text-xl font-semibold">Drivesta</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">PDI Date: 03/07/2025</p>
            <FaUser className="text-xl" />
          </div>
        </header>

        <h2 className="text-lg font-bold mb-4">PDI Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <InfoCard
            data={{
              "Customer Name :": "Nil Joshi",
              "Engineer Name:": "Mayank Gupta",
              "Inspection Time:": "1:00 PM",
              Location: "Sasvad",
              Transmission: "Automatic",
              "Car Status:": "New",
            }}
          />
          <InfoCard
            data={{
              Brand: "Land Rover",
              Model: "Range Rover Evoque",
              Variant: "Likely Dynamic SE",
              Fuel: "Petrol",
              Transmission: "Automatic",
              "Car Status:": "New",
            }}
          />
        </div>

        <h2 className="text-lg font-bold mb-2">Profile Photos</h2>
        {["Front Left", "Rear Left", "Front Right", "Rear Right"].map((title, i) => (
          <PhotoCard key={i} heading={`${i + 1}. ${title}`} isLast={i === 3} />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ data }) {
  return (
    <div className="bg-gray-50 border border-gray-400 rounded-lg p-4 text-sm space-y-1">
      {Object.entries(data).map(([label, value]) => (
        <p key={label}>
          <strong>{label}</strong> {value}
        </p>
      ))}
    </div>
  );
}

function PhotoCard({ heading, isLast }) {
  const [photos, setPhotos] = useState([]);
  const [showCam, setShowCam] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const urls = Array.from(files)
      .slice(0, 4 - photos.length)
      .map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
  };

  const removePhoto = (i) => {
    URL.revokeObjectURL(photos[i]);
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    return () => photos.forEach((u) => URL.revokeObjectURL(u));
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

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setPreviewIdx(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <section
      className={`border border-gray-400 rounded-xl p-4 bg-[#F1FFE0] ${
        !isLast ? "mb-6" : ""
      }`}
    >
      <h3 className="font-medium">{heading}</h3>
      <p className="text-xs text-gray-700 mb-2">{photos.length} of 4 photos</p>

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
                  alt={`preview-${i}`}
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
          onChange={(e) => handleFiles(e.target.files)}
        />
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

const ControlBtn = ({ icon: Icon, label, ...rest }) => (
  <button
    {...rest}
    className="flex items-center gap-2 border border-gray-400 bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded-md text-xs sm:text-sm shadow-sm"
  >
    <Icon className="text-sm" /> {label}
  </button>
);
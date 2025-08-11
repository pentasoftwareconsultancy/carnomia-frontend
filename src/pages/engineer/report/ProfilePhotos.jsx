import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from "react-icons/ai";
import FileUploaderService from "../../../services/upload-document.service";

const ProfilePhotos = ({ formData, setFormData }) => {
  const labels = ["front_left_imageUrl", "front_right_imageUrl", "rear_left_imageUrl", "rear_right_imageUrl"];

 

  const videoRefs = useRef(
    labels.reduce((acc, label) => ({ ...acc, [label]: null }), {})
  );
  const [streamStates, setStreamStates] = useState(
    labels.reduce((acc, label) => ({ ...acc, [label]: null }), {})
  );
  const [isCameraActive, setIsCameraActive] = useState(
    labels.reduce((acc, label) => ({ ...acc, [label]: false }), {})
  );
  const [photos, setPhotos] = useState(
    labels.reduce(
      (acc, label) => ({ ...acc, [label]: formData[labels] || null }),
      {}
    )
  );
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);

  const labelNames = {
    front_left_imageUrl: "1. Front Left",
    front_right_imageUrl: "2. Front Right",
    rear_left_imageUrl: "3. Rear Left",
    rear_right_imageUrl: "4. Rear Right",
  };

  // Cleanup camera streams on unmount
  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach((stream) => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [streamStates]);

  useEffect(() => {
    const newPhotos = {};
    labels.forEach((label) => {
      newPhotos[label] = formData[labelToBackendField[label]] || null;
    });
    setPhotos(newPhotos);
  }, [formData]);

  const handleFileUpload = async (e, label) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        // Upload file using your service
        const uploadedUrl = await FileUploaderService.uploadFile(file);

        // Update photos state and parent form data
        setPhotos((prev) => ({ ...prev, [label]: uploadedUrl }));

        setFormData((prev) => ({
          ...prev,
          [labelToBackendField[label]]: uploadedUrl,
        }));

        setShowDropdown(null);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed, please try again.");
      }
    }
  };

  const handleCameraClick = async (label) => {
    if (!isCameraActive[label]) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStreamStates((prev) => ({ ...prev, [label]: stream }));
        if (videoRefs.current[label]) videoRefs.current[label].srcObject = stream;
        setIsCameraActive((prev) => ({ ...prev, [label]: true }));
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied. Please allow camera permissions.");
      }
    } else {
      takePhoto(label);
    }
  };

  const takePhoto = (label) => {
    const video = videoRefs.current[label];
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) return;

          try {
            // Upload blob using your service
            const uploadedUrl = await FileUploaderService.uploadFile(blob);

            // Update photos and form data
            setPhotos((prev) => ({ ...prev, [label]: uploadedUrl }));
            setFormData((prev) => ({
              ...prev,
              [labelToBackendField[label]]: uploadedUrl,
            }));

            stopCamera(label);
            setIsCameraActive((prev) => ({ ...prev, [label]: false }));
            setShowDropdown(null);
          } catch (error) {
            console.error("Upload failed:", error);
            alert("Photo upload failed, please try again.");
          }
        },
        "image/png"
      );
    }
  };

  const stopCamera = (label) => {
    if (streamStates[label]) {
      streamStates[label].getTracks().forEach((track) => track.stop());
      setStreamStates((prev) => ({ ...prev, [label]: null }));
      if (videoRefs.current[label]) videoRefs.current[label].srcObject = null;
    }
  };

  const toggleDropdown = (label) => {
    setShowDropdown(showDropdown === label ? null : label);
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">
        Profile Photos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {labels.map((label) => (
          <div key={label} className="flex flex-col w-full">
            <label className="text-md text-white font-medium text-left mb-2">
              {labelNames[label]}
            </label>
            <div className="mt-2 flex flex-col items-center">
              <div className="mt-2 flex flex-wrap gap-4 justify-center">
                <div className="relative">
                  {photos[label] ? (
                    <img
                      src={photos[label]}
                      alt={labelNames[label]}
                      className="w-24 h-24 object-cover rounded-md cursor-pointer"
                      onClick={() => setShowPhoto(photos[label])}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                      <button
                        onClick={() => toggleDropdown(label)}
                        className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                      >
                        <AiOutlinePlus className="text-xl" />
                      </button>
                    </div>
                  )}

                  {/* Dropdown options */}
                  {showDropdown === label && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                      <button
                        onClick={() => handleCameraClick(label)}
                        className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700 w-full text-left"
                      >
                        <AiOutlineCamera className="mr-2" /> Take Photo
                      </button>
                      <label className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700 cursor-pointer w-full">
                        <AiOutlineUpload className="mr-2" /> Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, label)}
                        />
                      </label>
                    </div>
                  )}

                  {/* Live camera preview */}
                  <video
                    ref={(el) => (videoRefs.current[label] = el)}
                    autoPlay
                    className={isCameraActive[label] ? "w-24 h-24 rounded-md" : "hidden"}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Photo View */}
      {showPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative max-w-screen max-h-screen p-4">
            <img
              src={showPhoto}
              alt="Full View"
              className="max-w-screen max-h-screen object-contain rounded-md"
            />
            <button
              onClick={() => setShowPhoto(null)}
              className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotos;

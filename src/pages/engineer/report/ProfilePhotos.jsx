import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from 'react-icons/ai';
import FileUploaderService from '../../../services/upload-document.service';

const ProfilePhotos = ({ photos, setPhotos }) => {


  const labels = ["front_left_imageUrl", "front_right_imageUrl", "rear_left_imageUrl", "rear_right_imageUrl"];

  const videoRefs = useRef(labels.reduce((acc, label) => ({ ...acc, [label]: null }), {}));
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  // const [photos, setPhotos] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);

  const labelNames = {
    front_left_imageUrl: "1. Front Left",
    front_right_imageUrl: "2. Rear Left",
    rear_left_imageUrl: "3. Rear Right",
    rear_right_imageUrl: "4. Front Right",
  };

  // Assign refs to service
  useEffect(() => {
    labels.forEach(label => FileUploaderService.setVideoRef(label, videoRefs.current[label]));
  }, [labels]);

  // Cleanup camera streams on unmount
  // useEffect(() => {
  //   return () => FileUploaderService.stopAllStreams();
  // }, []);

  const toggleDropdown = (label) => {
    setShowDropdown(showDropdown === label ? null : label);
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left">Profile Photos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {labels.map((label) => (
          <div key={label} className="flex flex-col w-full">
            <label className="text-md font-medium mb-2">{labelNames[label]}</label>
            <div className="mt-2 flex flex-col items-center">
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

              {showDropdown === label && (
                <div className="absolute top-10 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                  <button
                    onClick={() => FileUploaderService.handleCameraClick(
                      label,
                      setStreamStates,
                      setIsCameraActive,
                      (lbl) => FileUploaderService.takePhoto(lbl, setPhotos, setIsCameraActive, setShowDropdown, setStreamStates)
                    )}
                    className="flex items-center px-4 py-3 hover:bg-gray-700 w-full"
                  >
                    <AiOutlineCamera className="mr-2" /> Take Photo
                  </button>
                  <label className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer w-full">
                    <AiOutlineUpload className="mr-2" /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => FileUploaderService.handleFileUpload(e, label, setPhotos, setShowDropdown)}
                    />
                  </label>
                </div>
              )}

              <video
                ref={(el) => (videoRefs.current[label] = el)}
                autoPlay
                className={isCameraActive[label] ? "w-24 h-24 rounded-md" : "hidden"}
              />
            </div>
          </div>
        ))}
      </div>

      {showPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative max-w-screen max-h-screen p-4">
            <img src={showPhoto} alt="Full View" className="max-w-screen max-h-screen object-contain rounded-md" />
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
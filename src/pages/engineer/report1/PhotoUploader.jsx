import React, { useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload, AiOutlineDelete } from 'react-icons/ai';

const PhotoUploader = ({ photo, onTakePhoto, onUploadPhoto, onRemovePhoto, isCameraActive, videoRef }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);

  const handlePlusClick = () => {
    if (photo) {
      onRemovePhoto();
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {photo ? (
        <>
          <img
            src={photo}
            alt="Uploaded preview"
            className="w-24 h-24 object-cover rounded-md cursor-pointer"
            onClick={handlePlusClick}
          />
          <button
            onClick={onRemovePhoto}
            className="absolute top-0 right-0 -mt-1 -mr-1 text-red-400 hover:text-red-500 focus:outline-none bg-[#ffffff0a] rounded-full p-1"
            title="Remove photo"
          >
            <AiOutlineDelete className="text-xs" />
          </button>
        </>
      ) : (
        <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
          <button
            onClick={handlePlusClick}
            className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
            title={photo ? "View Photo" : "Add Photo"}
          >
            <AiOutlinePlus className="text-xl" />
          </button>
        </div>
      )}

      {showDropdown && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#ffffff0a] backdrop-blur-[16px] rounded-md shadow-lg z-10 w-48">
          <button
            onClick={() => {
              onTakePhoto();
              setShowDropdown(false);
            }}
            className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-600 transition-colors duration-200 w-full text-left"
          >
            <AiOutlineCamera className="mr-2" /> Take Photo
          </button>
          <label className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer w-full">
            <AiOutlineUpload className="mr-2" /> Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        className={isCameraActive ? 'w-24 h-24 rounded-md' : 'hidden'}
      />
    </div>
  );
};

export default PhotoUploader;
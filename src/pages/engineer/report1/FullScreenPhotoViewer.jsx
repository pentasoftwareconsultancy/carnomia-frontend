import React from 'react';

const FullScreenPhotoViewer = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="relative max-w-screen max-h-screen p-4">
        <img
          src={photo}
          alt="Full View"
          className="max-w-screen max-h-screen object-contain rounded-md"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default FullScreenPhotoViewer;
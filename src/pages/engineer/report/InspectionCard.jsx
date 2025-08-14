import React from 'react';
import PhotoUploader from './PhotoUploader';

const capitalizeFirstWord = (str) => {
  if (!str) return str;
  const words = str.trim().split(' ');
  if (words.length === 0) return str;
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ');
};

const InspectionCard = ({
  title,
  index,
  children,
  photoSlots = 5,
  photos = [],
  onTakePhoto,
  onUploadPhoto,
  onRemovePhoto,
  isCameraActive = [],
  videoRefs = {},
  showCondition = true,
  condition,
  onConditionChange,
  conditionOptions = ['None', 'Scratch', 'Dent', 'Rust', 'Crack'],
}) => {
  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full">
      <h3 className="text-lg sm:text-xl font-heading mb-4 text-white text-left">
        {`${index + 1}. ${capitalizeFirstWord(title.replace(/([A-Z])/g, ' $1'))}`}
      </h3>
      
      {children}
      
      {showCondition && (
        <div className="mb-4">
          <label className="text-sm text-white font-medium mb-1 block">Issue</label>
          <select
            value={condition || 'None'}
            onChange={onConditionChange}
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            {conditionOptions.map((option) => (
              <option key={option} value={option} className="bg-[#1a1a1a] text-white">
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {photoSlots > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {Array.from({ length: photoSlots }).map((_, idx) => (
              <PhotoUploader
                key={idx}
                photo={photos[idx]}
                onTakePhoto={() => onTakePhoto(idx)}
                onUploadPhoto={(photo) => onUploadPhoto(idx, photo)}
                onRemovePhoto={() => onRemovePhoto(idx)}
                isCameraActive={isCameraActive[idx]}
                videoRef={(el) => (videoRefs.current[`${title}-${idx}`] = el)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionCard;
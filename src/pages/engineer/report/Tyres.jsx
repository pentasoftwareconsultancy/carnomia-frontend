import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload, AiOutlineDelete } from 'react-icons/ai';
import FileUploaderService from "../../../services/upload-document.service";
import FullScreenPhotoViewer from "../report/FullScreenPhotoViewer";

const labelNames = {
  tyre_front_left: "1. Front Left Tyre",
  tyre_rear_left: "2. Rear Left Tyre",
  tyre_rear_right: "3. Rear Right Tyre",
  tyre_front_right: "4. Front Right Tyre",
  tyre_spare: "5. Spare Tyre",
};

const photoCount = 5;


const TyreCard = ({
  tyreName,
  tyreKey,
  brand,
  subBrand,
  variant,
  size,
  manufacturingDate,
  threadDepth,
  issue,
  photos,
  onBrandChange,
  onSubBrandChange,
  onVariantChange,
  onSizeChange,
  onManufacturingDateChange,
  onThreadDepthChange,
  onIssueChange,
  onPhotoChange,
  setShowPhoto,
  idx
}) => {
  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach((stream) => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [streamStates]);

  const toggleDropdown = (slotKey) => {
    setShowDropdown((curr) => (curr === slotKey ? null : slotKey));
  };

  const handleRemovePhoto = (index) => {
    onPhotoChange(index, null);
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const uploadedData = await FileUploaderService.uploadFileToServer(file, tyreKey);
        const imageUrl = uploadedData.files?.[0]?.fileUrl || null;
        if (imageUrl) {
          onPhotoChange(index, imageUrl);
          setShowDropdown(null);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleCameraClick = (index) => {
    const slotKey = `${tyreKey}-${index}`;
    FileUploaderService.handleCameraClick(
      slotKey,
      setStreamStates,
      setIsCameraActive,
      () =>
        FileUploaderService.takePhoto(
          slotKey,
          (photo) => {
            onPhotoChange(index, photo);
            setShowDropdown(null);
            setIsCameraActive((prev) => ({ ...prev, [slotKey]: false }));
          },
          setIsCameraActive,
          () => setShowPhoto(null)
        )
    );
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full">
      <h3 className="text-lg sm:text-xl font-heading mb-4 text-white text-left">
        {`${idx + 1}. ${tyreName}`}
      </h3>

      {/* Brand */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Brand</label>
        <select
          value={brand || ''}
          onChange={onBrandChange}
          className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400">

          <option value="">Select Brand</option>
          <option value="Michelin">Michelin</option>
          <option value="Bridgestone">Bridgestone</option>
          <option value="Goodyear">Goodyear</option>
          <option value="Pirelli">Pirelli</option>
          <option value="Continental">Continental</option>
        </select>
      </div>

      {/* Sub-Brand */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Sub-Brand</label>
        <select
          value={subBrand || ''}
          onChange={onSubBrandChange}
          className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"

        >
          <option value="">Select Sub-Brand</option>
          <option value="Pilot Sport">Pilot Sport</option>
          <option value="Turanza">Turanza</option>
          <option value="Eagle F1">Eagle F1</option>
          <option value="P Zero">P Zero</option>
          <option value="ContiSportContact">ContiSportContact</option>
        </select>
      </div>

      {/* Variant */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Variant</label>
        <select
          value={variant || ''}
          onChange={onVariantChange}
          className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"

        >
          <option value="">Select Variant</option>
          <option value="Sport">Sport</option>
          <option value="All-Season">All-Season</option>
          <option value="Winter">Winter</option>
          <option value="Performance">Performance</option>
          <option value="Touring">Touring</option>
          <option value="Eco">Eco</option>
          <option value="Mud-Terrain">Mud-Terrain</option>
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Size</label>
        <select
          value={size || ''}
          onChange={onSizeChange}
          className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"

        >
          <option value="">Select Size</option>
          <option value="205/55R16">205/55R16</option>
          <option value="225/45R17">225/45R17</option>
          <option value="235/40R18">235/40R18</option>
          <option value="245/35R19">245/35R19</option>
          <option value="255/35R20">255/35R20</option>
        </select>
      </div>

      {/* Manufacturing Date */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Manufacturing Date (MM/YY)</label>
        <input
          type="text"
          value={manufacturingDate || ''}
          onChange={onManufacturingDateChange}
          placeholder="MM/YY"
          className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      {/* Thread Depth */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Thread Depth (mm)</label>
        <input
          type="text"
          value={threadDepth || ''}
          onChange={onThreadDepthChange}
          placeholder="Enter thread depth"
          className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      {/* Issue */}
      <div>
        <label className="text-sm text-white font-medium mb-1 block">Issue</label>
        <select
          value={issue || ''}
          onChange={onIssueChange}
          className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"

        >
          <option value="">Select Issue</option>
          <option value="Worn Tread">Worn Tread</option>
          <option value="Puncture">Puncture</option>
          <option value="Sidewall Damage">Sidewall Damage</option>
          <option value="Uneven Wear">Uneven Wear</option>
          <option value="No Issue">No Issue</option>
        </select>
      </div>

      {/* Photos */}
      {issue && issue !== 'No Issue' && (
        <div className="mt-2 flex flex-col items-center">
          <div className="flex flex-wrap gap-4 justify-center">
            {photos.map((photoUrl, i) => {
              const slotKey = `${tyreKey}-${i}`;
              return (
                <div key={slotKey} className="relative">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={`Tyre photo ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-md cursor-pointer"
                      onClick={() => setShowPhoto(photoUrl)}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                      <button
                        onClick={() => toggleDropdown(slotKey)}
                        className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                        title="Add Photo"
                      >
                        <AiOutlinePlus className="text-xl" />
                      </button>
                    </div>
                  )}

                  {showDropdown === slotKey && (
                    <div
                      className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#ffffff0a] backdrop-blur-[16px] rounded-md shadow-lg z-10 w-48"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleCameraClick(i)}
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
                          onChange={(e) => handleFileUpload(e, i)}
                        />
                      </label>
                    </div>
                  )}

                  <video
                    ref={(el) => (videoRefs.current[slotKey] = el)}
                    autoPlay
                    className={isCameraActive[slotKey] ? 'w-24 h-24 rounded-md' : 'hidden'}
                  />

                  {photoUrl && (
                    <button
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-0 right-0 -mt-1 -mr-1 text-red-400 hover:text-red-500 focus:outline-none bg-[#ffffff0a] rounded-full p-1"
                      title="Remove photo"
                    >
                      <AiOutlineDelete className="text-xs" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


const Tyres = ({ data = {}, onChange }) => {
  const tyreKeys = [
    'tyre_front_left',
    'tyre_rear_left',
    'tyre_rear_right',
    'tyre_front_right',
    'tyre_spare',
  ];

  // State for each field per tyre
  const [tyreState, setTyreState] = useState(() => {
    const initial = {};
    tyreKeys.forEach((key) => {
      initial[key] = {
        brand: data[`${key}_brand`] || '',
        subBrand: data[`${key}_subBrand`] || '',
        variant: data[`${key}_variant`] || '',
        size: data[`${key}_size`] || '',
        manufacturingDate: data[`${key}_manufacturingDate`] || '',
        threadDepth: data[`${key}_treadDepth`] || '',
        issue: data[`${key}_issue`] || '',
        photos: Array.isArray(data[`${key}_imageUrls`]) ? data[`${key}_imageUrls`].slice(0, photoCount).concat(Array(photoCount).fill(null)).slice(0, photoCount) : Array(photoCount).fill(null),
        ...(key === 'tyre_spare' ? { toggle: !!data[`${key}_toggle`] } : {}),
      };
    });
    return initial;
  });

  // Sync with data prop if it changes
  useEffect(() => {
    setTyreState((prev) => {
      const updated = { ...prev };
      tyreKeys.forEach((key) => {
        updated[key] = {
          ...updated[key],
          brand: data[`${key}_brand`] || '',
          subBrand: data[`${key}_subBrand`] || '',
          variant: data[`${key}_variant`] || '',
          size: data[`${key}_size`] || '',
          manufacturingDate: data[`${key}_manufacturingDate`] || '',
          threadDepth: data[`${key}_treadDepth`] || '',
          issue: data[`${key}_issue`] || '',
          photos: Array.isArray(data[`${key}_imageUrls`]) ? data[`${key}_imageUrls`].slice(0, photoCount).concat(Array(photoCount).fill(null)).slice(0, photoCount) : Array(photoCount).fill(null),
          ...(key === 'tyre_spare' ? { toggle: !!data[`${key}_toggle`] } : {}),
        };
      });
      return updated;
    });
  }, [data]);

  // Full screen photo viewer
  const [showPhoto, setShowPhoto] = useState(null);

  // Handlers for each field
  const handleFieldChange = (tyreKey, field) => (e) => {
    const value = e.target.value;
    setTyreState((prev) => {
      const updated = { ...prev };
      updated[tyreKey][field] = value;
      return updated;
    });
    if (onChange) onChange(`${tyreKey}_${field}`, value);
  };

  const handleThreadDepthChange = (tyreKey) => (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setTyreState((prev) => {
        const updated = { ...prev };
        updated[tyreKey].threadDepth = val;
        return updated;
      });
      if (onChange) onChange(`${tyreKey}_treadDepth`, val);
    }
  };

  const handlePhotoChange = (tyreKey) => (index, url) => {
    setTyreState((prev) => {
      const updated = { ...prev };
      const newPhotos = [...updated[tyreKey].photos];
      newPhotos[index] = url;
      updated[tyreKey].photos = newPhotos;
      return updated;
    });
    // Use the new value for imageUrls
    if (onChange) {
      const newArr = [...tyreState[tyreKey].photos];
      newArr[index] = url;
      onChange(`${tyreKey}_imageUrls`, newArr);
    }
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-heading mb-6 sm:mb-8 text-white text-left">Tyres</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {tyreKeys.map((key, idx) => (
          <React.Fragment key={key}>
            {key === 'tyre_spare' && (
              <div className="mb-4 flex items-center">
                <label className="text-white font-medium mr-2">Spare Tyre Present</label>
                <input
                  type="checkbox"
                  checked={!!tyreState[key].toggle}
                  onChange={e => {
                    setTyreState(prev => ({
                      ...prev,
                      [key]: { ...prev[key], toggle: e.target.checked },
                    }));
                    if (onChange) onChange(`${key}_toggle`, e.target.checked);
                  }}
                  className="form-checkbox h-5 w-5 text-lime-500"
                />
              </div>
            )}
            <TyreCard
              tyreKey={key}
              tyreName={labelNames[key]}
              brand={tyreState[key].brand}
              subBrand={tyreState[key].subBrand}
              variant={tyreState[key].variant}
              size={tyreState[key].size}
              manufacturingDate={tyreState[key].manufacturingDate}
              threadDepth={tyreState[key].threadDepth}
              issue={tyreState[key].issue}
              photos={tyreState[key].photos}
              onBrandChange={handleFieldChange(key, 'brand')}
              onSubBrandChange={handleFieldChange(key, 'subBrand')}
              onVariantChange={handleFieldChange(key, 'variant')}
              onSizeChange={handleFieldChange(key, 'size')}
              onManufacturingDateChange={handleFieldChange(key, 'manufacturingDate')}
              onThreadDepthChange={handleThreadDepthChange(key)}
              onIssueChange={handleFieldChange(key, 'issue')}
              onPhotoChange={handlePhotoChange(key)}
              setShowPhoto={setShowPhoto}
              idx={idx}
            />
          </React.Fragment>
        ))}
      </div>
      {showPhoto && <FullScreenPhotoViewer photo={showPhoto} onClose={() => setShowPhoto(null)} />}
    </div>
  );
};

export default Tyres;

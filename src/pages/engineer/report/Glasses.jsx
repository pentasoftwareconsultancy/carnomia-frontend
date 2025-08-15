import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from "react-icons/ai";
import FullScreenPhotoViewer from "../report/FullScreenPhotoViewer";
import FileUploaderService from "../../../services/upload-document.service";

const glassPanels = [
  "front_windshield",
  "front_left_door_glass",
  "left_side_orvm",
  "rear_left_door_glass",
  "rear_left_quarter_glass",
  "rear_windshield",
  "rear_right_quarter_glass",
  "rear_right_door_glass",
  "front_right_door_glass",
  "right_side_orvm",
  "sunroof_glass", 
];

const labelNames = {
  front_windshield: "1. Front Windshield",
  front_left_door_glass: "2. Front Left Door Glass",
  left_side_orvm: "3. Left Side ORVM",
  rear_left_door_glass: "4. Rear Left Door Glass",
  rear_left_quarter_glass: "5. Rear Left Quarter Glass",
  rear_windshield: "6. Rear Windshield",
  rear_right_quarter_glass: "7. Rear Right Quarter Glass",
  rear_right_door_glass: "8. Rear Right Door Glass",
  front_right_door_glass: "9. Front Right Door Glass",
  right_side_orvm: "10. Right Side ORVM",
  sunroof_glass: "11. Sunroof Glass",
};

const specialGlassPanels = new Set([
  "front_windshield",
  "front_left_door_glass",
  "rear_left_door_glass",
  "rear_left_quarter_glass",
  "rear_windshield",
  "rear_right_quarter_glass",
  "rear_right_door_glass",
  "front_right_door_glass",
  "sunroof_glass",
]);

const photoCountForPanel = (panel) => (specialGlassPanels.has(panel) ? 5 : 1);

const Glasses = ({ data = {}, onChange }) => {
  // Photos state
  const [photos, setPhotos] = useState(() => {
    const initialPhotos = {};
    glassPanels.forEach((panel) => {
      const expectedCount = photoCountForPanel(panel);
      const existingPhotos = Array.isArray(data[`${panel}_imageUrls`]) ? data[`${panel}_imageUrls`] : [];
      initialPhotos[panel] = [
        ...existingPhotos.slice(0, expectedCount),
        ...Array(Math.max(0, expectedCount - existingPhotos.length)).fill(null),
      ];
    });
    return initialPhotos;
  });

  // Brand state
  const [brand, setBrand] = useState(() => {
    const initial = {};
    glassPanels.forEach((p) => {
      initial[p] = data[`${p}_brand`] || "";
    });
    return initial;
  });

  // Manufacturing date state
  const [manufacturingDate, setManufacturingDate] = useState(() => {
    const initial = {};
    glassPanels.forEach((p) => {
      initial[p] = data[`${p}_manufacturingDate`] || "";
    });
    return initial;
  });

  // Condition/issue state
  const [condition, setCondition] = useState(() => {
    const initial = {};
    glassPanels.forEach((p) => {
      initial[p] = data[`${p}_issues`] || "None";
    });
    return initial;
  });

  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);

  // Cleanup video streams on unmount
  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach((stream) => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [streamStates]);

  // Toggle dropdown visibility for photo slot
  const toggleDropdown = (slotKey) => {
    setShowDropdown((curr) => (curr === slotKey ? null : slotKey));
  };

  // Your original handleFileUpload logic preserved
  const handleFileUpload = async (e, panel, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const uploadedData = await FileUploaderService.uploadFileToServer(file, panel);
        const imageUrl = uploadedData.files?.[0]?.fileUrl || null;
        if (imageUrl) {
          setPhotos((prev) => {
            const newPhotos = [...(prev[panel] || Array(photoCountForPanel(panel)).fill(null))];
            newPhotos[index] = imageUrl;
            onChange && onChange(`${panel}_imageUrls`, newPhotos);
            return { ...prev, [panel]: newPhotos };
          });
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

  // Handle taking photo from camera
  const handleCameraClick = (panel, index) => {
    const slotKey = `${panel}-${index}`;
    FileUploaderService.handleCameraClick(
      slotKey,
      setStreamStates,
      setIsCameraActive,
      () =>
        FileUploaderService.takePhoto(
          slotKey,
          (photo) => {
            setPhotos((prev) => {
              const newPhotos = [...(prev[panel] || Array(photoCountForPanel(panel)).fill(null))];
              newPhotos[index] = photo;
              onChange && onChange(`${panel}_imageUrls`, newPhotos);
              return { ...prev, [panel]: newPhotos };
            });
            setShowDropdown(null);
            setIsCameraActive((prev) => ({ ...prev, [slotKey]: false }));
          },
          setIsCameraActive,
          () => setShowPhoto(null)
        )
    );
  };

  // Generic input change handler for brand, manufacturingDate etc.
  const handleInputChange = (field, panel, setter) => (e) => {
    const value = e.target.value;
    setter((prev) => {
      const updated = { ...prev, [panel]: value };
      if (onChange) onChange(`${panel}_${field}`, value);
      return updated;
    });
  };

  // Capitalize first word utility
  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(" ");
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left">Glass Panels</h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {glassPanels.map((panel) => {
          const isSpecial = specialGlassPanels.has(panel);
          const photoCount = photoCountForPanel(panel);
          const photosArr = photos[panel] || Array(photoCount).fill(null);

          return (
            <div key={panel} className="flex flex-col w-full">
              <label className="text-md text-white font-medium mb-2 text-left">
                {labelNames[panel] || capitalizeFirstWord(panel.replace(/_/g, " "))}
              </label>

              {isSpecial && (
                <>
                  <div className="mb-4">
                    <label className="text-md text-white font-medium mb-2">Brand</label>
                    <input
                      type="text"
                      value={brand[panel] || ""}
                      onChange={handleInputChange("brand", panel, setBrand)}
                      className="p-2 bg-transparent text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                      placeholder="Enter brand"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-md text-white font-medium mb-2">Manufacturing MM/YY</label>
                    <input
                      type="text"
                      value={manufacturingDate[panel] || ""}
                      onChange={handleInputChange("manufacturingDate", panel, setManufacturingDate)}
                      className="p-2 bg-transparent text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                      placeholder="MM/YY"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="text-md text-white font-medium mb-2">Issue</label>
                <select
                  value={condition[panel] || "None"}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCondition((prev) => {
                      const updated = { ...prev, [panel]: val };
                      if (onChange) onChange(`${panel}_issues`, val); 
                      return updated;
                    });
                  }}
                  className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option>None</option>
                  <option>Crack</option>
                  <option>Chip</option>
                  <option>Scratch</option>
                </select>
              </div>

              {condition[panel] !== "None" && (
                <div className="mt-2 flex flex-wrap gap-4 justify-center">
                  {photosArr.map((photoUrl, i) => {
                    const slotKey = `${panel}-${i}`;
                    return (
                      <div key={slotKey} className="relative">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={`${labelNames[panel]} photo ${i + 1}`}
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
                            className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleCameraClick(panel, i)}
                              className="flex items-center px-4 py-3 w-full text-left text-white hover:bg-gray-700"
                            >
                              <AiOutlineCamera className="mr-2" /> Take Photo
                            </button>
                            <label className="flex items-center px-4 py-3 w-full text-white hover:bg-gray-700 cursor-pointer">
                              <AiOutlineUpload className="mr-2" /> Upload Photo
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, panel, i)}
                              />
                            </label>
                          </div>
                        )}

                        <video
                          ref={(el) => (videoRefs.current[slotKey] = el)}
                          autoPlay
                          className={isCameraActive[slotKey] ? "w-24 h-24 rounded-md" : "hidden"}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showPhoto && <FullScreenPhotoViewer photo={showPhoto} onClose={() => setShowPhoto(null)} />}
    </div>
  );
};

export default Glasses;

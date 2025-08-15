import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from "react-icons/ai";
import FullScreenPhotoViewer from "../report/FullScreenPhotoViewer";
import FileUploaderService from "../../../services/upload-document.service";

const BodyPanels = ({ data, onChange }) => {
  const labels = [
    "bonnet_issue", "bumper_issue", "front_left_fender_issue", "front_left_door_issue",
    "rear_left_door_issue", "rear_left_quarter_panel_issue", "boot_issue",
    "rear_bumper_issue", "rear_right_quarter_panel_issue", "rear_right_door_issue",
    "front_right_door_issue", "front_right_fender_issue", "roof_issue",
  ];

  const labelNames = {
    bonnet_issue: "1. Bonnet",
    bumper_issue: "2. Bumper",
    front_left_fender_issue: "3. Front Left Fender",
    front_left_door_issue: "4. Front Left Door",
    rear_left_door_issue: "5. Rear Left Door",
    rear_left_quarter_panel_issue: "6. Rear Left Quarter Panel",
    boot_issue: "7. Boot",
    rear_bumper_issue: "8. Rear Bumper",
    rear_right_quarter_panel_issue: "9. Rear Right Quarter Panel",
    rear_right_door_issue: "10. Rear Right Door",
    front_right_door_issue: "11. Front Right Door",
    front_right_fender_issue: "12. Front Right Fender",
    roof_issue: "13. Roof",
  };

  const imageUrlKeysMap = {
    bonnet_issue: "bonnet_imageUrls",
    bumper_issue: "bumper_imageUrls",
    front_left_fender_issue: "front_left_fender_imageUrls",
    front_left_door_issue: "front_left_door_imageUrls",
    rear_left_door_issue: "rear_left_door_imageUrls",
    rear_left_quarter_panel_issue: "rear_left_quarter_panel_imageUrls",
    boot_issue: "boot_imageUrls",
    rear_bumper_issue: "rear_bumper_imageUrls",
    rear_right_quarter_panel_issue: "rear_right_quarter_panel_imageUrls",
    rear_right_door_issue: "rear_right_door_imageUrls",
    front_right_door_issue: "front_right_door_imageUrls",
    front_right_fender_issue: "front_right_fender_imageUrls",
    roof_issue: "roof_imageUrls",
  };

  const photoCount = 5;

  // Local state for panel values and photos
  const [panelValues, setPanelValues] = useState({});
  const [photos, setPhotos] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState({});
  const [streamStates, setStreamStates] = useState({});
  const videoRefs = useRef({});

  // Sync local state with incoming data
  useEffect(() => {
    const initialPanelValues = {};
    labels.forEach(key => {
      initialPanelValues[key] = {
        issue: data[key] || "None",
        paintThickness: data[`${key}_paintThickness`] || "",
      };
    });
    setPanelValues(initialPanelValues);

    const initialPhotos = {};
    Object.entries(imageUrlKeysMap).forEach(([_, key]) => {
      initialPhotos[key] = Array.isArray(data?.[key]) ? data[key] : Array(photoCount).fill(null);
    });
    setPhotos(initialPhotos);
  }, [data]);

  // Stop all camera streams on unmount
  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach(stream => {
        if (stream) stream.getTracks().forEach(track => track.stop());
      });
    };
  }, [streamStates]);

  // Handle input changes (issue or paint thickness)
  const handleInputChange = (key, field, value) => {
    setPanelValues(prev => {
      const newValues = { ...prev, [key]: { ...prev[key], [field]: value } };
      // Sync with parent
      if (onChange) {
        if (field === "issue") onChange(key, value);
        else onChange(`${key}_paintThickness`, value);
      }
      return newValues;
    });
  };

  // Handle file upload
  const handleFileUpload = async (e, imageKey, index) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return alert("Select a valid image file");

    try {
      const uploaded = await FileUploaderService.uploadFileToServer(file, imageKey);
      const imageUrl = uploaded.files?.[0]?.fileUrl || null;
      if (imageUrl) {
        setPhotos(prev => {
          const arr = prev[imageKey] ? [...prev[imageKey]] : Array(photoCount).fill(null);
          arr[index] = imageUrl;
          if (onChange) onChange(imageKey, arr); // send updated array to parent
          return { ...prev, [imageKey]: arr };
        });
        setShowDropdown(null);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    }
  };

  // Handle camera click
  const handleCameraClick = (key, index) => {
    const slotKey = `${key}-${index}`;
    FileUploaderService.handleCameraClick(
      slotKey,
      setStreamStates,
      setIsCameraActive,
      () =>
        FileUploaderService.takePhoto(
          slotKey,
          photo => {
            setPhotos(prev => {
              const newPhotos = [...prev[key]];
              newPhotos[index] = photo;
              if (onChange) onChange(imageUrlKeysMap[key], newPhotos);
              return { ...prev, [key]: newPhotos };
            });
            setShowDropdown(null);
            setIsCameraActive(prev => ({ ...prev, [slotKey]: false }));
          },
          setIsCameraActive,
          () => setShowPhoto(null)
        )
    );
  };

  const toggleDropdown = slotKey => setShowDropdown(curr => (curr === slotKey ? null : slotKey));

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl text-white mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left">Body Panels</h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {labels.map(issueKey => {
          const imageKey = imageUrlKeysMap[issueKey];
          if (!imageKey) return null;
          const photosArr = photos[imageKey] || [];
          const { issue, paintThickness } = panelValues[issueKey] || {};

          return (
            <div key={issueKey} className="flex flex-col w-full">
              <label className="text-md text-white font-medium text-left mb-2">{labelNames[issueKey]}</label>

              {/* Paint Thickness */}
              <div className="mb-4">
                <label className="text-md text-white font-medium mb-2">Paint Thickness</label>
                <input
                  type="number"
                  value={paintThickness || ""}
                  onChange={e => handleInputChange(issueKey, "paintThickness", e.target.value)}
                  className="p-2 bg-transparent text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter thickness (mm)"
                />
              </div>

              {/* Issue Dropdown */}
              <div className="mb-4">
                <label className="text-md text-white font-medium mb-2">Issue</label>
                <select
                  value={issue || "None"}
                  onChange={e => handleInputChange(issueKey, "issue", e.target.value)}
                  className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option>None</option>
                  <option>Scratch</option>
                  <option>Dent</option>
                  <option>Rust</option>
                  <option>Crack</option>
                </select>
              </div>

              {/* Photos */}
              {issue !== "None" && (
                <div className="mt-2 flex flex-wrap gap-4 justify-center">
                  {Array.from({ length: photoCount }).map((_, i) => {
                    const slotKey = `${imageKey}-${i}`;
                    const photoUrl = photosArr[i];
                    return (
                      <div key={slotKey} className="relative">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={`${labelNames[issueKey]} photo ${i + 1}`}
                            className="w-24 h-24 object-cover rounded-md cursor-pointer"
                            onClick={() => setShowPhoto(photoUrl)}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                            <button
                              onClick={() => toggleDropdown(slotKey)}
                              className="p-2 rounded-full bg-gray-500 text-white"
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                        )}

                        {showDropdown === slotKey && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                            <button
                              onClick={() => handleCameraClick(imageKey, i)}
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
                                onChange={e => handleFileUpload(e, imageKey, i)}
                              />
                            </label>
                          </div>
                        )}

                        <video
                          ref={el => (videoRefs.current[slotKey] = el)}
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

export default BodyPanels;

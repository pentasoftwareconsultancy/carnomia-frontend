import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from "react-icons/ai";
import ToggleButton from "../report/ToggleButton";
import FullScreenPhotoViewer from "../report/FullScreenPhotoViewer";
import FileUploaderService from "../../../services/upload-document.service";

const BodyPanels = ({ data, onChange }) => {

  const labels = [
    'bonnet',
    "bonnet_issue",
    
    "bumper",
    "bumper_issue",
    
    'front_left_fender',
    "front_left_fender_issue",

    'front_left_door',
    "front_left_door_issue",
    "front_left_door_ORVM_issue",
    "front_left_door_cladding_issue",

    'rear_left_door',
    "rear_left_door_issue",
    "rear_left_door_cladding_issue",
    
    'rear_left_quarter_panel',
    "rear_left_quarter_panel_issue",
    "rear_left_quarter_panel_cladding_issue",

    "boot",
    "boot_issue",
    "boot_tailLightLeft_issue",
    "boot_tailLightRight_issue",



    "rear_bumper",
    "rear_bumper_issue",

    "rear_right_quarter_panel",
    "rear_right_quarter_panel_issue",
    "rear_right_quarter_panel_cladding_issue",

    "rear_right_door",
    "rear_right_door_issue",
    "rear_right_door_cladding_issue",

    "front_right_door",
    "front_right_door_issue",
    "front_right_door_ORVM_issue",
    "front_right_door_cladding_issue",

    "front_right_fender",
    "front_right_fender_issue",
    "front_right_fender_cladding_issue",

    "roof",
    "roof_issue",
    
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

  // Number of photos per panel
  const photoCount = 5;

  // Map panel issue key to corresponding imageUrls key
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

  // Initialize photos state with arrays from data, or empty arrays
  const [photos, setPhotos] = useState(() => {
    const initialPhotos = {};
    Object.entries(imageUrlKeysMap).forEach(([issueKey, imageKey]) => {
      initialPhotos[imageKey] = Array.isArray(data?.[imageKey]) ? data[imageKey] : Array(photoCount).fill(null);
    });
    return initialPhotos;
  });

  // Refs and camera states
  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach((stream) => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [streamStates]);

  // Get photos array safely for a panel imageKey
  const getPhotos = (imageKey) => photos[imageKey] || Array(photoCount).fill(null);

  // Toggle dropdown per slot
  const toggleDropdown = (slotKey) => {
    setShowDropdown((curr) => (curr === slotKey ? null : slotKey));
  };

  // Handle file upload for panel imageKey and photo index
  const handleFileUpload = async (e, imageKey, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const uploadedData = await FileUploaderService.uploadFileToServer(file, imageKey);
        const imageUrl = uploadedData.files?.[0]?.fileUrl || null;
        if (imageUrl) {
          setPhotos((prev) => {
            const newPhotos = [...(prev[imageKey] || Array(photoCount).fill(null))];
            newPhotos[index] = imageUrl;
            // Propagate to parent
            onChange && onChange(imageKey, newPhotos);
            return { ...prev, [imageKey]: newPhotos };
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

  // Handle camera capture for panel imageKey and photo index
  const handleCameraClick = (imageKey, index) => {
    const slotKey = `${imageKey}-${index}`;
    FileUploaderService.handleCameraClick(
      slotKey,
      setStreamStates,
      setIsCameraActive,
      () =>
        FileUploaderService.takePhoto(
          slotKey,
          (photo) => {
            setPhotos((prev) => {
              const newPhotos = [...(prev[imageKey] || Array(photoCount).fill(null))];
              newPhotos[index] = photo;
              onChange && onChange(imageKey, newPhotos);
              return { ...prev, [imageKey]: newPhotos };
            });
            setShowDropdown(null);
            setIsCameraActive((prev) => ({ ...prev, [slotKey]: false }));
          },
          setIsCameraActive,
          () => setShowPhoto(null)
        )
    );
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl text-white mx-auto">
      <h2 className="text-2xl sm:text-3xl font-heading mb-6 sm:mb-8 text-left">Body Panels</h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {labels.map((issueKey) => {
          // Map issueKey to imageKey for photo arrays
          const imageKey = imageUrlKeysMap[issueKey];
          if(!imageKey) return null; // Skip if no mapping found
          const photosArr = imageKey ? getPhotos(imageKey) : [];

          // Your existing 'hasIssue' logic — unchanged
          const hasIssue =
            data[issueKey] !== "None" ||
            (issueKey === "boot_issue" &&
              (data["boot_tailLightLeft"] !== "None" || data["boot_tailLightRight"] !== "None")) ||
            (data[`${issueKey}_clad`] && data[`${issueKey}_clad_issue`] !== "None");

          return (
            <div key={issueKey} className="flex flex-col w-full">
              <label className="text-md text-white font-medium text-left mb-2">
                {labelNames[issueKey] || issueKey}
              </label>

              {/* Paint Thickness Input */}
              <div className="mb-4">
                <label className="text-md text-white font-medium mb-2">Paint Thickness</label>
                <input
                  type="number"
                  value={data[`${issueKey}_paintThickness`] || ""}
                  onChange={(e) => onChange(`${issueKey}_paintThickness`, e.target.value)}
                  className="p-2 bg-transparent text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter thickness (mm)"
                />
              </div>

              {/* Issue select */}
              <div className="mb-4">
                <label className="text-md text-white font-medium mb-2">Issue</label>
                <select
                  value={data[issueKey] || "None"}
                  onChange={(e) => onChange(issueKey, e.target.value)}
                  className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option>None</option>
                  <option>Scratch</option>
                  <option>Dent</option>
                  <option>Rust</option>
                  <option>Crack</option>
                </select>
              </div>

              {/* Boot tail lights, cladding toggles, etc. — keep your existing code here unchanged */}

              {/* Photo upload & display */}
              {hasIssue && (
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
                                onChange={(e) => handleFileUpload(e, imageKey, i)}
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

      {/* Fullscreen Photo Viewer */}
      {showPhoto && <FullScreenPhotoViewer photo={showPhoto} onClose={() => setShowPhoto(null)} />}
    </div>
  );
};

export default BodyPanels;

import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from "react-icons/ai";
import FullScreenPhotoViewer from "../report/FullScreenPhotoViewer";
import FileUploaderService from "../../../services/upload-document.service";
import ToggleButton from "../report/ToggleButton";

const seatPanels = [
  "seat_driver",
  "seat_driver_head_rest",
  "seat_codriver",
  "seat_codriver_head_rest",
  "seat_rear",
  "seat_rear_head_rest",
  "seat_third_row",
  "seat_third_row_head_rest",
  "seat_roof",
  "seat_sunroof",
];

const labelNames = {
  seat_driver: "Driver Seat",
  seat_driver_head_rest: "Driver Head Rest",
  seat_codriver: "Co-driver Seat",
  seat_codriver_head_rest: "Co-driver Head Rest",
  seat_rear: "Rear Seat",
  seat_rear_head_rest: "Rear Head Rest",
  seat_third_row: "Third Row Seat",
  seat_third_row_head_rest: "Third Row Head Rest",
  seat_roof: "Seat Roof",
  seat_sunroof: "Sunroof",
};

const photoCount = 5;

const SeatFabrics = ({ data = {}, onChange }) => {
  // Condition state
  const [condition, setCondition] = useState(() => {
    const init = {};
    seatPanels.forEach((panel) => {
      init[panel] = data?.[`${panel}_issues`] || "None";
    });
    return init;
  });

  // Photos state
  const [photos, setPhotos] = useState(() => {
    const init = {};
    seatPanels.forEach((panel) => {
      const imgs = Array.isArray(data?.[`${panel}_imageUrls`]) ? data[`${panel}_imageUrls`] : [];
      init[panel] = [...imgs, ...Array(photoCount - imgs.length).fill(null)].slice(0, photoCount);
    });
    return init;
  });

  // Third row seat toggle
  const [thirdRowEnabled, setThirdRowEnabled] = useState(data?.seat_third_row_toggle || false);

  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);

  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach((stream) => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [streamStates]);

  // Handle condition change
  const handleConditionChange = (panel, val) => {
    setCondition((prev) => {
      const updated = { ...prev, [panel]: val };
      if (onChange) onChange(`${panel}_issues`, val);
      return updated;
    });
  };

  // Update photos and propagate change
  const updatePhotos = (panel, newPhotos) => {
    setPhotos((prev) => {
      const updated = { ...prev, [panel]: newPhotos };
      if (onChange) onChange(`${panel}_imageUrls`, newPhotos);
      return updated;
    });
  };

  // Toggle third row seat boolean
  const toggleThirdRow = () => {
    const newVal = !thirdRowEnabled;
    setThirdRowEnabled(newVal);
    if (onChange) onChange("seat_third_row_toggle", newVal);
  };

  // File upload handler
  const handleFileUpload = async (e, panel, idx) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const uploadedData = await FileUploaderService.uploadFileToServer(file, panel);
        const imageUrl = uploadedData.files?.[0]?.fileUrl || null;
        if (imageUrl) {
          const newPhotos = [...(photos[panel] || Array(photoCount).fill(null))];
          newPhotos[idx] = imageUrl;
          updatePhotos(panel, newPhotos);
          setShowDropdown(null);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image. Please try again.");
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Camera click & photo capture handler
  const handleCameraClick = async (panel, idx) => {
    const slotKey = `${panel}-${idx}`;
    const isActive = isCameraActive[slotKey];

    if (!isActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRefs.current[slotKey]) videoRefs.current[slotKey].srcObject = stream;

        setStreamStates((prev) => ({ ...prev, [slotKey]: stream }));
        setIsCameraActive((prev) => ({ ...prev, [slotKey]: true }));
      } catch {
        alert("Camera access denied or not available.");
      }
    } else {
      const video = videoRefs.current[slotKey];
      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      const photo = canvas.toDataURL("image/png");
      const newPhotos = [...(photos[panel] || Array(photoCount).fill(null))];
      newPhotos[idx] = photo;
      updatePhotos(panel, newPhotos);

      streamStates[slotKey]?.getTracks().forEach((track) => track.stop());

      setIsCameraActive((prev) => ({ ...prev, [slotKey]: false }));
      setStreamStates((prev) => ({ ...prev, [slotKey]: null }));
      setShowDropdown(null);
    }
  };

  // Dropdown toggle
  const toggleDropdown = (slotKey) => {
    setShowDropdown((curr) => (curr === slotKey ? null : slotKey));
  };

  // Plus button click
  const handlePlusClick = (panel, idx) => {
    if (photos[panel]?.[idx]) {
      setShowPhoto(photos[panel][idx]);
    } else {
      toggleDropdown(`${panel}-${idx}`);
    }
  };

  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  };

  if (!photos || Object.keys(photos).length === 0) {
    return <div className="text-white">Loading seat fabrics data...</div>;
  }

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Seats & Fabrics</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {seatPanels.map((panel, idx) => (
          <div key={panel} className="flex flex-col w-full">
            {panel === "seat_third_row" ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-md text-white font-medium text-left">
                    {`${idx + 1}. ${labelNames[panel] || capitalizeFirstWord(panel.replace(/_/g, " "))}`}
                  </label>
                  <ToggleButton checked={thirdRowEnabled} onChange={toggleThirdRow} />
                </div>
                {thirdRowEnabled && (
                  <>
                    <div className="mb-4">
                      <label className="text-md text-white font-medium text-left mb-2">Issues</label>
                      <select
                        value={condition[panel] || "None"}
                        onChange={(e) => handleConditionChange(panel, e.target.value)}
                        className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                      >
                        <option>None</option>
                        <option>Crack</option>
                        <option>Chip</option>
                        <option>Scratch</option>
                      </select>
                    </div>
                    {condition[panel] !== "None" && (
                      <div className="mt-2 flex flex-col items-center">
                        <div className="mt-2 flex flex-wrap gap-4 justify-center">
                          {Array.from({ length: photoCount }).map((_, i) => (
                            <div key={i} className="relative">
                              {photos[panel]?.[i] ? (
                                <img
                                  src={photos[panel][i]}
                                  alt={`Photo ${i + 1} for ${panel}`}
                                  className="w-24 h-24 object-cover rounded-md cursor-pointer"
                                  onClick={() => setShowPhoto(photos[panel][i])}
                                />
                              ) : (
                                <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                                  <button
                                    onClick={() => handlePlusClick(panel, i)}
                                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                                    title={photos[panel]?.[i] ? "View Photo" : "Add Photo"}
                                  >
                                    <AiOutlinePlus className="text-xl" />
                                  </button>
                                </div>
                              )}

                              {showDropdown === `${panel}-${i}` && (
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                                  <button
                                    onClick={() => handleCameraClick(panel, i)}
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
                                      onChange={(e) => handleFileUpload(e, panel, i)}
                                    />
                                  </label>
                                </div>
                              )}

                              <video
                                ref={(el) => (videoRefs.current[`${panel}-${i}`] = el)}
                                autoPlay
                                className={isCameraActive[`${panel}-${i}`] ? "w-24 h-24 rounded-md" : "hidden"}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <label className="text-md text-white font-medium text-left mb-2">
                  {`${idx + 1}. ${labelNames[panel] || capitalizeFirstWord(panel.replace(/_/g, " "))}`}
                </label>
                <div className="mb-4">
                  <label className="text-md text-white font-medium text-left mb-2">Issues</label>
                  <select
                    value={condition[panel] || "None"}
                    onChange={(e) => handleConditionChange(panel, e.target.value)}
                    className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option>None</option>
                    <option>Crack</option>
                    <option>Chip</option>
                    <option>Scratch</option>
                  </select>
                </div>
                {condition[panel] !== "None" && (
                  <div className="mt-2 flex flex-col items-center">
                    <div className="mt-2 flex flex-wrap gap-4 justify-center">
                      {Array.from({ length: photoCount }).map((_, i) => (
                        <div key={i} className="relative">
                          {photos[panel]?.[i] ? (
                            <img
                              src={photos[panel][i]}
                              alt={`Photo ${i + 1} for ${panel}`}
                              className="w-24 h-24 object-cover rounded-md cursor-pointer"
                              onClick={() => setShowPhoto(photos[panel][i])}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                              <button
                                onClick={() => handlePlusClick(panel, i)}
                                className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                                title={photos[panel]?.[i] ? "View Photo" : "Add Photo"}
                              >
                                <AiOutlinePlus className="text-xl" />
                              </button>
                            </div>
                          )}

                          {showDropdown === `${panel}-${i}` && (
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                              <button
                                onClick={() => handleCameraClick(panel, i)}
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
                                  onChange={(e) => handleFileUpload(e, panel, i)}
                                />
                              </label>
                            </div>
                          )}

                          <video
                            ref={(el) => (videoRefs.current[`${panel}-${i}`] = el)}
                            autoPlay
                            className={isCameraActive[`${panel}-${i}`] ? "w-24 h-24 rounded-md" : "hidden"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {showPhoto && <FullScreenPhotoViewer photo={showPhoto} onClose={() => setShowPhoto(null)} />}
    </div>
  );
};

export default SeatFabrics;

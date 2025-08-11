import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCamera, AiOutlineUpload } from "react-icons/ai";
import ToggleButton from "../report/ToggleButton";
import FullScreenPhotoViewer from "../report/FullScreenPhotoViewer";
import FileUploaderService from "../../../services/upload-document.service";

const BasicDetails = ({ data, onChange, showPhoto, setShowPhoto }) => {
  const videoRefs = useRef({
    vinNumber: null,
    engineNumber: null,
    ODO: null,
    keys: null,
  });
  const [streamStates, setStreamStates] = useState({
    vinNumber: null,
    engineNumber: null,
    ODO: null,
    keys: null,
  });
  const [isCameraActive, setIsCameraActive] = useState({
    vinNumber: false,
    engineNumber: false,
    ODO: false,
    keys: false,
  });
  const [isEngineNumberEnabled, setIsEngineNumberEnabled] = useState(true);

  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach((stream) => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [streamStates]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Updated handleFileUpload to use your FileUploaderService
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const uploadedData = await FileUploaderService.uploadFileToServer(
          file,
          field
        );
        // Assuming your API returns the URL at uploadedData.files[0].fileUrl (adjust if needed)
        const imageUrl = uploadedData.files?.[0]?.fileUrl || null;
        if (imageUrl) {
          onChange((prev) => ({ ...prev, [`${field}Photo`]: imageUrl }));
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Camera related functions should call the service methods
  const handleCameraClick = (field) =>
    FileUploaderService.handleCameraClick(
      field,
      setStreamStates,
      setIsCameraActive,
      () =>
        FileUploaderService.takePhoto(
          field,
          (photo) => {
            onChange((prev) => ({ ...prev, [`${field}Photo`]: photo }));
          },
          setIsCameraActive,
          () => setShowPhoto(null)
        )
    );

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">
        Basic Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* VIN Number */}
        <div className="flex flex-col animate-fade-in">
          <label className="text-md text-white font-medium">VIN Number</label>
          <div className="mt-2 flex flex-col">
            <input
              type="text"
              name="vinNumber"
              value={data.vinNumber || ""}
              onChange={handleInputChange}
              className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Enter VIN Number"
            />
            <div className="mt-2 flex items-center">
              {data.vinNumberPhoto && (
                <button
                  onClick={() => setShowPhoto(data.vinNumberPhoto)}
                  className="px-3 py-1 text-sm bg-lime-500 text-white rounded-md hover:bg-lime-600 mr-2"
                >
                  View Photo
                </button>
              )}
              <div className="ml-auto flex space-x-2">
                <label className="cursor-pointer p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80">
                  <AiOutlineUpload className="text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "vinNumber")}
                  />
                </label>
                <button
                  onClick={() => handleCameraClick("vinNumber")}
                  className={`p-2 rounded-full ${
                    isCameraActive.vinNumber ? "bg-green-500" : "bg-gray-500"
                  } text-white hover:bg-opacity-80`}
                >
                  <AiOutlineCamera className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <video
            ref={(el) => (videoRefs.current.vinNumber = el)}
            autoPlay
            className="hidden"
          />
        </div>

        {/* Engine Number */}
        <div className="flex flex-col animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-md text-white font-medium">
              Engine Number
            </label>
            <ToggleButton
              checked={isEngineNumberEnabled}
              onChange={() => setIsEngineNumberEnabled(!isEngineNumberEnabled)}
            />
          </div>
          <div
            className="mt-2 flex flex-col"
            style={{ display: isEngineNumberEnabled ? "flex" : "none" }}
          >
            <input
              type="text"
              name="engineNumber"
              value={data.engineNumber || ""}
              onChange={handleInputChange}
              className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Enter Engine Number"
              disabled={!isEngineNumberEnabled}
            />
            <div className="mt-2 flex items-center">
              {data.engineNumberPhoto && (
                <button
                  onClick={() => setShowPhoto(data.engineNumberPhoto)}
                  className="px-3 py-1 text-sm bg-lime-500 text-white rounded-md hover:bg-lime-600 mr-2"
                >
                  View Photo
                </button>
              )}
              <div className="ml-auto flex space-x-2">
                <label
                  className="cursor-pointer p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                  style={{
                    opacity: isEngineNumberEnabled ? 1 : 0.5,
                    pointerEvents: isEngineNumberEnabled ? "auto" : "none",
                  }}
                >
                  <AiOutlineUpload className="text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "engineNumber")}
                  />
                </label>
                <button
                  onClick={() => handleCameraClick("engineNumber")}
                  className={`p-2 rounded-full ${
                    isCameraActive.engineNumber ? "bg-green-500" : "bg-gray-500"
                  } text-white hover:bg-opacity-80`}
                  style={{
                    opacity: isEngineNumberEnabled ? 1 : 0.5,
                    pointerEvents: isEngineNumberEnabled ? "auto" : "none",
                  }}
                >
                  <AiOutlineCamera className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <video
            ref={(el) => (videoRefs.current.engineNumber = el)}
            autoPlay
            className="hidden"
          />
        </div>

        {/* ODO and Keys */}
        <div className="flex flex-col animate-fade-in sm:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-md text-white font-medium">ODO</label>
              <div className="mt-2 flex flex-col">
                <input
                  type="number"
                  name="ODO"
                  value={data.ODO || ""}
                  onChange={handleInputChange}
                  className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter ODO"
                />
                <div className="mt-2 flex items-center">
                  {data.ODOPhoto && (
                    <button
                      onClick={() => setShowPhoto(data.ODOPhoto)}
                      className="px-3 py-1 text-sm bg-lime-500 text-white rounded-md hover:bg-lime-600 mr-2"
                    >
                      View Photo
                    </button>
                  )}
                  <div className="ml-auto flex space-x-2">
                    <label className="cursor-pointer p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80">
                      <AiOutlineUpload className="text-xl" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "ODO")}
                      />
                    </label>
                    <button
                      onClick={() => handleCameraClick("ODO")}
                      className={`p-2 rounded-full ${
                        isCameraActive.ODO ? "bg-green-500" : "bg-gray-500"
                      } text-white hover:bg-opacity-80`}
                    >
                      <AiOutlineCamera className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
              <video
                ref={(el) => (videoRefs.current.ODO = el)}
                autoPlay
                className="hidden"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md text-white font-medium">Keys</label>
              <div className="mt-2 flex flex-col">
                <input
                  type="text"
                  name="keys"
                  value={data.keys || ""}
                  onChange={handleInputChange}
                  className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter Keys Info"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dealer PDI */}
        <div className="flex items-center animate-fade-in sm:col-span-2">
          <label className="text-md text-white font-medium">Dealer PDI</label>
          <div className="ml-auto flex items-center">
            <input
              type="checkbox"
              name="dealerPDI"
              checked={data.dealerPDI || false}
              onChange={handleInputChange}
              className="h-5 w-5 text-lime-600 focus:ring-lime-500 border-gray-300 rounded mr-2"
            />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {showPhoto && (
        <FullScreenPhotoViewer
          photo={showPhoto}
          onClose={() => setShowPhoto(null)}
        />
      )}
    </div>
  );
};

export default BasicDetails;

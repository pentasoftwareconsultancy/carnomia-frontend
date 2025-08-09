import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineCamera, AiOutlineUpload } from 'react-icons/ai';
import ToggleButton from '../report/ToggleButton';
import FullScreenPhotoViewer from '../report/FullScreenPhotoViewer';

const BasicDetails = ({ basicDetails, setBasicDetails, showPhoto, setShowPhoto }) => {
  const videoRefs = useRef({ vinNumber: null, engineNumber: null, odo: null });
  const [streamStates, setStreamStates] = useState({ vinNumber: null, engineNumber: null, odo: null });
  const [isCameraActive, setIsCameraActive] = useState({ vinNumber: false, engineNumber: false, odo: false });
  const [isEngineNumberEnabled, setIsEngineNumberEnabled] = useState(true);

  useEffect(() => {
    console.log('BasicDetails component mounted, setting up cleanup for camera streams');
    return () => {
      console.log('BasicDetails component unmounting, stopping all active camera streams');
      Object.values(streamStates).forEach((stream) => {
        if (stream) {
          console.log('Stopping stream:', stream);
          stream.getTracks().forEach((track) => track.stop());
        }
      });
    };
  }, [streamStates]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Input changed - field: ${name}, value: ${type === 'checkbox' ? checked : value}`);
    setBasicDetails((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    console.log(`File selected for upload on field: ${field}`, file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(`File read completed for field: ${field}`);
        setBasicDetails((prev) => ({ ...prev, [`${field}Photo`]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('Selected file is not an image or no file selected');
    }
  };

  const handleCameraClick = async (field) => {
    if (!isCameraActive[field]) {
      try {
        console.log(`Requesting camera access for field: ${field}`);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Camera stream obtained:', stream);
        setStreamStates((prev) => ({ ...prev, [field]: stream }));
        if (videoRefs.current[field]) {
          videoRefs.current[field].srcObject = stream;
          console.log(`Video ref set for field: ${field}`);
        }
        setIsCameraActive((prev) => ({ ...prev, [field]: true }));
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Camera access denied. Please allow camera permissions.');
      }
    } else {
      console.log(`Camera active for ${field}, taking photo now`);
      takePhoto(field);
    }
  };

  const takePhoto = (field) => {
    const video = videoRefs.current[field];
    if (video) {
      console.log(`Taking photo for field: ${field}`);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/png');
      console.log(`Photo captured for field: ${field}`);
      setBasicDetails((prev) => ({ ...prev, [`${field}Photo`]: photo }));
      stopCamera(field);
      setIsCameraActive((prev) => ({ ...prev, [field]: false }));
    } else {
      console.warn(`No video element found for field: ${field}`);
    }
  };

  const stopCamera = (field) => {
    if (streamStates[field]) {
      console.log(`Stopping camera stream for field: ${field}`);
      streamStates[field].getTracks().forEach((track) => track.stop());
      setStreamStates((prev) => ({ ...prev, [field]: null }));
      if (videoRefs.current[field]) {
        videoRefs.current[field].srcObject = null;
      }
    }
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Basic Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* vinNumber Number */}
        <div className="flex flex-col animate-fade-in">
          <label className="text-md text-white font-medium">vinNumber Number</label>
          <div className="mt-2 flex flex-col">
            <input
              type="text"
              name="vinNumber"
              value={basicDetails.vinNumber}
              onChange={handleInputChange}
              className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Enter vinNumber Number"
            />
            <div className="mt-2 flex items-center">
              {basicDetails.vinNumberPhoto && (
                <button
                  onClick={() => {
                    console.log('View photo clicked for vinNumber');
                    setShowPhoto(basicDetails.vinNumberPhoto);
                  }}
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
                    onChange={(e) => handleFileUpload(e, 'vinNumber')}
                  />
                </label>
                <button
                  onClick={() => handleCameraClick('vinNumber')}
                  className={`p-2 rounded-full ${isCameraActive.vinNumber ? 'bg-green-500' : 'bg-gray-500'} text-white hover:bg-opacity-80`}
                >
                  <AiOutlineCamera className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <video ref={(el) => (videoRefs.current.vinNumber = el)} autoPlay className="hidden" />
        </div>

        {/* Engine Number */}
        <div className="flex flex-col animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-md text-white font-medium">Engine Number</label>
            <ToggleButton
              checked={isEngineNumberEnabled}
              onChange={() => {
                console.log(`Engine Number toggle changed to: ${!isEngineNumberEnabled}`);
                setIsEngineNumberEnabled(!isEngineNumberEnabled);
              }}
            />
          </div>
          <div className="mt-2 flex flex-col" style={{ display: isEngineNumberEnabled ? 'flex' : 'none' }}>
            <input
              type="text"
              name="engineNumber"
              value={basicDetails.engineNumber}
              onChange={handleInputChange}
              className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Enter Engine Number"
              disabled={!isEngineNumberEnabled}
            />
            <div className="mt-2 flex items-center">
              {basicDetails.engineNumberPhoto && (
                <button
                  onClick={() => {
                    console.log('View photo clicked for engineNumber');
                    setShowPhoto(basicDetails.engineNumberPhoto);
                  }}
                  className="px-3 py-1 text-sm bg-lime-500 text-white rounded-md hover:bg-lime-600 mr-2"
                >
                  View Photo
                </button>
              )}
              <div className="ml-auto flex space-x-2">
                <label
                  className="cursor-pointer p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                  style={{ opacity: isEngineNumberEnabled ? 1 : 0.5, pointerEvents: isEngineNumberEnabled ? 'auto' : 'none' }}
                >
                  <AiOutlineUpload className="text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'engineNumber')}
                    disabled={!isEngineNumberEnabled}
                  />
                </label>
                <button
                  onClick={() => handleCameraClick('engineNumber')}
                  className={`p-2 rounded-full ${isCameraActive.engineNumber ? 'bg-green-500' : 'bg-gray-500'} text-white hover:bg-opacity-80`}
                  style={{ opacity: isEngineNumberEnabled ? 1 : 0.5, pointerEvents: isEngineNumberEnabled ? 'auto' : 'none' }}
                  disabled={!isEngineNumberEnabled}
                >
                  <AiOutlineCamera className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <video ref={(el) => (videoRefs.current.engineNumber = el)} autoPlay className="hidden" />
        </div>

        {/* odo and Keys */}
        <div className="flex flex-col animate-fade-in sm:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-md text-white font-medium">odo</label>
              <div className="mt-2 flex flex-col">
                <input
                  type="number"
                  name="odo"
                  value={basicDetails.odo}
                  onChange={handleInputChange}
                  className="p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter odo"
                />
                <div className="mt-2 flex items-center">
                  {basicDetails.odoPhoto && (
                    <button
                      onClick={() => {
                        console.log('View photo clicked for odo');
                        setShowPhoto(basicDetails.odoPhoto);
                      }}
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
                        onChange={(e) => handleFileUpload(e, 'odo')}
                      />
                    </label>
                    <button
                      onClick={() => handleCameraClick('odo')}
                      className={`p-2 rounded-full ${isCameraActive.odo ? 'bg-green-500' : 'bg-gray-500'} text-white hover:bg-opacity-80`}
                    >
                      <AiOutlineCamera className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
              <video ref={(el) => (videoRefs.current.odo = el)} autoPlay className="hidden" />
            </div>

            <div className="flex flex-col">
              <label className="text-md text-white font-medium">Keys</label>
              <div className="mt-2 flex flex-col">
                <input
                  type="text"
                  name="keys"
                  value={basicDetails.keys}
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
              checked={basicDetails.dealerPDI}
              onChange={(e) => {
                console.log(`Dealer PDI checkbox changed to: ${e.target.checked}`);
                handleInputChange(e);
              }}
              className="h-5 w-5 text-lime-600 focus:ring-lime-500 border-gray-300 rounded mr-2"
            />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {showPhoto && (
        <FullScreenPhotoViewer
          photo={showPhoto}
          onClose={() => {
            console.log('Full screen photo viewer closed');
            setShowPhoto(null);
          }}
        />
      )}
    </div>
  );
};

export default BasicDetails;
import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from 'react-icons/ai';

const ToggleButton = ({ checked, onChange, label }) => {
  const handleChange = (e) => {
    const scrollY = window.scrollY;
    onChange(e);
    window.scrollTo(0, scrollY);
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
          autoFocus={false}
        />
        <div className={`w-10 h-5 bg-gray-600 rounded-full shadow-inner ${checked ? 'bg-lime-500' : ''}`}>
          <div
            className={`absolute w-5 h-5 bg-white rounded-full shadow -left-1 top-0 transition-transform duration-200 ease-in-out ${
              checked ? 'transform translate-x-5' : ''
            }`}
          />
        </div>
      </div>
      <span className="ml-2 text-white">{label}</span>
    </label>
  );
};

const Glasses = ({ glassPanels, setglassPanels }) => {
  const panels = [
    'front_windshield_brand', 'front_left_door_glass_brand', 'left_side_orvm_issues', 'rear_left_door_glass_brand', 'rear_left_quarter_glass_brand',
    'rear_windshield_brand', 'rear_right_quarter_glass_brand', 'rear_right_door_glass_brand', 'front_right_door_glass_brand', 'right_side_orvm_issues', 'sunroof_glass_brand'
  ];

  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [photos, setPhotos] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [brand, setBrand] = useState({});
  const [manufacturingDate, setManufacturingDate] = useState({});
  const [condition, setCondition] = useState({});

  useEffect(() => {
    const initMaps = panels.reduce((acc, id) => {
      const photoCount = ['front_windshield_brand', 'front_left_door_glass_brand', 'rear_left_door_glass_brand', 'rear_left_quarter_glass_brand', 'rear_windshield_brand', 'rear_right_quarter_glass_brand', 'rear_right_door_glass_brand', 'front_right_door_glass_brand', 'sunroof_glass_brand'].includes(id) ? 5 : 1;
      acc.streamStates[id] = Array(photoCount).fill(null);
      acc.isCameraActive[id] = Array(photoCount).fill(false);
      acc.photos[id] = Array(photoCount).fill(null);

      acc.brand[id] = '';
      acc.manufacturingDate[id] = '';
      acc.condition[id] = 'None';
      return acc;
    }, { streamStates: {}, isCameraActive: {}, photos: {}, brand: {}, manufacturingDate: {}, condition: {} });

    setStreamStates(initMaps.streamStates);
    setIsCameraActive(initMaps.isCameraActive);
    setPhotos(initMaps.photos);
    setBrand(initMaps.brand);
    setManufacturingDate(initMaps.manufacturingDate);
    setCondition(initMaps.condition);
    setgetPanels();
    
    console.log('Initial glass state:', {
      streamStates: initMaps.streamStates,
      isCameraActive: initMaps.isCameraActive,
      photos: initMaps.photos,
      brand: initMaps.brand,
      manufacturingDate: initMaps.manufacturingDate,
      condition: initMaps.condition,
    });
  }, []);

  // Log photos state changes
  useEffect(() => {
    console.log('Photos updated:', photos);
  }, [photos]);

  // Log brand state changes
  useEffect(() => {
    console.log('Brand updated:', brand);
  }, [brand]);

  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach(streamArr => {
        streamArr.forEach(s => s?.getTracks().forEach(t => t.stop()));
      });
    };
  }, [streamStates]);

  const handleCameraClick = async (id, idx) => {
    const activeArr = [...(isCameraActive[id] || Array(photos[id]?.length || 1).fill(false))];
    const stateArr = [...(streamStates[id] || Array(photos[id]?.length || 1).fill(null))];

    if (!activeArr[idx]) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stateArr[idx] = stream;
        activeArr[idx] = true;
        if (videoRefs.current[`${id}-${idx}`]) {
          videoRefs.current[`${id}-${idx}`].srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Camera access denied. Please allow camera permissions.');
      }
    } else {
      takePhoto(id, idx, stateArr[idx]);
      stateArr[idx]?.getTracks().forEach(t => t.stop());
      activeArr[idx] = false;
      stateArr[idx] = null;
    }

    setStreamStates(prev => ({ ...prev, [id]: stateArr }));
    setIsCameraActive(prev => ({ ...prev, [id]: activeArr }));
  };

  const takePhoto = (id, idx, stream) => {
    const video = videoRefs.current[`${id}-${idx}`];
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/png');
    const arr = [...(photos[id] || Array(photos[id]?.length || 1).fill(null))];
    arr[idx] = image;

    setPhotos(prev => {
      const newPhotos = { ...prev, [id]: arr };
      console.log(`Photo taken for ${id}[${idx}]:`, arr[idx]);
      return newPhotos;
    });

    setGlassDetails(prev => {
      const newDetails = { ...prev, [id]: arr };
      console.log('Glass details updated:', newDetails);
      return newDetails;
    });

    setShowDropdown(null);
  };

  const handleFileUpload = (e, id, idx) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arr = [...(photos[id] || Array(photos[id]?.length || 1).fill(null))];
        arr[idx] = reader.result;
        setPhotos(prev => ({ ...prev, [id]: arr }));
        setGlassDetails(prev => ({ ...prev, [id]: arr }));
        setShowDropdown(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDropdown = (id, idx) => {
    setShowDropdown(curr => (curr === `${id}-${idx}` ? null : `${id}-${idx}`));
  };

  const handlePlusClick = (id, idx) => {
    if (photos[id]?.[idx]) {
      setShowPhoto(photos[id][idx]);
    } else {
      toggleDropdown(id, idx);
    }
  };

  const handleInputChange = (setter) => (e) => {
    const scrollY = window.scrollY;
    setter(e.target.value);
    window.scrollTo(0, scrollY);
    console.log('Input changed:', e.target.value);
  };

  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(' ');
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  if (!photos || Object.keys(photos).length === 0) {
    return <div className="text-white">Loading glass panel data...</div>;
  }

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Glass Panels</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {panels.map((id, idx) => {
          const isGlassSpecial = ['front_windshield_brand', 'front_left_door_glass_brand', 'rear_left_door_glass_brand', 'rear_left_quarter_glass_brand', 'rear_windshield_brand', 'rear_right_quarter_glass_brand', 'rear_right_door_glass_brand', 'front_right_door_glass_brand', 'sunroof_glass_brand'].includes(id);
          const photoCount = isGlassSpecial ? 5 : 1;

          return (
            <div key={id} className="flex flex-col w-full">
              <label className="text-md text-white font-medium text-left mb-2">{`${idx + 1}. ${capitalizeFirstWord(id.replace(/([A-Z])/g, ' $1'))}`}</label>

              {isGlassSpecial && (
                <>
                  <div className="mb-4">
                    <label className="text-md text-white font-medium text-left mb-2">Brand</label>
                    <input
                      type="text"
                      value={glassPanels[id] || ''}
                      onChange={(e) => handleInputChange((value) => setBrand(prev => ({ ...prev, [id]: value })))(e)}
                      className="p-2 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                      placeholder="Enter brand"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-md text-white font-medium text-left mb-2">Manufacturing MM/YY</label>
                    <input
                      type="text"
                      value={glassPanels[id] || ''}
                      onChange={(e) => handleInputChange((value) => setManufacturingDate(prev => ({ ...prev, [id]: value })))(e)}
                      className="p-2 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                      placeholder="MM/YY"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="text-md text-white font-medium text-left mb-2">Issues</label>
                <select
                  value={glassPanels[id] || 'None'}
                  onChange={e => setCondition(prev => ({ ...prev, [id]: e.target.value }))}
                  className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option>None</option>
                  <option>Crack</option>
                  <option>Chip</option>
                  <option>Scratch</option>
                </select>
              </div>

              {condition[id] !== 'None' && (
                <div className="mt-2 flex flex-col items-center">
                  <div className="mt-2 flex flex-wrap gap-4 justify-center">
                    {Array.from({ length: photoCount }).map((_, i) => (
                      <div key={i} className="relative">
                        {glassPanels[id]?.[i] ? (
                          <img
                            src={glassPanels[id][i]}
                            alt={`Photo ${i + 1} for ${id}`}
                            className="w-24 h-24 object-cover rounded-md cursor-pointer"
                            onClick={() => setShowPhoto(glassPanels[id][i])}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                            <button
                              onClick={() => handlePlusClick(id, i)}
                              className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                              title={glassPanels[id]?.[i] ? "View Photo" : "Add Photo"}
                            >
                              <AiOutlinePlus className="text-xl" />
                            </button>
                          </div>
                        )}

                        {showDropdown === `${id}-${i}` && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                            <button
                              onClick={() => handleCameraClick(id, i)}
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
                                onChange={(e) => handleFileUpload(e, id, i)}
                              />
                            </label>
                          </div>
                        )}

                        <video
                          ref={el => (videoRefs.current[`${id}-${i}`] = el)}
                          autoPlay
                          className={glassPanels[id]?.[i] ? 'w-24 h-24 rounded-md' : 'hidden'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative max-w-screen max-h-screen p-4">
            <img
              src={showPhoto}
              alt="Full View"
              className="max-w-screen max-h-screen object-contain rounded-md"
            />
            <button
              onClick={() => setShowPhoto(null)}
              className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Glasses;
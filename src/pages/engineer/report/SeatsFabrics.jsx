import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload } from 'react-icons/ai';

const seatPanels = [
  'seat_driver',
  'seat_driver_head_rest',
  'seat_codriver',
  'seat_codriver_head_rest',
  'seat_rear',
  'seat_rear_head_rest',
  'seat_third_row',
  'seat_third_row_head_rest',
  'seat_roof',
  'seat_sunroof'
];

const ToggleButton = ({ checked, onChange }) => {
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
    </label>
  );
};

const SeatsFabrics = ({ seatDetails, setSeatDetails, showPhoto, setShowPhoto }) => {
  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [photos, setPhotos] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [condition, setCondition] = useState({});
  const [seat_third_row_toggle, setSeat_third_row_toggle] = useState(false);

  useEffect(() => {
    const initConditions = {};
    const initPhotos = {};
    seatPanels.forEach(panel => {
      initConditions[panel] = 'None';
      initPhotos[panel] = Array(5).fill(null);
    });
    setCondition(initConditions);
    setPhotos(initPhotos);

    console.log("Initialized conditions:", initConditions);
    console.log("Initialized photos:", initPhotos);
  }, []);

  // Log condition changes with field names
  useEffect(() => {
    Object.entries(condition).forEach(([field, val]) => {
      console.log(`Condition updated - Field: ${field}, Value: ${val}`);
    });
  }, [condition]);

  // Log photos changes with field names and count
  useEffect(() => {
    Object.entries(photos).forEach(([field, arr]) => {
      console.log(`Photos updated - Field: ${field}, Photos count: ${arr.filter(Boolean).length}`);
    });
  }, [photos]);

  // Log third row toggle field and value
  useEffect(() => {
    console.log(`Toggle updated - Field: seat_third_row_toggle, Value: ${seat_third_row_toggle}`);
  }, [seat_third_row_toggle]);

  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach(streamArr => {
        streamArr.forEach(s => s?.getTracks().forEach(t => t.stop()));
      });
      console.log("Cleanup camera streams on unmount");
    };
  }, [streamStates]);

  const handleCameraClick = async (id, idx) => {
    const activeArr = [...(isCameraActive[id] || Array(5).fill(false))];
    const stateArr = [...(streamStates[id] || Array(5).fill(null))];

    if (!activeArr[idx]) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stateArr[idx] = stream;
        activeArr[idx] = true;
        if (videoRefs.current[`${id}-${idx}`]) {
          videoRefs.current[`${id}-${idx}`].srcObject = stream;
        }
        console.log(`Camera started for ${id} index ${idx}`);
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Camera access denied. Please allow camera permissions.');
      }
    } else {
      takePhoto(id, idx, stateArr[idx]);
      stateArr[idx]?.getTracks().forEach(t => t.stop());
      activeArr[idx] = false;
      stateArr[idx] = null;
      console.log(`Camera stopped for ${id} index ${idx}`);
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

    const arr = [...(photos[id] || Array(5).fill(null))];
    arr[idx] = image;
    setPhotos(prev => ({ ...prev, [id]: arr }));
    setSeatDetails(prev => ({ ...prev, [id]: arr }));
    setShowDropdown(null);
    console.log(`Photo taken - Field: ${id}, Index: ${idx}, Image data length: ${image.length}`);
  };

  const handleFileUpload = (e, id, idx) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arr = [...(photos[id] || Array(5).fill(null))];
        arr[idx] = reader.result;
        setPhotos(prev => ({ ...prev, [id]: arr }));
        setSeatDetails(prev => ({ ...prev, [id]: arr }));
        setShowDropdown(null);
        console.log(`Photo uploaded - Field: ${id}, Index: ${idx}, Image data length: ${reader.result.length}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDropdown = (id, idx) => {
    setShowDropdown(curr => (curr === `${id}-${idx}` ? null : `${id}-${idx}`));
    console.log(`Dropdown toggled - Field: ${id}, Index: ${idx}`);
  };

  const handlePlusClick = (id, idx) => {
    if (photos[id]?.[idx]) {
      setShowPhoto(photos[id][idx]);
      console.log(`Viewing photo - Field: ${id}, Index: ${idx}`);
    } else {
      toggleDropdown(id, idx);
    }
  };

  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(' ');
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  if (!photos || Object.keys(photos).length === 0) {
    return <div className="text-white">Loading seat and fabric panel data...</div>;
  }

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Seats & Fabrics</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {seatPanels.map((id, idx) => (
          <div key={id} className="flex flex-col w-full">
            {id === 'seat_third_row' ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-md text-white font-medium text-left">{`${idx + 1}. ${capitalizeFirstWord(id.replace(/_/g, ' '))}`}</label>
                  <ToggleButton
                    checked={seat_third_row_toggle}
                    onChange={() => setSeat_third_row_toggle(prev => {
                      console.log("Toggle updated - Field: seat_third_row_toggle, New Value:", !prev);
                      return !prev;
                    })}
                  />
                </div>
                {seat_third_row_toggle && (
                  <>
                    <div className="mb-4">
                      <label className="text-md text-white font-medium text-left mb-2">Issues</label>
                      <select
                        value={condition[id] || 'None'}
                        onChange={e => {
                          console.log(`Condition changed - Field: ${id}, New Value: ${e.target.value}`);
                          setCondition(prev => ({ ...prev, [id]: e.target.value }));
                        }}
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
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="relative">
                              {photos[id]?.[i] ? (
                                <img
                                  src={photos[id][i]}
                                  alt={`Photo ${i + 1} for ${id}`}
                                  className="w-24 h-24 object-cover rounded-md cursor-pointer"
                                  onClick={() => {
                                    setShowPhoto(photos[id][i]);
                                    console.log(`Viewing photo - Field: ${id}, Index: ${i}`);
                                  }}
                                />
                              ) : (
                                <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                                  <button
                                    onClick={() => handlePlusClick(id, i)}
                                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                                    title={photos[id]?.[i] ? "View Photo" : "Add Photo"}
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
                                className={isCameraActive[id]?.[i] ? 'w-24 h-24 rounded-md' : 'hidden'}
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
                <label className="text-md text-white font-medium text-left mb-2">{`${idx + 1}. ${capitalizeFirstWord(id.replace(/_/g, ' '))}`}</label>
                <div className="mb-4">
                  <label className="text-md text-white font-medium text-left mb-2">Issues</label>
                  <select
                    value={condition[id] || 'None'}
                    onChange={e => {
                      console.log(`Condition changed - Field: ${id}, New Value: ${e.target.value}`);
                      setCondition(prev => ({ ...prev, [id]: e.target.value }));
                    }}
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
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="relative">
                          {photos[id]?.[i] ? (
                            <img
                              src={photos[id][i]}
                              alt={`Photo ${i + 1} for ${id}`}
                              className="w-24 h-24 object-cover rounded-md cursor-pointer"
                              onClick={() => {
                                setShowPhoto(photos[id][i]);
                                console.log(`Viewing photo - Field: ${id}, Index: ${i}`);
                              }}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                              <button
                                onClick={() => handlePlusClick(id, i)}
                                className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                                title={photos[id]?.[i] ? "View Photo" : "Add Photo"}
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
                            className={isCameraActive[id]?.[i] ? 'w-24 h-24 rounded-md' : 'hidden'}
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

export default SeatsFabrics;
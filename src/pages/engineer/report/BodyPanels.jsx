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

const BodyPanels = ({ bodyPanels, setBodyPanels }) => {
  const panels = [
    'bonnet_issue', 'bumper', 'frontLeftFender', 'frontLeftDoor', 'rearLeftDoor',
    'rearLeftQuarterPanel', 'boot', 'rearBumper', 'rearRightQuarterPanel',
    'rearRightDoor', 'frontRightDoor', 'frontRightFender', 'roof'
  ];

  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState({});
  const [isCameraActive, setIsCameraActive] = useState({});
  const [photos, setPhotos] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);

  const [paint, setPaint] = useState({});
  const [issue, setIssue] = useState({});
  const [cladToggle, setCladToggle] = useState({});
  const [cladIssue, setCladIssue] = useState({});

  useEffect(() => {
    const initMaps = panels.reduce((acc, id) => {
      acc.streamStates = { ...acc.streamStates, [id]: Array(5).fill(null) };
      acc.isCameraActive = { ...acc.isCameraActive, [id]: Array(5).fill(false) };
      acc.photos = { ...acc.photos, [id]: Array(5).fill(null) };
      acc.paint = { ...acc.paint, [id]: '' };
      acc.issue = { ...acc.issue, [id]: 'None' };
      acc.cladToggle = { ...acc.cladToggle, [id]: false };
      acc.cladIssue = { ...acc.cladIssue, [id]: 'None' };
      return acc;
    }, { streamStates: {}, isCameraActive: {}, photos: {}, paint: {}, issue: {}, cladToggle: {}, cladIssue: {} });

    // Initialize tail light issues for boot
    initMaps.issue['boot_tailLightLeft'] = 'None';
    initMaps.issue['boot_tailLightRight'] = 'None';

    setStreamStates(initMaps.streamStates);
    setIsCameraActive(initMaps.isCameraActive);
    setPhotos(initMaps.photos);
    setPaint(initMaps.paint);
    setIssue(initMaps.issue);
    setCladToggle(initMaps.cladToggle);
    setCladIssue(initMaps.cladIssue);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(streamStates).forEach(streamArr => {
        streamArr.forEach(s => s?.getTracks().forEach(t => t.stop()));
      });
    };
  }, [streamStates]);

  const handleCameraClick = async (id, idx) => {
    const activeArr = [...(isCameraActive[id] || [])];
    const stateArr = [...(streamStates[id] || [])];

    if (!activeArr[idx]) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stateArr[idx] = stream;
        activeArr[idx] = true;
        if (videoRefs.current[`${id}-${idx}`]) {
          videoRefs.current[`${id}-${idx}`].srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Failed to access camera. Please check permissions.');
        return;
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
    if (!video || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL();
    const arr = [...(photos[id] || [])];
    arr[idx] = image;
    setPhotos(prev => ({ ...prev, [id]: arr }));
    // setMechanicalDetails(prev => ({ ...prev, [id]: arr }));
  };

  const toggleDropdown = (id, idx) => {
    setShowDropdown(curr => (curr === `${id}-${idx}` ? null : `${id}-${idx}`));
  };

  const handleCheckboxChange = (setter) => (e) => {
    const scrollY = window.scrollY;
    setter(e.target.checked);
    window.scrollTo(0, scrollY);
  };

  const handleInputChange = (setter) => (e) => {
    const scrollY = window.scrollY;
    setter(e.target.value);
    window.scrollTo(0, scrollY);
  };

  const handleSelectChange = (setter) => (e) => {
    const scrollY = window.scrollY;
    setter(e.target.value);
    window.scrollTo(0, scrollY);
  };

  // Helper function to capitalize the first word
  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(' ');
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Body Panels</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {panels.map((id, idx) => {
          const isSpecial = true;
          const photoCount = isSpecial ? 5 : 1;

          return (
            <div key={id} className="flex flex-col w-full">
              <label className="text-md text-white font-medium text-left mb-2">{`${idx + 1}. ${capitalizeFirstWord(id.replace(/([A-Z])/g, ' $1'))}`}</label>
              {isSpecial && id !== 'rearBumper' && id !== 'bumper' && (
                <div className="mb-4">
                  <label className="text-md text-white font-medium text-left mb-2">Paint Thickness</label>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={bodyPanels[id] || ''}
                      onChange={handleInputChange((value) => setBodyPanels(prev => ({ ...prev, [id]: value })))}
                      className="p-2 bg-transparent text-white border border-green-200 shadow-inner rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                      placeholder="Enter thickness (mm)"
                    />
                    {id === 'bonnet' && (
                      <div className="ml-4 flex space-x-4">
                        <label className="text-md text-white font-medium flex items-center">
                          <input
                            type="checkbox"
                            // checked={mechanicalDetails.repaintBonnet || false}
                            // onChange={handleCheckboxChange((checked) =>
                            //   setMechanicalDetails(prev => ({ ...prev, repaintBonnet: checked }))
                            // )}
                            className="mr-2 h-5 w-5 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                          />
                          Repaint
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isSpecial && (
                <div className="mb-4">
                  <label className="text-md text-white font-medium text-left mb-2">Issue</label>
                  <select
                    value={bodyPanels[id] || 'None'}
                    onChange={handleSelectChange((value) => setBodyPanels(prev => ({ ...prev, [id]: value })))}
                    className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option>None</option>
                    <option>Scratch</option><option>Dent</option><option>Rust</option><option>Crack</option>
                  </select>
                </div>
              )}

              {id === 'boot' && (
                <>
                  <div className="mb-4">
                    <label className="text-md text-white font-medium text-left mb-2">Tail Light Console Left</label>
                    <select
                      value={issue['boot_tailLightLeft'] || 'None'}
                      onChange={handleSelectChange((value) => setIssue(prev => ({ ...prev, ['boot_tailLightLeft']: value })))}
                      className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                    >
                      <option>None</option><option>Scratch</option><option>Dent</option><option>Rust</option><option>Crack</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-md text-white font-medium text-left mb-2">Tail Light Console Right</label>
                    <select
                      value={issue['boot_tailLightRight'] || 'None'}
                      onChange={handleSelectChange((value) => setIssue(prev => ({ ...prev, ['boot_tailLightRight']: value })))}
                      className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                    >
                      <option>None</option><option>Scratch</option><option>Dent</option><option>Rust</option><option>Crack</option>
                    </select>
                  </div>
                </>
              )}

              {(id === 'frontLeftDoor' || id === 'frontRightDoor') && (
                <div className="mb-4">
                  <label className="text-md text-white font-medium text-left mb-2">{id === 'frontLeftDoor' ? 'Left ORVM Issue' : 'Right ORVM Issue'}</label>
                  <select
                    value={issue[id + '_orvm'] || 'None'}
                    onChange={handleSelectChange((value) => setIssue(prev => ({ ...prev, [id + '_orvm']: value })))}
                    className="p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option>None</option><option>Scratch</option><option>Dent</option><option>Rust</option><option>Crack</option>
                  </select>
                </div>
              )}

              {['frontLeftFender', 'frontLeftDoor', 'rearLeftDoor', 'rearLeftQuarterPanel', 'rearRightQuarterPanel', 'rearRightDoor', 'frontRightDoor', 'frontRightFender'].includes(id) && (
                <div className="mb-4">
                  <label className="flex justify-between items-center text-md text-white font-medium mb-2">
                    Cladding
                    <ToggleButton
                      checked={cladToggle[id] || false}
                      onChange={e => setCladToggle(prev => ({ ...prev, [id]: e.target.checked }))}
                      label="Toggle"
                    />
                  </label>
                  {cladToggle[id] && (
                    <select
                      value={cladIssue[id] || 'None'}
                      onChange={handleSelectChange((value) => setCladIssue(prev => ({ ...prev, [id]: value })))}
                      className="mt-2 p-2 bg-gray-800 text-white border border-green-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
                    >
                      <option>None</option><option>Scratch</option><option>Dent</option><option>Rust</option><option>Crack</option>
                    </select>
                  )}
                </div>
              )}

              {(id === 'boot'
                ? (issue[id] !== 'None' || issue['boot_tailLightLeft'] !== 'None' || issue['boot_tailLightRight'] !== 'None')
                : (issue[id] !== 'None' || (issue[id + '_orvm'] && issue[id + '_orvm'] !== 'None') || (cladToggle[id] && cladIssue[id] !== 'None'))) && (
                <div className="mt-2 flex flex-col items-center">
                  <div className="mt-2 flex flex-wrap gap-4 justify-center">
                    {Array.from({ length: photoCount }).map((_, i) => (
                      <div key={i} className="relative">
                        {photos[id]?.[i] ? (
                          <img
                            src={photos[id][i]}
                            alt=""
                            className="w-24 h-24 object-cover rounded-md cursor-pointer"
                            // onClick={() => setShowPhoto(photos[id][i])}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                            <button onClick={() => toggleDropdown(id, i)} className="p-2 rounded-full bg-gray-500 text-white">
                              <AiOutlinePlus />
                            </button>
                          </div>
                        )}

                        {showDropdown === `${id}-${i}` && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg z-10 w-48">
                            <button
                              onClick={() => handleCameraClick(id, i)}
                              className="flex items-center px-4 py-3 w-full text-left text-white hover:bg-gray-700"
                            >
                              <AiOutlineCamera className="mr-2" /> Take Photo
                            </button>
                            <label className="flex items-center px-4 py-3 w-full text-white hover:bg-gray-700 cursor-pointer">
                              <AiOutlineUpload className="mr-2" /> Upload Photo
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => {
                                  const file = e.target.files[0];
                                  if (!file?.type.startsWith('image/')) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setPhotos(prev => {
                                      const arr = [...(prev[id] || [])];
                                      arr[i] = reader.result;
                                      // setMechanicalDetails(prevD => ({ ...prevD, [id]: arr }));
                                      return { ...prev, [id]: arr };
                                    });
                                    setShowDropdown(null);
                                  };
                                  reader.readAsDataURL(file);
                                }}
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
            </div>
          );
        })}
      </div>

      {/* {showPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img src={showPhoto} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" />
            <button onClick={() => setShowPhoto(null)}
              className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white">✕</button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default BodyPanels;
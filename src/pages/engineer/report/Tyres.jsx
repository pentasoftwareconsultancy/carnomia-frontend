import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus, AiOutlineCamera, AiOutlineUpload, AiOutlineDelete } from 'react-icons/ai';

const TyreCard = ({ tyreName, tyreData, updateTyreData, setShowPhoto, idx }) => {
  const videoRefs = useRef({});
  const [streamStates, setStreamStates] = useState(Array(5).fill(null));
  const [isCameraActive, setIsCameraActive] = useState(Array(5).fill(false));
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    return () => {
      streamStates.forEach(stream => {
        stream?.getTracks().forEach(track => track.stop());
      });
    };
  }, [streamStates]);

  const handleInputChange = (field, value) => {
    updateTyreData({ ...tyreData, [field]: value });
  };

  const handleCameraClick = async (index) => {
    if (!isCameraActive[index]) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newStreamStates = [...streamStates];
        newStreamStates[index] = stream;
        const newIsCameraActive = [...isCameraActive];
        newIsCameraActive[index] = true;
        setStreamStates(newStreamStates);
        setIsCameraActive(newIsCameraActive);
        if (videoRefs.current[`${tyreName}-${index}`]) {
          videoRefs.current[`${tyreName}-${index}`].srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Camera access denied. Please allow camera permissions.');
      }
    } else {
      takePhoto(index, streamStates[index]);
      const newStreamStates = [...streamStates];
      newStreamStates[index]?.getTracks().forEach(track => track.stop());
      newStreamStates[index] = null;
      const newIsCameraActive = [...isCameraActive];
      newIsCameraActive[index] = false;
      setStreamStates(newStreamStates);
      setIsCameraActive(newIsCameraActive);
    }
    setShowDropdown(null);
  };

  const takePhoto = (index, stream) => {
    const video = videoRefs.current[`${tyreName}-${index}`];
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/png');
    const newPhotos = [...tyreData.photos];
    newPhotos[index] = image;
    updateTyreData({ ...tyreData, photos: newPhotos });
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...tyreData.photos];
        newPhotos[index] = reader.result;
        updateTyreData({ ...tyreData, photos: newPhotos });
        setShowDropdown(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = [...tyreData.photos];
    newPhotos[index] = null;
    updateTyreData({ ...tyreData, photos: newPhotos });
  };

  const toggleDropdown = (index) => {
    setShowDropdown(curr => (curr === `${tyreName}-${index}` ? null : `${tyreName}-${index}`));
  };

  const handlePlusClick = (index) => {
    if (tyreData.photos[index]) {
      setShowPhoto(tyreData.photos[index]);
    } else {
      toggleDropdown(index);
    }
  };

  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(' ');
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-white text-left">
        {`${idx + 1}. ${capitalizeFirstWord(tyreName.replace(/([A-Z])/g, ' $1'))}`}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm text-white font-medium mb-1 block">Brand</label>
          <select
            value={tyreData.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-[#1a1a1a] text-white">Select Brand</option>
            <option value="Michelin" className="bg-[#1a1a1a] text-white">Michelin</option>
            <option value="Bridgestone" className="bg-[#1a1a1a] text-white">Bridgestone</option>
            <option value="Goodyear" className="bg-[#1a1a1a] text-white">Goodyear</option>
            <option value="Pirelli" className="bg-[#1a1a1a] text-white">Pirelli</option>
            <option value="Continental" className="bg-[#1a1a1a] text-white">Continental</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-white font-medium mb-1 block">Sub-Brand</label>
          <select
            value={tyreData.subBrand}
            onChange={(e) => handleInputChange('subBrand', e.target.value)}
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-[#1a1a1a] text-white">Select Sub-Brand</option>
            <option value="Pilot Sport" className="bg-[#1a1a1a] text-white">Pilot Sport</option>
            <option value="Turanza" className="bg-[#1a1a1a] text-white">Turanza</option>
            <option value="Eagle F1" className="bg-[#1a1a1a] text-white">Eagle F1</option>
            <option value="P Zero" className="bg-[#1a1a1a] text-white">P Zero</option>
            <option value="ContiSportContact" className="bg-[#1a1a1a] text-white">ContiSportContact</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-white font-medium mb-1 block">Size</label>
          <select
            value={tyreData.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-[#1a1a1a] text-white">Select Size</option>
            <option value="205/55R16" className="bg-[#1a1a1a] text-white">205/55R16</option>
            <option value="225/45R17" className="bg-[#1a1a1a] text-white">225/45R17</option>
            <option value="235/40R18" className="bg-[#1a1a1a] text-white">235/40R18</option>
            <option value="245/35R19" className="bg-[#1a1a1a] text-white">245/35R19</option>
            <option value="255/35R20" className="bg-[#1a1a1a] text-white">255/35R20</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-white font-medium mb-1 block">Manufacturing Date (MM/YY)</label>
          <input
            type="text"
            value={tyreData.manufacturingDate}
            onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
            placeholder="MM/YY"
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>
        <div>
          <label className="text-sm text-white font-medium mb-1 block">Thread Depth (mm)</label>
          <input
            type="text"
            value={tyreData.threadDepth}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                handleInputChange('threadDepth', value);
              }
            }}
            placeholder="Enter thread depth"
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>
        <div>
          <label className="text-sm text-white font-medium mb-1 block">Issue</label>
          <select
            value={tyreData.issue}
            onChange={(e) => handleInputChange('issue', e.target.value)}
            className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-[#1a1a1a] text-white">Select Issue</option>
            <option value="Worn Tread" className="bg-[#1a1a1a] text-white">Worn Tread</option>
            <option value="Puncture" className="bg-[#1a1a1a] text-white">Puncture</option>
            <option value="Sidewall Damage" className="bg-[#1a1a1a] text-white">Sidewall Damage</option>
            <option value="Uneven Wear" className="bg-[#1a1a1a] text-white">Uneven Wear</option>
            <option value="No Issue" className="bg-[#1a1a1a] text-white">No Issue</option>
          </select>
        </div>
        {tyreData.issue && tyreData.issue !== 'No Issue' && (
          <div className="mt-2 flex flex-col items-center">
            <div className="flex flex-wrap gap-4 justify-center">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="relative">
                  {tyreData.photos[index] ? (
                    <img
                      src={tyreData.photos[index]}
                      alt={`Tyre photo ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md cursor-pointer"
                      onClick={() => handlePlusClick(index)}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                      <button
                        onClick={() => handlePlusClick(index)}
                        className="p-2 rounded-full bg-gray-500 text-white hover:bg-opacity-80"
                        title="Add Photo"
                      >
                        <AiOutlinePlus className="text-xl" />
                      </button>
                    </div>
                  )}
                  {showDropdown === `${tyreName}-${index}` && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#ffffff0a] backdrop-blur-[16px] rounded-md shadow-lg z-10 w-48">
                      <button
                        onClick={() => handleCameraClick(index)}
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
                          onChange={(e) => handleFileUpload(e, index)}
                        />
                      </label>
                    </div>
                  )}
                  <video
                    ref={el => (videoRefs.current[`${tyreName}-${index}`] = el)}
                    autoPlay
                    className={isCameraActive[index] ? 'w-24 h-24 rounded-md' : 'hidden'}
                  />
                  {tyreData.photos[index] && (
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-0 right-0 -mt-1 -mr-1 text-red-400 hover:text-red-500 focus:outline-none bg-[#ffffff0a] rounded-full p-1"
                      title="Remove photo"
                    >
                      <AiOutlineDelete className="text-xs" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Tyres = () => {
  const [tyresData, setTyresData] = useState({
    frontLeft: { brand: '', subBrand: '', size: '', manufacturingDate: '', threadDepth: '', issue: '', photos: [] },
    rearLeft: { brand: '', subBrand: '', size: '', manufacturingDate: '', threadDepth: '', issue: '', photos: [] },
    rearRight: { brand: '', subBrand: '', size: '', manufacturingDate: '', threadDepth: '', issue: '', photos: [] },
    frontRight: { brand: '', subBrand: '', size: '', manufacturingDate: '', threadDepth: '', issue: '', photos: [] },
    spareWheel: { brand: '', subBrand: '', size: '', manufacturingDate: '', threadDepth: '', issue: '', photos: [] },
  });

  const [showPhoto, setShowPhoto] = useState(null);

  const handleUpdateTyreData = (tyreKey) => (data) => {
    setTyresData((prev) => ({
      ...prev,
      [tyreKey]: data,
    }));
  };

  useEffect(() => {
    console.log('Tyres Data Updated:');
    Object.entries(tyresData).forEach(([tyreKey, tyreFields]) => {
      console.log(`--- ${tyreKey} ---`);
      Object.entries(tyreFields).forEach(([field, value]) => {
        console.log(`Field: ${field}, Value:`, value);
      });
    });
  }, [tyresData]);

  const tyrePositions = [
    { id: 'frontLeft', name: 'Front Left Side' },
    { id: 'rearLeft', name: 'Rear Left Side' },
    { id: 'rearRight', name: 'Rear Right Side' },
    { id: 'frontRight', name: 'Front Right Side' },
    { id: 'spareWheel', name: 'Spare Wheel' },
  ];

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Tyres</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {tyrePositions.map((tyre, idx) => (
          <TyreCard
            key={tyre.id}
            tyreName={tyre.name}
            tyreData={tyresData[tyre.id]}
            updateTyreData={handleUpdateTyreData(tyre.id)}
            setShowPhoto={setShowPhoto}
            idx={idx}
          />
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

export default Tyres;
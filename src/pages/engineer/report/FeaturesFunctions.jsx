import React, { useState, useEffect } from 'react';

const ToggleButton = ({ checked, onChange, label }) => {
  const handleChange = (e) => {
    const scrollY = window.scrollY;
    onChange(e);
    window.scrollTo(0, scrollY);
  };

  return (
    <label className="flex flex-col items-center cursor-pointer">
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
      <span className="mt-1 text-white text-sm">{label}</span>
    </label>
  );
};

const FeaturesFunctions = ({ featuresFunctionsDetails, setFeaturesFunctionsDetails }) => {
  const featurePanels = [
    'parkingSensorsFront', 'parkingSensorsRear', 'frontViewCamera', 'rearViewCamera',
    '360 Camera', 'touchScreen', 'speakers', 'electricORVM', 'autoDimmingIRVM',
    'ventilatedSeatDriverSide', 'ventilatedSeatCo-DriverSide', 'ventilatedSeatRear'
  ];

  // Initialize toggleStates with default values to prevent blank screen
  const [toggleStates, setToggleStates] = useState(
    featurePanels.reduce((acc, id) => {
      acc[id] = { available: false, issueObserved: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    // Log props and state for debugging
    console.log('Props:', { featuresFunctionsDetails, setFeaturesFunctionsDetails });
    console.log('Initial toggleStates:', toggleStates);

    // Sync initial state with parent
    if (typeof setFeaturesFunctionsDetails === 'function') {
      setFeaturesFunctionsDetails(toggleStates);
    } else {
      console.error('setFeaturesFunctionsDetails is not a function');
    }
  }, []); // Run only once on mount

  const handleToggleChange = (id, type) => {
    setToggleStates(prev => {
      const newState = {
        ...prev,
        [id]: {
          ...prev[id],
          [type]: !prev[id][type]
        }
      };
      // Sync with parent
      if (typeof setFeaturesFunctionsDetails === 'function') {
        setFeaturesFunctionsDetails(newState);
      } else {
        console.error('setFeaturesFunctionsDetails is not a function');
      }
      console.log('Updated toggleStates:', newState);
      return newState;
    });
  };

  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(' ');
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  // Log toggleStates before render for debugging
  console.log('Rendering with toggleStates:', toggleStates);

  // Fallback UI if toggleStates is empty or undefined
  if (!toggleStates || Object.keys(toggleStates).length === 0) {
    return <div className="text-white">Loading features and functions data...</div>;
  }

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Features & Functions</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-6">
        {featurePanels.map((id, idx) => (
          <div key={id} className="flex flex-col w-full">
            <label className="text-md text-white font-medium mb-2 text-left">{`${idx + 1}. ${capitalizeFirstWord(id.replace(/([A-Z])/g, ' $1')).replace('360', '360°')}`}</label>
            <div className="flex justify-center items-center gap-18">
              <ToggleButton
                checked={toggleStates[id]?.available || false}
                onChange={() => handleToggleChange(id, 'available')}
                label="Available"
              />
              <ToggleButton
                checked={toggleStates[id]?.issueObserved || false}
                onChange={() => handleToggleChange(id, 'issueObserved')}
                label="Issue Observed"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesFunctions;
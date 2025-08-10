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

const FeaturesFunctions = ({ featurePanels, setFeaturePanels }) => {
  const panels = [
    'feature_parking_sensors_front', 'feature_parking_sensors_rear', 'feature_front_view_camera', 'feature_rear_view_camera',
    'feature_camera_360', 'feature_touch_screen', 'feature_speakers', 'feature_electric_orvm', 'feature_auto_dimming_irvm',
    'feature_ventilated_seat_driver', 'feature_ventilated_seat_codriver', '  feature_ventilated_seat_rear'
  ];

  const [toggleStates, setToggleStates] = useState(
    panels.reduce((acc, id) => {
      acc[id] = { available: false, issueObserved: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    console.log('Component mounted');
    console.log('Props received:', { featuresFunctionsDetails, setFeaturesFunctionsDetails });
    console.log('Initial toggleStates:', toggleStates);

    if (typeof setFeaturesFunctionsDetails === 'function') {
      setFeaturesFunctionsDetails(toggleStates);
      setFeaturePanels();
      console.log('Initial state synced to parent.');
    } else {
      console.error('setFeaturesFunctionsDetails is not a function');
    }
  }, []); // Run once on mount

  const handleToggleChange = (id, type) => {
    setToggleStates(prev => {
      const newState = {
        ...prev,
        [id]: {
          ...prev[id],
          [type]: !prev[id][type]
        }
      };
      console.log(`Toggle changed for ${id} - ${type}:`, newState[id][type]);
      if (typeof setFeaturesFunctionsDetails === 'function') {
        setFeaturesFunctionsDetails(newState);
        console.log('State synced to parent:', newState);
      } else {
        console.error('setFeaturesFunctionsDetails is not a function');
      }
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

  console.log('Rendering with toggleStates:', toggleStates);

  if (!toggleStates || Object.keys(toggleStates).length === 0) {
    return <div className="text-white">Loading features and functions data...</div>;
  }

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Features & Functions</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-6">
        {panels.map((id, idx) => (
          <div key={id} className="flex flex-col w-full">
            <label className="text-md text-white font-medium mb-2 text-left">{`${idx + 1}. ${capitalizeFirstWord(id.replace(/([A-Z])/g, ' $1')).replace('360', '360°')}`}</label>
            <div className="flex justify-center items-center gap-18">
              <ToggleButton
                checked={featurePanels[id]?.available || false}
                onChange={() => handleToggleChange(id, 'available')}
                label="Available"
              />
              <ToggleButton
                checked={featurePanels[id]?.issueObserved || false}
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
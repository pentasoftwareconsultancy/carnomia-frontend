import React, { useState, useEffect } from 'react';

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

const LiveParameters = () => {
  const [engineLoadEnabled, setEngineLoadEnabled] = useState(false);
  const [idleRPMEnabled, setIdleRPMEnabled] = useState(false);
  const [engineLoad, setEngineLoad] = useState('');
  const [idleRPM, setIdleRPM] = useState('');
  const [batteryVoltage, setBatteryVoltage] = useState('');
  const [distanceSinceCodeClear, setDistanceSinceCodeClear] = useState('');
  const [distanceCurrentBlock, setDistanceCurrentBlock] = useState('');

  const capitalizeFirstWord = (str) => {
    if (!str) return str;
    const words = str.trim().split(' ');
    if (words.length === 0) return str;
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  const parameters = [
    {
      id: 'engineLoad',
      label: 'Engine Load',
      enabled: engineLoadEnabled,
      setEnabled: setEngineLoadEnabled,
      value: engineLoad,
      setValue: setEngineLoad,
      allowDecimal: true,
    },
    {
      id: 'idleRPM',
      label: 'Idle RPM',
      enabled: idleRPMEnabled,
      setEnabled: setIdleRPMEnabled,
      value: idleRPM,
      setValue: setIdleRPM,
      allowDecimal: false,
    },
    {
      id: 'batteryVoltage',
      label: 'Battery Voltage',
      value: batteryVoltage,
      setValue: setBatteryVoltage,
      allowDecimal: true,
    },
    {
      id: 'distanceSinceCodeClear',
      label: 'Distance Since Code Clear',
      value: distanceSinceCodeClear,
      setValue: setDistanceSinceCodeClear,
      allowDecimal: true,
    },
    {
      id: 'distanceCurrentBlock',
      label: 'Distance In Current Lock Block',
      value: distanceCurrentBlock,
      setValue: setDistanceCurrentBlock,
      allowDecimal: true,
    },
  ];

  // Logging all parameter field names and their current values whenever any changes
  useEffect(() => {
    console.log('Live Parameters Updated:');
    parameters.forEach((param) => {
      if (param.enabled !== undefined) {
        console.log(`Toggle: live_${param.id}_toggle, Value:`, param.enabled);
      }
      console.log(`Field: live_${param.id}, Value:`, param.value);
    });
  }, [
    engineLoadEnabled,
    idleRPMEnabled,
    engineLoad,
    idleRPM,
    batteryVoltage,
    distanceSinceCodeClear,
    distanceCurrentBlock,
  ]);

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Live Parameters</h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-6">
        {parameters.map((param, idx) => (
          <div key={param.id} className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-2">
              <label className="text-md text-white font-medium text-left">{`${idx + 1}. ${capitalizeFirstWord(param.label.replace(/([A-Z])/g, ' $1'))}`}</label>
              {param.enabled !== undefined && (
                <ToggleButton
                  checked={param.enabled}
                  onChange={() => param.setEnabled(!param.enabled)}
                />
              )}
            </div>
            {(param.enabled || param.enabled === undefined) && (
              <input
                type="text"
                value={param.value}
                onChange={(e) => {
                  const value = e.target.value;
                  if (param.allowDecimal ? /^\d*\.?\d*$/.test(value) : /^\d*$/.test(value)) {
                    param.setValue(value);
                  }
                }}
                placeholder={`Enter ${param.label}`}
                className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveParameters;
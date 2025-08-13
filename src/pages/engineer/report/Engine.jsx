import React from 'react';

const Engine = ({ data = {}, onChange }) => {
  // Example options for engine issues
  const options = [
    { value: '', label: 'Select engine issue' },
    { value: 'overheating', label: 'Overheating' },
    { value: 'oil_leak', label: 'Oil Leak' },
    { value: 'misfire', label: 'Misfire' },
    { value: 'noise', label: 'Unusual Noise' },
    { value: 'none', label: 'No Issue' },
  ];

  const selectedValue = data.engine_issue || '';

  // Notify parent about dropdown value change
  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange('engine_issue', e.target.value);
    }
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Engine</h2>
      <div className="flex flex-col w-full">
        <select
          value={selectedValue}
          onChange={handleChange}
          className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value} className="text-black">
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Engine;

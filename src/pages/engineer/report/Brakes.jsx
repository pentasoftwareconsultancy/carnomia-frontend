import React from 'react';

const Brakes = ({ data = {}, onChange }) => {
  const options = [
    { value: '', label: 'Select brakes issue' },
    { value: 'worn_pads', label: 'Worn Pads' },
    { value: 'soft_pedal', label: 'Soft Pedal' },
    { value: 'vibration', label: 'Vibration' },
    { value: 'noise', label: 'Noise' },
    { value: 'none', label: 'No Issue' },
  ];

  const selectedValue = data.brakes_issue || '';

  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange('brakes_issue', e.target.value);
    }
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-heading mb-6 sm:mb-8 text-white text-left">Brakes</h2>
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

export default Brakes;

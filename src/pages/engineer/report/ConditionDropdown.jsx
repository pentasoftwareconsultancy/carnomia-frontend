import React from 'react';

const ConditionDropdown = ({ value, onChange, options = ['None', 'Scratch', 'Dent', 'Rust', 'Crack'] }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none"
      style={{ backgroundImage: 'none' }}
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#1a1a1a] text-white">
          {option}
        </option>
      ))}
    </select>
  );
};

export default ConditionDropdown;
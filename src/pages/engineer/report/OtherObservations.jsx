import React from 'react';

const OtherObservations = ({ data = {}, onChange }) => {
  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange('other_observations', e.target.value);
    }
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-heading mb-6 sm:mb-8 text-white text-left">
        Other Observations
      </h2>
      <textarea
        value={data.other_observations || ''}
        onChange={handleChange}
        placeholder="Enter any other observations..."
        className="w-full p-3 border border-white/20 rounded bg-[#ffffff0a] text-white focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
        rows={5}
      />
    </div>
  );
};

export default OtherObservations;

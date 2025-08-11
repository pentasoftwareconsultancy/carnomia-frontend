import React, { useState } from 'react';

const FluidCard = ({ fluidName, withinRange, setWithinRange, contamination, setContamination }) => {
  const handleCheckboxChange = (e, setState) => {
    const scrollY = window.scrollY;
    setState(e.target.checked);
    window.scrollTo(0, scrollY);
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full">
      <h3 className="text-lg sm:text-xl font-medium mb-4 text-white text-left">{fluidName}</h3>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={withinRange}
            onChange={(e) => handleCheckboxChange(e, setWithinRange)}
            className="w-5 h-5 text-lime-500 bg-gray-600 border-white/20 rounded focus:ring-lime-500 focus:ring-2"
          />
          <span className="text-white text-sm">Within Range</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={contamination}
            onChange={(e) => handleCheckboxChange(e, setContamination)}
            className="w-5 h-5 text-lime-500 bg-gray-600 border-white/20 rounded focus:ring-lime-500 focus:ring-2"
          />
          <span className="text-white text-sm">Contamination</span>
        </label>
      </div>
    </div>
  );
};

const FluidLevels = () => {
  const [fluids, setFluids] = useState({
    coolant: { withinRange: false, contamination: false },
    engineOil: { withinRange: false, contamination: false },
    brakeOil: { withinRange: false, contamination: false },
    washerFluid: { withinRange: false, contamination: false },
  });

  const handleCheckboxChange = (fluidKey, field) => (value) => {
    setFluids((prev) => ({
      ...prev,
      [fluidKey]: { ...prev[fluidKey], [field]: value },
    }));
  };

  const fluidData = [
    { id: 'coolant', name: '1. Coolant' },
    { id: 'engineOil', name: '2. Engine Oil' },
    { id: 'brakeOil', name: '3. Brake Oil' },
    { id: 'washerFluid', name: '4. Washer Fluid' },
  ];

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Fluid Levels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6">
        {fluidData.map((fluid) => (
          <FluidCard                                                                                                    
            key={fluid.id}
            fluidName={fluid.name}
            withinRange={fluids[fluid.id].withinRange}
            setWithinRange={handleCheckboxChange(fluid.id, 'withinRange')}
            contamination={fluids[fluid.id].contamination}
            setContamination={handleCheckboxChange(fluid.id, 'contamination')}
          />
        ))}
      </div>
    </div>
  );
};

export default FluidLevels;
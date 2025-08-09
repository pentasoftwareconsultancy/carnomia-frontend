import React, { useState } from 'react';

// Fluid data definitions - can be moved to a separate file
const FLUIDS = [
  { id: 'fluid_coolant', name: '1. Fluid Coolant' },
  { id: 'fluid_engine_oil', name: '2. Fluid Engine Oil' },
  { id: 'fluid_brake_oil', name: '3. Fluid Brake Oil' },
  { id: 'fluid_washer_fluid', name: '4. Fluid Washer Fluid' },
];

// Individual fluid card component with two checkboxes
const FluidCard = ({
  fluidId,
  fluidName,
  withinRange,
  onWithinRangeChange,
  contamination,
  onContaminationChange,
}) => {
  // Handles checkbox change, preserves scroll position, logs event
  const handleCheckboxChange = (event, onChange, label) => {
    const isChecked = event.target.checked;
    const currentScrollY = window.scrollY;

    // Call parent handler
    onChange(isChecked);

    console.log(`[FluidCard] ${fluidName} - ${label} changed to:`, isChecked);

    // Restore scroll to avoid jump on state update
    window.scrollTo(0, currentScrollY);
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full">
      <h3 className="text-lg sm:text-xl font-medium mb-4 text-white text-left">{fluidName}</h3>
      <div className="flex items-center justify-between">
        {/* Within Range Checkbox */}
        <label htmlFor={`${fluidId}-withinRange`} className="flex items-center gap-2 cursor-pointer">
          <input
            id={`${fluidId}-withinRange`}
            type="checkbox"
            checked={withinRange}
            onChange={(e) => handleCheckboxChange(e, onWithinRangeChange, 'Within Range')}
            className="w-5 h-5 text-lime-500 bg-gray-600 border-white/20 rounded focus:ring-lime-500 focus:ring-2"
          />
          <span className="text-white text-sm">Within Range</span>
        </label>

        {/* Contamination Checkbox */}
        <label htmlFor={`${fluidId}-contamination`} className="flex items-center gap-2 cursor-pointer">
          <input
            id={`${fluidId}-contamination`}
            type="checkbox"
            checked={contamination}
            onChange={(e) => handleCheckboxChange(e, onContaminationChange, 'Contamination')}
            className="w-5 h-5 text-lime-500 bg-gray-600 border-white/20 rounded focus:ring-lime-500 focus:ring-2"
          />
          <span className="text-white text-sm">Contamination</span>
        </label>
      </div>
    </div>
  );
};

const FluidLevels = () => {
  // State holds the status of all fluids
  const [fluids, setFluids] = useState({
    fluid_coolant: { withinRange: false, contamination: false },
    fluid_engine_oil: { withinRange: false, contamination: false },
    fluid_brake_oil: { withinRange: false, contamination: false },
    fluid_washer_fluid: { withinRange: false, contamination: false },
  });

  // Update handler called by FluidCard for checkbox changes
  // fluidId = string, field = 'withinRange' | 'contamination'
  const handleFluidStatusChange = (fluidId, field) => (newValue) => {
    setFluids((prev) => {
      const updatedFluid = { ...prev[fluidId], [field]: newValue };
      const newState = { ...prev, [fluidId]: updatedFluid };

      // Log updated state for debugging
      console.log(`[FluidLevels] Updated ${fluidId}:`, updatedFluid);

      // TODO: Add backend API call here to sync changes, e.g.:
      // api.updateFluidStatus(fluidId, field, newValue).catch(console.error);

      return newState;
    });
  };

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-left">Fluid Levels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6">
        {FLUIDS.map(({ id, name }) => (
          <FluidCard
            key={id}
            fluidId={id}
            fluidName={name}
            withinRange={fluids[id].withinRange}
            onWithinRangeChange={handleFluidStatusChange(id, 'withinRange')}
            contamination={fluids[id].contamination}
            onContaminationChange={handleFluidStatusChange(id, 'contamination')}
          />
        ))}
      </div>
    </div>
  );
};

export default FluidLevels;
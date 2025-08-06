import React from 'react';

const VehicleInfo = ({ vehicleInfo }) => (
  <div className="bg-[#ffffff0a] backdrop-blur-[1px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl text-white">
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Vehicle Information</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Object.entries(vehicleInfo).map(([key, value]) => (
        <div key={key} className="flex flex-col animate-fade-in">
          <label className="text-md text-white font-medium capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="mt-2 p-3 bg-transparent text-white border border-green-200 shadow-inner rounded-md">
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VehicleInfo;
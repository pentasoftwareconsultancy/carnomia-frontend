import React, { useState, useEffect, useRef } from "react";

const ToggleButton = ({ checked, onChange, label }) => {
  const handleChange = () => {
    const scrollY = window.scrollY; 
    onChange();
    window.scrollTo(0, scrollY);
  };

  return (
    
    <label className="flex flex-col items-center cursor-pointer">
     {/* checking : {checked.toString()} */}
      <div className="relative">
       
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <div
          className={`w-10 h-5 bg-gray-600 rounded-full shadow-inner ${
            checked ? "bg-lime-500" : ""
          }`}
        >
          <div
            className={`absolute w-5 h-5 bg-white rounded-full shadow -left-1 top-0 transition-transform duration-200 ease-in-out ${
              checked ? "transform translate-x-5" : ""
            }`}
          />
        </div>
      </div>
      {label && <span className="mt-1 text-white text-sm">{label}</span>}
    </label>
  );
};

// resetTrigger: a value (number or string) that changes when parent wants to reset toggles
const FeaturesFunctions = ({ data, onChange, resetTrigger }) => {
  // List of features exactly matching backend schema
  const featurePanels = [
    "feature_parking_sensors_front",
    "feature_parking_sensors_rear",
    "feature_front_view_camera",
    "feature_rear_view_camera",
    "feature_camera_360",
    "feature_touch_screen",
    "feature_speakers",
    "feature_electric_orvm",
    "feature_auto_dimming_irvm",
    "feature_ventilated_seat_driver",
    "feature_ventilated_seat_codriver",
    "feature_ventilated_seat_rear",
  ];

  // Initialize toggle state: available = true by default, issueObserved = false
  const getInitialState = () => {
    const initState = {};
    featurePanels.forEach((key) => {
      initState[key] = {
        available: true,
        issueObserved: false,
      };
    });
    if (data) {
      Object.keys(data).forEach((key) => {
        if (initState[key]) {
          initState[key] = {
            ...initState[key],
            ...data[key],
          };
        }
      });
    }
    return initState;
  };

  const [toggleStates, setToggleStates] = useState(getInitialState);

  // Only reset toggles when resetTrigger changes
  const prevReset = useRef(resetTrigger);
  useEffect(() => {
    if (resetTrigger !== undefined && prevReset.current !== resetTrigger) {
      setToggleStates(getInitialState());
      prevReset.current = resetTrigger;
    }
    // eslint-disable-next-line
  }, [resetTrigger]);

  // Sync with data prop if it changes (but don't reset on every render)
  const prevData = useRef(data);
  useEffect(() => {
    if (data && data !== prevData.current) {
      setToggleStates((prev) => {
        const updated = { ...prev };
        Object.keys(data).forEach((key) => {
          if (updated[key]) {
            updated[key] = {
              ...updated[key],
              ...data[key],
            };
          }
        });

        return updated;
      });

      prevData.current = data;
    }
  }, [data]);

  // Sync changes upwards when toggleStates change
  // useEffect(() => {
  //   if (typeof setFeaturesFunctionsDetails === "function") {
  //     setFeaturesFunctionsDetails(toggleStates);
  //   }
  // }, [toggleStates, setFeaturesFunctionsDetails]);

  // Toggle available or issueObserved state for given feature
  const handleToggleChange = (key, type) => {
    setToggleStates((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [type]: !prev[key][type],
        },
      };
        onChange && onChange(key, updated[key]);

      return updated;
    });
  };

  // Format keys to readable labels
  const formatLabel = (key) =>
    key
      .replace(/^feature_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("360", "360°");

  return (
    <div className="bg-[#ffffff0a] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-heading mb-6 sm:mb-8 text-white text-left">
        Features & Functions
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-6">
        {featurePanels.map((key, idx) => (
          <div key={key} className="flex flex-col w-full">
            <label className="text-md text-white font-medium mb-2 text-left">
              {`${idx + 1}. ${formatLabel(key)}`}
            </label>
            <div className="flex justify-center items-center gap-18">
              <ToggleButton
                checked={!!toggleStates[key]?.available}
                onChange={() => {
                  handleToggleChange(key, "available");
                  if (typeof onChange === "function") onChange(key, "available", toggleStates);
                }}
                label="Available"
              />
              <ToggleButton
                checked={!!toggleStates[key]?.issueObserved}
                onChange={() => {
                  handleToggleChange(key, "issueObserved");
                  if (typeof onChange === "function") onChange(key, "issueObserved", toggleStates);
                }}
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

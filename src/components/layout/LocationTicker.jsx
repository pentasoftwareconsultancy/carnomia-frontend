import React, { useState, useEffect } from "react";
import ApiService from './../../core/services/api.service';
import ServerUrl from "./../../core/constants/serverUrl.constant";
import { toast } from "react-toastify";

export default function LocationTicker() {
  const [cityList, setCityList] = useState([]);

  const fetchCities = async () => {
    try {
      const response = await new ApiService().apiget(ServerUrl.API_GET_LOCATIONS);
      if (response?.data?.locations) {
        setCityList(response.data.locations);
      } else {
        setCityList([]);
      }
    } catch (err) {
      console.error("Failed to fetch Locations", err);
      toast.error("Error fetching cities");
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Repeat the list for the marquee loop effect
  const allLocations = [...cityList, ...cityList];

  return (
    <div className="w-full bg-primary overflow-hidden text-sm text-black py-2">
      <div className="location-marquee whitespace-nowrap flex space-x-6 px-6 animate-marquee">
        {allLocations.map((loc, index) => (
          <span key={index} className="inline-block px-2">
            {loc}
          </span>
        ))}
      </div>
    </div>
  );
}

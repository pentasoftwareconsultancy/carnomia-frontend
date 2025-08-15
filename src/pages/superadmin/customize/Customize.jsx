import React from 'react'
import AddVehicles from './AddVehicles'
import AddLocations from './AddLocations'
import UpdateInspection from './UpdateInspection'

const Customize = () => {
  return (
    <>
      <AddVehicles/>
      <AddLocations/>
      <UpdateInspection/>

    </>
  )
}

export default Customize

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import ApiService from "../../../core/services/api.service";
// import ServerUrl from "../../../core/constants/serverUrl.constant";
// import { toast } from "react-toastify";

// const AddCar = () => {
//   const [carDetails, setCarDetails] = useState({
//     brand: "",
//     model: "",
//     variant: "",
//     transmissionType: "",
//     fuelType: "",
//     BHPs: "",
//     Airbags: "",
//     Mileage: "",
//     NCAP: "",
//     imageUrl: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log("Field changed:", name, value);
//     setCarDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle imageUrl file change
//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     const formData = new FormData();
//     formData.append("documentType", "VEHICLE_IMAGE_FRONT");
//     formData.append("documents", file); // Single imageUrl upload

//     try {
//       const response = await new ApiService().apipost(
//         ServerUrl.API_UPLOAD_IMAGE,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response?.data) {
//         setCarDetails((prev) => ({
//           ...prev,
//           imageUrl: response.data.files[0].fileUrl, // Store the imageUrl URL
//         }));
//         toast.success("Vehicle image uploaded successfully!");
//       } else {
//         toast.error("Failed to upload imageUrl.");
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//       toast.error("Failed to upload imageUrl.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       brand,
//       model,
//       variant,
//       transmissionType,
//       fuelType,
//       BHPs,
//       Airbags,
//       Mileage,
//       NCAP,
//       imageUrl,
//     } = carDetails;

//     if (
//       !brand ||
//       !model ||
//       !variant ||
//       !transmissionType ||
//       !fuelType ||
//       !BHPs ||
//       !Airbags ||
//       !Mileage ||
//       !NCAP ||
//       !imageUrl
//     ) {
//       toast.error("Please fill all fields and upload an imageUrl.");
//       return;
//     }

//     try {
//       const payload = {
//         brand,
//         model,
//         variant,
//         transmissionType,
//         fuelType,
//         BHPs,
//         Airbags,
//         Mileage,
//         NCAP,
//         imageUrl, // Use the imageUrl obtained from image upload
//       };

//       const response = await new ApiService().apipost(
//         ServerUrl.API_ADD_VEHICLE, // Your vehicle addition endpoint
//         payload, // Send the payload as JSON
//         {
//           headers: {
//             "Content-Type": "application/json", // Send as JSON
//           },
//         }
//       );

//       if (response?.data) {
//         toast.success("Car added successfully!");
//         setCarDetails({
//           brand: "",
//           model: "",
//           variant: "",
//           transmissionType: "",
//           fuelType: "",
//           BHPs: "",
//           Airbags: "",
//           Mileage: "",
//           NCAP: "",
//           imageUrl: "", // Reset the imageUrl after submission
//         });
//         document.getElementById("carImage").value = null; // Reset file input
//       } else {
//         toast.error(response?.data?.message || "Something went wrong.");
//       }
//     } catch (error) {
//       console.error("Add car error:", error);
//       toast.error("Failed to add car. Please try again.");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10"
//     >
//       <h2 className="text-2xl font-bold mb-6 text-center">Add New Car</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-body">Brand Name</label>
//           <input
//             type="text"
//             name="brand"
//             value={carDetails.brand}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., Toyota"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Model</label>
//           <input
//             type="text"
//             name="model"
//             value={carDetails.model}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., Innova Crysta"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Variant</label>
//           <input
//             type="text"
//             name="variant"
//             value={carDetails.variant}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., 2.4 GX 7 STR"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Transmission</label>
//           <input
//             type="text"
//             name="transmissionType"
//             value={carDetails.transmissionType}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., Automatic"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Fuel Type</label>
//           <input
//             type="text"
//             name="fuelType"
//             value={carDetails.fuelType}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., Petrol"
//           />
//         </div>
//         <div>
//           <label className="block font-body">BHPs</label>
//           <input
//             type="text"
//             name="BHPs"
//             value={carDetails.BHPs}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., 150"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Airbags</label>
//           <input
//             type="text"
//             name="Airbags"
//             value={carDetails.Airbags}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., 6"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Mileage</label>
//           <input
//             type="text"
//             name="Mileage"
//             value={carDetails.Mileage}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., 15 km/l"
//           />
//         </div>
//         <div>
//           <label className="block font-body">NCAP</label>
//           <input
//             type="text"
//             name="NCAP"
//             value={carDetails.NCAP}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             placeholder="e.g., 5 stars"
//           />
//         </div>
//         <div>
//           <label className="block font-body">Upload Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             id="carImage"
//             onChange={handleImageChange}
//             className="w-full"
//           />
//         </div>
//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Add Car
//           </button>
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export default AddCar;


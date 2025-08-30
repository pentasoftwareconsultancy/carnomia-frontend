// import React, { useState, useEffect } from "react";
// import Car from "../../assets/Car.png";
// import TermsPopup from "../../components/common/TermsPopup";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ServerUrl from "../../core/constants/serverUrl.constant";
// import ApiService from "../../core/services/api.service";

// const Signup = () => {
//   const [form, setForm] = useState({ name: "", email: "", city: "", mobile: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showTerms, setShowTerms] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const navigate = useNavigate();

//   // ✅ State for fetched city list
//   const [cityList, setCityList] = useState([]);

//   // Fetch cities from backend
//   const fetchCities = async () => {
//     try {
//       const response = await new ApiService().apiget(
//         ServerUrl.API_GET_LOCATIONS
//       );
//       if (response?.data?.locations) {
//         setCityList(response.data.locations);
//       } else {
//         setCityList([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch Locations", err);
//       toast.error("Error fetching cities");
//     }
//   };

//   // ✅ Fetch cities on mount
//   useEffect(() => {
//     fetchCities();
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = showTerms ? "hidden" : "auto";
//   }, [showTerms]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "mobile") {
//       const digits = value.replace(/\D/g, "");
//       if (digits.length <= 10) setForm((prev) => ({ ...prev, [name]: digits }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateForm = () => {
//     let valid = true;
//     let newErrors = {};

//     if (!/^[6-9]\d{9}$/.test(form.mobile)) {
//       newErrors.mobile = "Enter a valid Indian mobile number";
//       valid = false;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Enter a valid email";
//       valid = false;
//     }
//     if (!agreed) {
//       newErrors.agreed = "You must agree to the terms & conditions";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       await new ApiService().apipost(ServerUrl.API_REGISTER, {...form, role:"customer"});
//       toast.success("Signup successful. Redirecting...");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-primary px-2 py-6 sm:px-4 sm:py-10">
//       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
//         {/* Left: Info & Image */}
//         <div className="order-1 md:order-1 text-center md:text-left px-2 sm:px-6 flex flex-col items-center md:items-start">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug">
//             We Inspect Before You Invest!, <br />
//             <span className="text-button">Certified insights for your next car.!</span>
//           </h1>
//           <p className="mt-2 text-lg sm:text-xl font-body">Go Beyond Checklists!</p>
//           <p className="text-gray-600 text-xs sm:text-sm">
//             Beyond Visual Assessment | 3700+ Sensing Areas
//           </p>
//           <img
//             src={Car}
//             alt="Car"
//             className="mt-4 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mx-auto md:mx-0"
//           />
//         </div>

//         {/* Right: Signup Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="order-2 md:order-2 space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md bg-white p-4 sm:p-6 rounded-2xl shadow-md mx-auto"
//         >
//           <h2 className="text-2xl sm:text-3xl font-bold text-button text-center">Signup</h2>

//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             className="w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//             className={`w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm ${errors.email ? "border-red-500" : ""}`}
//           />
//           {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

//           <input
//             type="tel"
//             name="mobile"
//             placeholder="Mobile"
//             value={form.mobile}
//             onChange={handleChange}
//             required
//             className={`w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm ${errors.mobile ? "border-red-500" : ""}`}
//           />
//           {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}

//           <select
//             name="city"
//             onChange={handleChange}
//             required
//             className="w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm"
//             value={form.city}
//           >
//             <option value="">Select City</option>
//             {cityList.map((city, index) => (
//               <option key={index} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm"
//           />

//           {/* Terms Checkbox */}
//           <div className="flex items-start space-x-2">
//             <input
//               type="checkbox"
//               id="agree"
//               checked={agreed}
//               onChange={() => setAgreed(!agreed)}
//               className="mt-1"
//             />
//             <label htmlFor="agree" className="text-xs sm:text-sm text-gray-600">
//               I agree to the{" "}
//               <button
//                 type="button"
//                 onClick={() => setShowTerms(true)}
//                 className="font-body text-black underline"
//               >
//                 Terms & Conditions
//               </button>
//             </label>
//           </div>
//           {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}

//           <button
//             type="submit"
//             className="w-full bg-button text-white font-body py-2 rounded hover:bg-green-600 text-base sm:text-lg"
//           >
//             {loading ? "Processing..." : "Proceed"}
//           </button>

//           <p className="text-center text-xs sm:text-sm">
//             Already Signed up?{" "}
//             <Link to="/login" className="text-button font-medium">Login</Link>
//           </p>
//         </form>

//         {showTerms && (
//           <TermsPopup
//             onClose={() => setShowTerms(false)}
//             onAgree={() => setShowTerms(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState, useEffect } from "react";
import Car from "../../assets/Car.png";
import TermsPopup from "../../components/common/TermsPopup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ServerUrl from "../../core/constants/serverUrl.constant";
import ApiService from "../../core/services/api.service";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ State for fetched city list
  const [cityList, setCityList] = useState([]);

  // Fetch cities from backend
  const fetchCities = async () => {
    try {
      const response = await new ApiService().apiget(
        ServerUrl.API_GET_LOCATIONS
      );
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

  // ✅ Fetch cities on mount
  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showTerms ? "hidden" : "auto";
  }, [showTerms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 10) setForm((prev) => ({ ...prev, [name]: digits }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid Indian mobile number";
      valid = false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    // Password validation
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        form.password
      )
    ) {
      newErrors.password =
        "Password must be at least 6 chars, include uppercase, lowercase, number & special char";
      valid = false;
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    // Terms agreement
    if (!agreed) {
      newErrors.agreed = "You must agree to the terms & conditions";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await new ApiService().apipost(ServerUrl.API_REGISTER, {
        ...form,
        role: "customer",
      });
      toast.success("Signup successful. Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary px-2 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Left: Info & Image */}
        <div className="order-1 md:order-1 text-center md:text-left px-2 sm:px-6 flex flex-col items-center md:items-start">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug">
            We Inspect Before You Invest!, <br />
            <span className="text-button">
              Certified insights for your next car.!
            </span>
          </h1>
          <p className="mt-2 text-lg sm:text-xl font-body">
            Go Beyond Checklists!
          </p>
          <p className="text-gray-600 text-xs sm:text-sm">
            Beyond Visual Assessment | 3700+ Sensing Areas
          </p>
          <img
            src={Car}
            alt="Car"
            className="mt-4 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mx-auto md:mx-0"
          />
        </div>

        {/* Right: Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="order-2 md:order-2 space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md bg-white p-4 sm:p-6 rounded-2xl shadow-md mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-button text-center">
            Signup
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={`w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            required
            className={`w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm ${
              errors.mobile ? "border-red-500" : ""
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-xs">{errors.mobile}</p>
          )}

          <select
            name="city"
            onChange={handleChange}
            required
            className="w-full mb-2 p-3 border rounded-lg border-gray-300 text-sm"
            value={form.city}
          >
            <option value="">Select City</option>
            {cityList.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Password */}
          <div className="relative w-full mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg border-gray-300 text-sm ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="relative w-full mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg border-gray-300 text-sm ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-xs sm:text-sm text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="font-body text-black underline"
              >
                Terms & Conditions
              </button>
            </label>
          </div>
          {errors.agreed && (
            <p className="text-red-500 text-xs">{errors.agreed}</p>
          )}

          <button
            type="submit"
            className="w-full bg-button text-white font-body py-2 rounded hover:bg-green-600 text-base sm:text-lg"
          >
            {loading ? "Processing..." : "Proceed"}
          </button>

          <p className="text-center text-xs sm:text-sm">
            Already Signed up?{" "}
            <Link to="/login" className="text-button font-medium">
              Login
            </Link>
          </p>
        </form>

        {showTerms && (
          <TermsPopup
            onClose={() => setShowTerms(false)}
            onAgree={() => setShowTerms(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Signup;

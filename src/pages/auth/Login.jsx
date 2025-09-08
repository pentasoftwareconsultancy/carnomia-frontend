// import React, { useState, useEffect } from "react";
// import { AnimatePresence } from "framer-motion";
// import Car from "../../assets/Car.png";
// import TermsPopup from "../../components/common/TermsPopup";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../../utils/axios";
// import { useAuth } from "../../core/contexts/AuthContext"; // Updated import path
// import { toast } from "react-toastify";
// import ServerUrl from "../../core/constants/serverUrl.constant"; 
// import ApiService from "../../core/services/api.service";

// export default function Login() {
//   const [stage, setStage] = useState("login"); // login, password, verify
//   const [inputValue, setInputValue] = useState(""); // mobile or email input
//   const [password, setPassword] = useState(""); // password input
//   const [otp, setOtp] = useState(""); // OTP input
//   const [identifier, setIdentifier] = useState(""); // To store mobile or email identifier
//   const [showTerms, setShowTerms] = useState(false); // Terms & conditions popup state
//   const [otpSent, setOtpSent] = useState(false); // OTP sent state
//   const [timer, setTimer] = useState(0); // Timer for OTP resend
//   const navigate = useNavigate();
//   const { login } = useAuth(); // Login context hook

// useEffect(() => {
//   if (stage === "verify") {
//     const stored = localStorage.getItem("login_identifier");
//     if (stored) {
//       setIdentifier(stored);
//     } else {
//       setStage((prevStage) => (prevStage === "verify" ? "login" : prevStage));
//     }
//   }
// }, [stage]);


//   useEffect(() => {
//     let interval;
//     if (stage === "verify" && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [stage, timer]);

//   const isEmail = inputValue.includes("@");
//   const isDrivestaEmail = isEmail && inputValue.endsWith("@carnomia.com");
//   const isMobile = /^[6-9]\d{9}$/.test(inputValue.trim());

//   const roleRedirectMap = {
//     admin: "/admin/dashboard",
//     superadmin: "/superadmin/dashboard",
//     engineer: "/engineer/dashboard/assigned",
//     customer: "/",
//   };

//   const handleProceed = async () => {
//     const trimmed = inputValue.trim();

//     if (!trimmed) return toast.error("Please enter mobile number or email");

//     if (isDrivestaEmail) {
//       setStage("password");
//       return;
//     }

//     if (isMobile) {
//       try {
//         await new ApiService().apipost(ServerUrl.API_LOGIN, { mobile: trimmed });
//         localStorage.setItem("login_identifier", trimmed);
//         setIdentifier(trimmed);
//         setOtpSent(true);
//         setTimer(30);
//         setStage("verify");
//         toast.success("OTP sent to your mobile");
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Login failed");
//       }
//     } else {
//       toast.error("Please login with your mobile number");
//     }
//   };

//   const handlePasswordLogin = async () => {
//     try {
//       const response = await new ApiService().apipost(ServerUrl.API_LOGIN, {
//         email: inputValue.trim(),
//         password,
//       });

//       const {user, token} = response.data;
//       login({user, token});

//       toast.success(`Welcome back, ${user?.name || "User"}!`);

//       const redirectTo = roleRedirectMap[user?.role] || "/";
//       console.log(redirectTo)
//       navigate(redirectTo, { replace: true });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp) return toast.error("Please enter the OTP");

//     try {
//       const response = await new ApiService().apipost(ServerUrl.API_VERIFY_OTP, {
//         mobile:identifier,
//         otp,
//       });

//      const {user, token} = response.data;
//       login({user, token});

//       toast.success(`Welcome, ${user?.name || "User"}!`);

//       const redirectTo = roleRedirectMap[user?.role] || "/";
//       navigate(redirectTo, { replace: true });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "OTP verification failed");
//     }
//   };
   
//   return (
//     <>
//     <div className="flex flex-col lg:flex-row min-h-screen bg-primary items-center justify-center">
//       <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10">
//         <h1 className="text-3xl font-extrabold text-black mb-2">
//           We Inspect Before You Invest!
//         </h1>
//         <h2 className="text-2xl text-button font-bold mb-4">
//           Unlock the Unseen with Tech!
//         </h2>
//         <p className="text-gray-700 leading-relaxed">
//          Forensic checks | 3300+ Check points | Detailed Report<br />
//           The smarter way to buy a car. <span className="font-bold text-sm font-black">Pay Only After PDI</span>
//         </p>
//         <img
//           src={Car}
//           alt="car"
//           className="w-full h-auto max-h-[400px] object-contain"
//         />
//       </div>

//       <div className="w-full lg:w-1/2 px-4 py-10 flex justify-center items-center">
//         <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
//           {stage === "login" && (
//             <>
//               <h3 className="text-2xl font-bold text-button mb-2">Log in</h3>
//               {/* Form for login */}
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleProceed();
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Mobile Number"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   className="w-full mb-2 p-3 border rounded-lg border-gray-300"
//                 />
//                 <button
//                   type="submit"
//                   className="w-full bg-button text-white py-2.5 rounded-lg hover:bg-green-600"
//                 >
//                   Proceed
//                 </button>
//               </form>
//               <p className="text-center text-sm mt-6">
//                 Haven't created an account?{" "}
//                 <Link
//                   to="/signup"
//                   className="text-button font-body hover:underline"
//                 >
//                   Signup
//                 </Link>
//               </p>
//               <p className="text-xs text-center text-gray-600 mt-6">
//                 By signing in, you agree to our{" "}
//                 <button
//                   onClick={() => setShowTerms(true)}
//                   className="font-body underline"
//                 >
//                   Terms & Conditions
//                 </button>
//               </p>
//             </>
//           )}

//           {stage === "password" && (
//             <>
//               <h3 className="text-2xl font-bold text-button mb-2">
//                 Enter Password
//               </h3>
//               {/* Form for password login */}
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handlePasswordLogin();
//                 }}
//               >
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full mb-2 p-3 border rounded-lg border-gray-300"
//                 />
//                 <button
//                   type="submit"
//                   className="w-full bg-button text-white py-2.5 rounded-lg hover:bg-green-600"
//                 >
//                   Login
//                 </button>
//               </form>
//               <p className="text-center text-sm mt-6">
//                 <button
//                   onClick={() => {
//                     setStage("login");
//                     setPassword("");
//                   }}
//                   className="text-button font-body hover:underline"
//                 >
//                   ← Back
//                 </button>
//               </p>
//             </>
//           )}

//           {stage === "verify" && (
//             <>
//               <h3 className="text-2xl font-bold text-button mb-2">
//                 Verify OTP
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 OTP sent to{" "}
//                 <span className="font-body text-black">{identifier}</span>
//               </p>
//               {/* Form for OTP verification */}
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleVerifyOtp();
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   className="w-full mb-2 p-3 border rounded-lg border-gray-300"
//                 />
//                 {otpSent && timer > 0 && (
//                   <p className="text-sm text-gray-600 mb-2">
//                     Resend OTP in <span className="font-body">{timer}s</span>
//                   </p>
//                 )}
//                 {otpSent && timer === 0 && (
//                   <button
//                     type="button"
//                     onClick={handleProceed}
//                     className="text-sm text-button mb-2 underline"
//                   >
//                     Resend OTP
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   className="w-full bg-button text-white py-2.5 rounded-lg hover:bg-green-600"
//                 >
//                   Verify & Login
//                 </button>
//               </form>
//               <p className="text-center text-sm mt-6">
//                 <button
//                   onClick={() => {
//                     setStage("login");
//                     setOtp("");
//                   }}
//                   className="text-button font-body hover:underline"
//                 >
//                   ← Back to Login
//                 </button>
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>

//     <AnimatePresence>
//       {showTerms && (
//         <TermsPopup
//           onClose={() => setShowTerms(false)}
//           onAgree={() => setShowTerms(false)}
//         />
//       )}
//     </AnimatePresence>
//   </>

//   );
// }

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Car from "../../assets/Car.png";
import TermsPopup from "../../components/common/TermsPopup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";
import { toast } from "react-toastify";
import ServerUrl from "../../core/constants/serverUrl.constant"; 
import ApiService from "../../core/services/api.service";

export default function Login() {
  const [stage, setStage] = useState("login"); // login, password
  const [inputValue, setInputValue] = useState(""); // mobile or email input
  const [password, setPassword] = useState(""); // password input
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const isEmail = inputValue.includes("@");
  const isCarnomiaEmail = isEmail && inputValue.endsWith("@carnomia.com");
  const isMobile = /^[6-9]\d{9}$/.test(inputValue.trim());

  const roleRedirectMap = {
    admin: "/admin/dashboard",
    superadmin: "/superadmin/dashboard",
    engineer: "/engineer/dashboard/assigned",
    customer: "/",
  };

  const handleProceed = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return toast.error("Please enter mobile number or email");

    // Admin/engineer/superadmin (carnomia.com) emails
    if (isCarnomiaEmail) {
      setStage("password");
      return;
    }

    // ✅ Customers: allow both mobile & any email with password
    if (isMobile || isEmail) {
      setStage("password");
      return;
    }

    toast.error("Please enter a valid mobile number or email");
  };

  const handlePasswordLogin = async () => {
    try {
      const payload = {};
      if (isEmail) {
        payload.email = inputValue.trim();
      } else if (isMobile) {
        payload.mobile = inputValue.trim();
      }
      payload.password = password;

      const response = await new ApiService().apipost(ServerUrl.API_LOGIN, payload);
      console.log("Login API Response:", response);

      const { user, token } = response.data;
      login({ user, token });

      console.log("Logged in user:", user);

      toast.success(`Welcome back, ${user?.name || "User"}!`);
      const redirectTo = roleRedirectMap[user?.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-primary items-center justify-center">
        {/* Left content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10">
          <h1 className="text-3xl font-extrabold text-black mb-2">
            We Inspect Before You Invest!
          </h1>
          <h2 className="text-2xl text-button font-bold mb-4">
            Unlock the Unseen with Tech!
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Forensic checks | 3300+ Check points | Detailed Report<br />
            The smarter way to buy a car.{" "}
            <span className="font-bold text-sm font-black">Pay Only After PDI</span>
          </p>
          <img
            src={Car}
            alt="car"
            className="w-full h-auto max-h-[400px] object-contain"
          />
        </div>

        {/* Right login box */}
        <div className="w-full lg:w-1/2 px-4 py-10 flex justify-center items-center">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
            {stage === "login" && (
              <>
                <h3 className="text-2xl font-bold text-button mb-2">Log in</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProceed();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Mobile Number or Email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full mb-2 p-3 border rounded-lg border-gray-300"
                  />
                  <button
                    type="submit"
                    className="w-full bg-button text-white py-2.5 rounded-lg hover:bg-green-600"
                  >
                    Proceed
                  </button>
                </form>
                <p className="text-center text-sm mt-6">
                  Haven't created an account?{" "}
                  <Link
                    to="/signup"
                    className="text-button font-body hover:underline"
                  >
                    Signup
                  </Link>
                </p>
                <p className="text-xs text-center text-gray-600 mt-6">
                  By signing in, you agree to our{" "}
                  <button
                    onClick={() => setShowTerms(true)}
                    className="font-body underline"
                  >
                    Terms & Conditions
                  </button>
                </p>
              </>
            )}

            {stage === "password" && (
              <>
                <h3 className="text-2xl font-bold text-button mb-2">
                  Enter Password
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordLogin();
                  }}
                >
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-3 border rounded-lg border-gray-300"
                  />
                  <button
                    type="submit"
                    className="w-full bg-button text-white py-2.5 rounded-lg hover:bg-green-600"
                  >
                    Login
                  </button>
                </form>
                <p className="text-center text-sm mt-6">
                  <button
                    onClick={() => {
                      setStage("login");
                      setPassword("");
                    }}
                    className="text-button font-body hover:underline"
                  >
                    ← Back
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTerms && (
          <TermsPopup
            onClose={() => setShowTerms(false)}
            onAgree={() => setShowTerms(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

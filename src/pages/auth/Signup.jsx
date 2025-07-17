import React, { useState, useEffect } from "react";
import Car from "../../assets/Car.png";
import TermsPopup from "../../components/common/TermsPopup";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", city: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false); // ⬅️ Checkbox state
  const navigate = useNavigate();

  const locations = [
    "Pune", "Kothrud", "Hadapsar", "Viman Nagar", "Baner",
    "Wakad", "Hinjewadi", "Pimple Saudagar", "Kharadi",
    "Magarpatta", "Aundh", "Deccan", "Swargate"
  ];

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

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid Indian mobile number";
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }
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
      await axios.post("/auth/register", form);
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F1FFE0] px-4 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left px-2 sm:px-6">
          <h1 className="text-3xl font-extrabold leading-snug">
            We Inspect Before You Invest!, <br />
            <span className="text-green-500">Certified insights for your next car.!</span>
          </h1>
          <p className="mt-2 text-xl font-semibold">Go Beyond Checklists!</p>
          <p className="text-gray-600 text-sm">
            Beyond Visual Assessment | 3700+ Sensing Areas
          </p>
          <img src={Car} alt="Car" className="mt-2 max-w-[500px] mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md bg-[#f9fcf4] p-6 rounded-2xl shadow-md mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center">Signup</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={`w-full border rounded px-4 py-2 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            required
            className={`w-full border rounded px-4 py-2 ${errors.mobile ? "border-red-500" : ""}`}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

          <select
            name="city"
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option>Select City</option>
            {locations.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="font-semibold text-black underline"
              >
                Terms & Conditions
              </button>
            </label>
          </div>
          {errors.agreed && <p className="text-red-500 text-sm">{errors.agreed}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600"
          >
            {loading ? "Processing..." : "Proceed"}
          </button>

          <p className="text-center text-sm">
            Already Signed up?{" "}
            <Link to="/login" className="text-green-600 font-medium">Login</Link>
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
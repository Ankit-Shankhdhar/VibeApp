import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return "All fields are required";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    if (!form.email.includes("@")) {
      return "Invalid email address";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser(form);
      if (res.data.token) {
        login(res.data.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EAF6C3] flex items-center justify-center relative overflow-hidden font-['Inter',_sans-serif]">

      {/* Soft outer glow */}
      <div className="absolute inset-0 opacity-40 blur-3xl"></div>

      {/* Main Container matching Login.tsx layout */}
      <div className="flex w-full max-w-[1600px] items-center justify-center gap-10 lg:gap-16 xl:gap-24 px-6 lg:px-12 relative z-10">

        {/* LEFT CARD */}
        <div className="bg-white rounded-[45px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-12 lg:p-16 w-full max-w-[550px] shrink-0">

          <h2 className="text-4xl font-semibold text-center mb-10 text-[#0b1c2d]">
            Create account
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-500 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USERNAME */}
            <div className="flex items-center bg-[#f7fbfb] border border-[#38c2b7] rounded-2xl px-5 py-4 focus-within:shadow-[0_0_0_3px_rgba(56,194,183,0.15)] transition">
              <svg
                className="w-6 h-6 text-[#38c2b7] mr-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>

              <input
                type="text"
                name="username"
                placeholder="Username"
                className="bg-transparent w-full outline-none text-[#0b1c2d] text-lg"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="flex items-center bg-[#f7fbfb] border border-[#38c2b7] rounded-2xl px-5 py-4 focus-within:shadow-[0_0_0_3px_rgba(56,194,183,0.15)] transition">
              <svg
                className="w-6 h-6 text-[#38c2b7] mr-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-transparent w-full outline-none text-[#0b1c2d] text-lg"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center bg-[#f2f4f5] border border-transparent rounded-2xl px-5 py-4 focus-within:border-gray-300 focus-within:bg-white transition">
              <svg
                className="w-6 h-6 text-gray-400 mr-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 15v2" />
                <path d="M6 10V7a6 6 0 1112 0v3" />
                <rect x="3" y="10" width="18" height="11" rx="2" />
              </svg>

              <input
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)"
                className="bg-transparent w-full outline-none text-[#0b1c2d] text-lg"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex items-center bg-[#f2f4f5] border border-transparent rounded-2xl px-5 py-4 focus-within:border-gray-300 focus-within:bg-white transition">
              <svg
                className="w-6 h-6 text-gray-400 mr-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className="bg-transparent w-full outline-none text-[#0b1c2d] text-lg"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-6 bg-[#0b1c2d] text-white text-lg rounded-2xl font-semibold hover:bg-[#102a47] transition"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="text-center mt-6 text-base text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#0b1c2d] font-semibold underline"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="hidden lg:flex w-full max-w-[950px] justify-center items-center">
          <img
            src="/login-illustration.png"
            alt="Register Illustration"
            className="w-full h-auto object-contain mix-blend-darken"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
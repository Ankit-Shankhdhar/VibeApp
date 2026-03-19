import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { FaApple, FaTwitter, FaFacebookF, FaGoogle } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await loginUser(form);
      login(res.data.token);
      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.status === 403 || error.response?.status === 401
          ? "Invalid email or password."
          : "Cannot connect to server."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EAF6C3] flex items-center justify-center relative overflow-hidden">

      {/* Soft outer glow */}
      <div className="absolute inset-0 opacity-40 blur-3xl"></div>

      {/* Increased wrapper from max-w-[1400px] to max-w-[1600px] to give them room to grow */}
      <div className="flex w-full max-w-[1600px] items-center justify-center gap-10 lg:gap-16 xl:gap-24 px-6 lg:px-12 relative z-10">

        {/* LEFT CARD */}
        {/* Increased from max-w-[480px] to max-w-[550px] and increased padding */}
        <div className="bg-white rounded-[45px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-12 lg:p-16 w-full max-w-[550px] shrink-0">

          <h2 className="text-4xl font-semibold text-center mb-10 text-[#0b1c2d]">
            Login
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-500 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
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
                type="email"
                placeholder="Petter@gmail.com"
                className="bg-transparent w-full outline-none text-[#0b1c2d] text-lg"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
                placeholder="Password"
                className="bg-transparent w-full outline-none text-[#0b1c2d] text-lg"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center space-x-2 text-gray-500">
                <input type="checkbox" className="accent-[#38c2b7] w-4 h-4" />
                <span className="text-base">Remember Password</span>
              </label>

              <a href="#" className="font-medium text-[#0b1c2d] underline text-base">
                Forget Password?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-6 bg-[#0b1c2d] text-white text-lg rounded-2xl font-semibold hover:bg-[#102a47] transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* REGISTER */}
          <div className="text-center mt-6 text-base text-gray-500">
            No account yet?{" "}
            <Link
              to="/register"
              className="text-[#0b1c2d] font-semibold underline"
            >
              Register
            </Link>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        {/* Increased from max-w-[800px] to max-w-[950px] */}
        <div className="hidden lg:flex w-full max-w-[950px] justify-center items-center">
          <img
            src="/login-illustration.png"
            alt="Login Illustration"
            className="w-full h-auto object-contain mix-blend-darken"
          />
        </div>
        
      </div>
    </div>
  );
};

export default Login;
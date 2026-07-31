import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(
        formData.email,
        formData.password
      );

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.user.role === "student") {
        navigate("/student/dashboard");
      } else {
        setError(
          "This dashboard is currently available for students."
        );
      }
    } catch (error) {
      setError(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5] text-2xl font-bold text-white shadow-md">
          P
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
          PathPilot
        </h1>
        <p className="mt-1 text-sm font-medium text-cyan-600">
          Career Learning & Skill Development Ecosystem
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-md md:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">
            Student Sign In
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Access your personalized learning path & progress.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/80 p-4 text-sm text-red-700">
            <svg className="h-5 w-5 shrink-0 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#4F46E5] px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#3730A3] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center space-y-2">
          <p className="text-sm text-[#64748B]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#4F46E5] hover:underline">
              Create Account
            </Link>
          </p>
          <p className="text-xs text-[#64748B]">
            Powered by PathPilot Learning Platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


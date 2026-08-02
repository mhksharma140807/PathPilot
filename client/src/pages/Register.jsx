import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { setStoredToken, setStoredUser } from "../utils/authStorage";

import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from = location.state?.from || "/student/dashboard";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
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

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await registerUser(formData);

      if (response.token && response.user) {
        setStoredToken(response.token);
        setStoredUser(response.user);

        if (response.user.role === "student") {
          toast.success("Account created successfully! Welcome to PathPilot.");
          navigate(from, { replace: true });
        } else {
          toast.success("Account created! Please sign in.");
          navigate("/login", { replace: true });
        }
      } else {
        toast.success("Account created! Please sign in.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      const msg = error.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 rounded-2xl p-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F172A] text-xl font-bold text-white shadow-sm">
            P
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            PathPilot
          </span>
        </Link>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Create your account to start your structured career path
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">
            Create Student Account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in your details below to get started.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#2563EB] px-4 py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#2563EB] hover:underline focus:outline-none focus:ring-1 focus:ring-[#2563EB]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

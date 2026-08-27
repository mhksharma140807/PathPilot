import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { setStoredToken, setStoredUser } from "../utils/authStorage";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from = location.state?.from || "/student/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const response = await loginUser(
        formData.email,
        formData.password
      );

      setStoredToken(response.token);
      setStoredUser(response.user);

      if (response.user.role === "admin") {
        toast.success("Welcome back, Administrator!");
        const fromPath = typeof from === "string" ? from : from?.pathname || "";
        const target = fromPath.startsWith("/admin") ? from : "/admin/dashboard";
        navigate(target, { replace: true });
      } else if (response.user.role === "student") {
        toast.success(`Welcome back, ${response.user.name || "Student"}!`);
        navigate(from, { replace: true });
      } else {
        const msg = "Unauthorized user role.";
        setError(msg);
        toast.error(msg);
      }
    } catch (error) {
      const msg = error.message || "Login failed. Please check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/40 text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased">
      <div className="w-full max-w-6xl rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden grid lg:grid-cols-12 min-h-[640px]">
        {/* LEFT PANEL: Illustration & Feature Highlights (42% width on desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Subtle glow effect */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl p-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-lg shadow-sm group-hover:bg-blue-600 transition">
                P
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                PathPilot
              </span>
            </Link>

            {/* SVG Illustration Element */}
            <div className="my-6 flex justify-center">
              <svg className="w-48 h-48 text-[#2563EB]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#2563EB" fillOpacity="0.1" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M60 140L100 60L140 140L100 120L60 140Z" fill="#2563EB" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
                <circle cx="100" cy="60" r="6" fill="#60A5FA" />
                <circle cx="60" cy="140" r="6" fill="#60A5FA" />
                <circle cx="140" cy="140" r="6" fill="#60A5FA" />
                <path d="M70 100H130" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                <path d="M80 80H120" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Start Your Tech Journey
              </h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Master industry skills, complete real projects, and track your career growth with PathPilot.
              </p>
            </div>

            {/* 3 Feature Rows */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-[10px]">✓</span>
                <span>Personalized Career Roadmaps</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-[10px]">✓</span>
                <span>Interactive Learning Modules</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-[10px]">✓</span>
                <span>Real Project Based Learning</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800 pt-4 mt-6">
            © {new Date().getFullYear()} PathPilot Learning Platform.
          </div>
        </div>

        {/* RIGHT PANEL: Form Card (58% width on desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-white">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Mobile Header Branding */}
            <div className="md:hidden text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-xs">
                  P
                </div>
                <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">PathPilot</span>
              </Link>
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 border border-blue-100/80 px-2 py-0.5 rounded-md inline-block mb-1.5">
                AUTHENTICATION
              </span>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Sign In to PathPilot
              </h1>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Enter your credentials to continue to your dashboard.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="leading-snug">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#2563EB] hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.016 10.016 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-extrabold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In →</span>
                )}
              </button>
            </form>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
              <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Protected Learning Platform</span>
            </div>

            <div className="border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-[#2563EB] hover:underline focus:outline-none focus:ring-1 focus:ring-[#2563EB]">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] font-mono text-slate-400 pt-4">
            PathPilot System Architecture
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

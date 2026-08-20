import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authService";
import { useToast } from "../context/ToastContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await requestPasswordReset(email);

      toast.success(res.message || "Verification code sent to your email.");

      // Navigate to reset password page with email passed in state
      navigate("/reset-password", {
        state: { email: email.toLowerCase().trim() },
      });
    } catch (err) {
      const msg = err.message || "Unable to process request. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/40 text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased">
      <div className="w-full max-w-6xl rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden grid lg:grid-cols-12 min-h-[600px]">
        {/* LEFT PANEL: Branding & Visual */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
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

            <div className="my-8 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-blue-600/10 border border-blue-500/20 text-5xl">
                🔒
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Account Recovery
              </h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Enter your registered email address to receive a secure 6-digit verification code to reset your account password.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800 pt-4 mt-6">
            © {new Date().getFullYear()} PathPilot Ecosystem.
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-white">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="md:hidden text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-xs">
                  P
                </div>
                <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">PathPilot</span>
              </Link>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Forgot Password?
              </h2>
              <p className="mt-1.5 text-xs text-slate-500 font-medium">
                No worries! Enter your email address and we'll send you a 6-digit verification code.
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
                <label htmlFor="reset-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-extrabold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Verification Code →</span>
                )}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-slate-600">
                Remember your password?{" "}
                <Link to="/login" className="font-bold text-[#2563EB] hover:underline focus:outline-none">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-6">
            Powered by PathPilot Ecosystem
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

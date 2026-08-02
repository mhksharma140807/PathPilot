import { Link } from "react-router-dom";
import { getStoredToken } from "../utils/authStorage";

function NotFound() {
  const token = getStoredToken();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-10 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Error 404
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            ← Back to Home
          </Link>

          {token && (
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Go to Dashboard →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotFound;

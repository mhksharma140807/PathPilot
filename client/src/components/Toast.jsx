import React from "react";

export default function Toast({ toast, onClose }) {
  const { message, type } = toast;

  const bgStyles = {
    success: "bg-emerald-900/90 border-emerald-500 text-emerald-100",
    error: "bg-rose-900/90 border-rose-500 text-rose-100",
    info: "bg-slate-900/90 border-indigo-500 text-slate-100",
  };

  const iconMap = {
    success: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in ${
        bgStyles[type] || bgStyles.info
      }`}
    >
      <div className="flex items-center gap-3">
        {iconMap[type] || iconMap.info}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

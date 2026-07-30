import { useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

function CareerCompletion({ career, summary, onExploreProject }) {
  const careerTitle = career?.title || career?.name || "Career Path";
  const completedCount = summary?.completedModules || 0;
  const totalCount = summary?.totalModules || 0;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-lg md:p-8">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-[#10B981]/30">
            <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
            🎉 Career Path Completed!
          </div>

          <h3 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            You completed the {careerTitle} path!
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Congratulations on mastering all curriculum modules! You are now ready to demonstrate your skills with a practical showcase project.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreProject}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3] shadow-md"
            >
              <span>Explore Recommended Project</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            <Link
              to="/my-career"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Switch Career Path
            </Link>
          </div>
        </div>

        {/* Overall Completion Widget */}
        <div className="w-full md:w-64 rounded-2xl bg-slate-800/80 p-5 border border-slate-700/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Career Completion</span>
            <span className="text-base font-extrabold text-[#10B981]">100%</span>
          </div>
          <div className="mt-3">
            <ProgressBar progress={100} />
          </div>
          <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
            <span>Completed: {completedCount} of {totalCount}</span>
            <span>Status: Mastered</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareerCompletion;

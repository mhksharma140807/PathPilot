import { useState } from "react";

function RecommendedProject({ project, careerTitle }) {
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  if (!project) return null;

  return (
    <section id="recommended-project" className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Portfolio & Skill Application
          </span>
          <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Recommended Project for {careerTitle || "Active Path"}
          </h3>
          <p className="text-sm text-[#64748B] mt-1">
            Demonstrate your domain capability by building a showcase-ready portfolio project.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4F46E5] border border-indigo-200/60 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#4F46E5]"></span>
          Recommended
        </span>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-bold text-[#0F172A]">
          {project.title}
        </h4>

        <p className="text-sm leading-relaxed text-[#64748B]">
          {project.description}
        </p>

        {project.skills && project.skills.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Key Relevant Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-[#0F172A] border border-slate-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowIdeaModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
          >
            <span>View Project Idea</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Idea Detail Modal */}
      {showIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                Project Brief
              </span>
              <button
                type="button"
                onClick={() => setShowIdeaModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-[#0F172A]">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                {project.description}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 text-xs text-[#4F46E5] space-y-2">
              <span className="font-bold block text-sm text-[#0F172A]">💡 Showcase Checklist:</span>
              <p>1. Build & test all core feature modules.</p>
              <p>2. Keep code modular with clean git commit logs.</p>
              <p>3. Add visual documentation to your student repository.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowIdeaModal(false)}
                className="rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3730A3]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RecommendedProject;

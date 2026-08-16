import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

function CareerRoadmap({ career, modules, overallProgress }) {
  const navigate = useNavigate();

  if (!career || !modules || modules.length === 0) return null;

  const completedModules = modules.filter((m) => m.status === "completed" || (m.progressPercentage || m.progress || 0) >= 100);
  const currentStageIndex = modules.findIndex((m) => (m.progressPercentage || m.progress || 0) < 100);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 0;
  const currentStageModule = modules[activeIndex] || null;
  const nextMilestoneModule = modules[activeIndex + 1] || null;

  const careerSkills = career.skills || [];
  const skillsGained = completedModules.map((m) => m.title).concat(
    careerSkills.slice(0, Math.min(completedModules.length * 2, careerSkills.length))
  );

  return (
    <div className="space-y-8">
      {/* 1. ROADMAP SUMMARY STATS BAR */}
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Stages</p>
          <p className="text-xl font-extrabold text-[#0F172A] mt-0.5">{modules.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Stages</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{completedModules.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Stage</p>
          <p className="text-xl font-extrabold text-[#2563EB] mt-0.5">Stage 0{activeIndex + 1}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Career Readiness</p>
          <p className="text-xl font-extrabold text-[#0F172A] mt-0.5">{overallProgress}%</p>
        </div>
      </section>

      {/* 2. CURRENT STAGE & NEXT MILESTONE CARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CURRENT STAGE */}
        <section className="rounded-3xl border border-[#2563EB]/40 bg-blue-50/30 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB]">
                Current Active Stage
              </span>
            </div>

            {currentStageModule ? (
              <div className="mt-3 space-y-2">
                <h4 className="text-xl font-extrabold text-[#0F172A]">
                  Stage {activeIndex + 1}: {currentStageModule.title}
                </h4>
                {currentStageModule.description && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {currentStageModule.description}
                  </p>
                )}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Stage Progress</span>
                    <span className="text-[#2563EB]">{currentStageModule.progressPercentage || currentStageModule.progress || 0}%</span>
                  </div>
                  <ProgressBar progress={currentStageModule.progressPercentage || currentStageModule.progress || 0} />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-emerald-700 font-semibold">
                🎉 All roadmap stages fully completed!
              </p>
            )}
          </div>

          {currentStageModule && (
            <div className="mt-5 pt-3">
              <button
                type="button"
                onClick={() => navigate(`/learning-modules/${currentStageModule.moduleId || currentStageModule._id}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
              >
                <span>Continue Active Stage →</span>
              </button>
            </div>
          )}
        </section>

        {/* NEXT MILESTONE */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Next Milestone Goal
              </span>
            </div>

            {nextMilestoneModule ? (
              <div className="mt-3 space-y-2">
                <h4 className="text-lg font-bold text-[#0F172A]">
                  Milestone {activeIndex + 2}: {nextMilestoneModule.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {nextMilestoneModule.description || "Unlocks after completing your current active stage."}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    🔒 Unlocks Next
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <h4 className="text-base font-bold text-[#0F172A]">Final Stage Active</h4>
                <p className="text-xs text-slate-500">You are on the final milestone of this career curriculum track!</p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Milestone Target</span>
            <span className="font-semibold text-slate-700">Stage {activeIndex + 2 <= modules.length ? activeIndex + 2 : modules.length} / {modules.length}</span>
          </div>
        </section>
      </div>

      {/* 3. ROADMAP SEQUENCE TIMELINE */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Curriculum Sequence
            </span>
            <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              Full Career Roadmap Stages
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sequential stages required to build complete domain proficiency.
            </p>
          </div>
        </div>

        <div className="relative space-y-6 before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
          {modules.map((mod, idx) => {
            const prog = mod.progressPercentage || mod.progress || 0;
            const isCompleted = mod.status === "completed" || prog >= 100;
            const isInProgress = mod.status === "in_progress" || (prog > 0 && prog < 100);
            const isLocked = mod.isUnlocked === false;

            const computedStatus = isCompleted ? "completed" : isInProgress ? "in_progress" : isLocked ? "locked" : "available";

            return (
              <div
                key={mod.moduleId || mod._id || idx}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition z-10 ${
                  isInProgress || idx === activeIndex
                    ? "border-[#2563EB] bg-blue-50/40 ring-2 ring-[#2563EB]/15"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50/30"
                    : isLocked
                    ? "border-slate-200 bg-slate-50/50 opacity-75"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm shadow-xs transition ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isInProgress || idx === activeIndex
                        ? "bg-[#2563EB] text-white"
                        : isLocked
                        ? "bg-slate-200 text-slate-400"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    {isCompleted ? "✓" : isLocked ? "🔒" : idx + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-bold text-base ${isLocked ? "text-slate-500" : "text-[#0F172A]"}`}>
                        Stage 0{idx + 1}: {mod.title}
                      </h4>
                      <StatusBadge progress={prog} status={computedStatus} />
                    </div>
                    {mod.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {mod.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:w-48 shrink-0 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Stage Progress</span>
                    <span className="text-[#0F172A]">{prog}%</span>
                  </div>
                  <ProgressBar progress={prog} />

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => navigate(`/learning-modules/${mod.moduleId || mod._id}`)}
                    className={`w-full rounded-xl py-2 px-3 text-xs font-bold transition mt-2 ${
                      isCompleted
                        ? "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
                        : isLocked
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-[#2563EB] text-white hover:bg-blue-700 shadow-xs"
                    }`}
                  >
                    {isCompleted ? "Review Stage" : isInProgress ? "Continue Stage" : isLocked ? "Locked" : "Start Stage"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SKILLS ACQUIRED SUMMARY */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Acquired Skills
        </span>
        <h4 className="text-xl font-extrabold text-[#0F172A] mt-0.5">
          Skills Mastered Across Roadmap ({skillsGained.length})
        </h4>

        {skillsGained.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {skillsGained.map((sk, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200"
              >
                <span>✓</span>
                <span>{sk}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Complete stages to unlock verified domain skills.
          </p>
        )}
      </section>
    </div>
  );
}

export default CareerRoadmap;

import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

function CareerRoadmap({ career, modules, overallProgress }) {
  const navigate = useNavigate();

  if (!career || !modules || modules.length === 0) return null;

  // Derive skills gained from completed modules & career skills list
  const completedModules = modules.filter((m) => m.status === "completed" || (m.progressPercentage || 0) >= 100);
  const nextIncompleteModule = modules.find((m) => (m.progressPercentage || 0) < 100);

  // Extract skills dynamically
  const careerSkills = career.skills || [];
  const skillsGained = completedModules.map((m) => m.title).concat(
    careerSkills.slice(0, Math.min(completedModules.length * 2, careerSkills.length))
  );

  return (
    <div className="space-y-8">
      {/* 1. Roadmap & Stages Visual Section */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              Curriculum Sequence
            </span>
            <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              {career.title || career.name} Career Roadmap
            </h3>
            <p className="text-sm text-[#64748B] mt-1">
              Step-by-step learning stages to achieve 100% career readiness.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-50/70 border border-indigo-100 px-4 py-2.5 rounded-2xl shrink-0">
            <span className="text-xs font-bold text-[#64748B]">Career Readiness:</span>
            <span className="text-lg font-extrabold text-[#4F46E5]">{overallProgress}%</span>
          </div>
        </div>

        {/* Vertical Connected Stage Timeline Tracker */}
        <div className="relative space-y-6 before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200/80">
          {modules.map((mod, idx) => {
            const prog = mod.progressPercentage || 0;
            const isCompleted = mod.status === "completed" || prog >= 100;
            const isInProgress = mod.status === "in_progress" || (prog > 0 && prog < 100);

            // Determine Sequential Locking: First module or previous module completed makes it available
            const isPreviousCompleted = idx === 0 || (modules[idx - 1]?.status === "completed" || (modules[idx - 1]?.progressPercentage || 0) >= 100);
            const isLocked = !isCompleted && !isInProgress && !isPreviousCompleted;

            const computedStatus = isCompleted ? "completed" : isInProgress ? "in_progress" : isLocked ? "locked" : "available";

            return (
              <div
                key={mod.moduleId || mod._id || idx}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition z-10 ${
                  isInProgress
                    ? "border-[#4F46E5]/40 bg-indigo-50/40 ring-2 ring-[#4F46E5]/10"
                    : isCompleted
                    ? "border-emerald-200/80 bg-emerald-50/30"
                    : isLocked
                    ? "border-slate-200/60 bg-slate-50/50 opacity-75"
                    : "border-slate-200/80 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-sm transition ${
                      isCompleted
                        ? "bg-[#10B981] text-white"
                        : isInProgress
                        ? "bg-[#4F46E5] text-white"
                        : isLocked
                        ? "bg-slate-200 text-slate-400"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    {isCompleted ? "✓" : isLocked ? "🔒" : idx + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-bold text-base ${isLocked ? "text-[#64748B]" : "text-[#0F172A]"}`}>
                        Module {idx + 1}: {mod.title}
                      </h4>
                      <StatusBadge progress={prog} status={computedStatus} />
                    </div>
                    {mod.description && (
                      <p className="mt-1 text-xs text-[#64748B] line-clamp-2">
                        {mod.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:w-48 shrink-0 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#64748B]">Progress</span>
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
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60"
                        : "bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-sm"
                    }`}
                  >
                    {isCompleted ? "Review Module" : isInProgress ? "Continue Module" : isLocked ? "Locked" : "Start Module"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Current Focus & Next Focus Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Your Current Focus */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Active Learning
          </span>
          <h4 className="text-xl font-extrabold text-[#0F172A] mt-1">
            Your Current Focus
          </h4>

          {nextIncompleteModule ? (
            <div className="mt-4 space-y-3">
              <p className="font-bold text-[#0F172A] text-base">
                {nextIncompleteModule.title}
              </p>
              {nextIncompleteModule.description && (
                <p className="text-xs text-[#64748B] line-clamp-2">
                  {nextIncompleteModule.description}
                </p>
              )}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#64748B]">Stage Progress</span>
                  <span className="text-[#0F172A]">{nextIncompleteModule.progressPercentage || 0}%</span>
                </div>
                <ProgressBar progress={nextIncompleteModule.progressPercentage || 0} />
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => navigate(`/learning-modules/${nextIncompleteModule.moduleId || nextIncompleteModule._id}`)}
                  className="rounded-xl bg-[#4F46E5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3730A3] shadow-sm"
                >
                  Continue Learning →
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 text-xs font-medium text-emerald-800">
              🎉 All roadmap stages fully completed! You have achieved 100% career readiness.
            </div>
          )}
        </section>

        {/* Skills Gained Section */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
            Skill Acquisition
          </span>
          <h4 className="text-xl font-extrabold text-[#0F172A] mt-1">
            Skills Gained ({skillsGained.length})
          </h4>

          {skillsGained.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {skillsGained.map((sk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60"
                >
                  <span>✓</span>
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-[#64748B]">
              Complete roadmap modules to unlock verified domain skills.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default CareerRoadmap;

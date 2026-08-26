import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

function ModuleCard({ module, index, isCurrent, isUnlocked }) {
  const navigate = useNavigate();

  const progress = Number(module.progress || module.progressPercentage) || 0;
  const moduleId = module._id || module.id || module.moduleId;
  const isCompleted = progress >= 100 || module.status === "completed";
  const isInProgress = (progress > 0 && progress < 100) || module.status === "in_progress";
  const isLocked = isUnlocked === false;

  // Difficulty badge logic (fallback to Intermediate if unspecified)
  const difficulty = module.difficulty || (index % 3 === 0 ? "Beginner" : index % 3 === 1 ? "Intermediate" : "Advanced");
  const difficultyStyles = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
    Advanced: "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20",
  };

  return (
    <article
      className={`group flex flex-col justify-between rounded-3xl border p-6 shadow-xs transition-all duration-300 ${
        isLocked
          ? "border-slate-200 bg-slate-50/60 opacity-80"
          : isCompleted
          ? "border-emerald-200 bg-white hover:-translate-y-1 hover:shadow-lg"
          : isInProgress || isCurrent
          ? "border-blue-300 bg-white ring-2 ring-blue-500/20 hover:-translate-y-1 hover:shadow-lg"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      <div className="space-y-4">
        {/* Top bar: Module Icon, Difficulty Badge, and Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold shadow-xs transition-transform duration-300 ${
                isLocked
                  ? "bg-slate-200 text-slate-400"
                  : isCompleted
                  ? "bg-emerald-600 text-white group-hover:scale-105"
                  : isInProgress || isCurrent
                  ? "bg-[#2563EB] text-white group-hover:scale-105"
                  : "bg-slate-800 text-white group-hover:scale-105"
              }`}
            >
              {isLocked ? (
                <span>🔒</span>
              ) : isCompleted ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>0{index + 1}</span>
              )}
            </div>

            <div>
              <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyStyles[difficulty] || difficultyStyles.Intermediate}`}>
                {difficulty}
              </span>
              <h3 className="mt-1 text-base font-extrabold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
                {module.title || module.name}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isLocked
                ? "bg-slate-100 text-slate-500 border border-slate-200"
                : isCompleted
                ? "bg-emerald-100 text-emerald-800"
                : isInProgress || isCurrent
                ? "bg-blue-100 text-[#2563EB]"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isLocked ? "🔒 Locked" : isCompleted ? "Completed" : isInProgress || isCurrent ? "In Progress" : "Not Started"}
          </span>
        </div>

        {/* Short description */}
        {module.description && (
          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
            {module.description}
          </p>
        )}

        {/* Estimated duration */}
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          <svg className="h-3.5 w-3.5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Est. Duration: ~{module.estimatedHours || 2} {module.estimatedHours === 1 ? 'hour' : 'hours'}</span>
        </div>
      </div>

      {/* Footer: Progress bar and Action button */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Progress</span>
            <span className={isCompleted ? "text-emerald-700" : isInProgress ? "text-[#2563EB]" : "text-slate-600"}>
              {progress}%
            </span>
          </div>

          <ProgressBar progress={progress} />
        </div>

        <button
          type="button"
          disabled={isLocked}
          onClick={() => !isLocked && navigate(`/learning-modules/${moduleId}`)}
          aria-label={`${isLocked ? "Locked" : isCompleted ? "Review" : isInProgress ? "Continue" : "Start"} module ${module.title || module.name}`}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold transition-all duration-200 ${
            isLocked
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              : isCompleted
              ? "bg-slate-100 text-[#0F172A] hover:bg-slate-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
              : isInProgress || isCurrent
              ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          }`}
        >
          <span>{isLocked ? "🔒 Locked" : isCompleted ? "Review Module" : isInProgress ? "Continue Learning" : "Start Module"}</span>
          {!isLocked && <span>→</span>}
        </button>
      </div>
    </article>
  );
}

export default ModuleCard;
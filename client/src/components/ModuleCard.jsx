import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

function ModuleCard({ module, index, isCurrent }) {
  const navigate = useNavigate();

  const progress = Number(module.progress || module.progressPercentage) || 0;
  const moduleId = module._id || module.id || module.moduleId;
  const isCompleted = progress >= 100 || module.status === "completed";
  const isInProgress = (progress > 0 && progress < 100) || module.status === "in_progress";

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isCurrent || isInProgress
          ? "border-[#2563EB] bg-blue-50/20 ring-2 ring-[#2563EB]/20"
          : isCompleted
          ? "border-emerald-200 bg-emerald-50/20"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white shadow-xs ${
                isCompleted
                  ? "bg-emerald-600"
                  : isInProgress || isCurrent
                  ? "bg-[#2563EB]"
                  : "bg-slate-800"
              }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition">
                  {module.title || module.name}
                </h3>
                {(isCurrent || isInProgress) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Active Focus
                  </span>
                )}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Mastered
                  </span>
                )}
              </div>
            </div>
          </div>
          <StatusBadge progress={progress} status={module.status} />
        </div>

        {module.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
            {module.description}
          </p>
        )}

        {module.estimatedHours > 0 && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <svg className="h-3.5 w-3.5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Duration: ~{module.estimatedHours} {module.estimatedHours === 1 ? 'hour' : 'hours'}</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">Progress</span>
          <span className="font-bold text-[#0F172A]">{progress}%</span>
        </div>

        <ProgressBar progress={progress} />

        <button
          type="button"
          onClick={() => navigate(`/learning-modules/${moduleId}`)}
          aria-label={`${isCompleted ? "Review" : isInProgress ? "Continue" : "Start"} module ${module.title || module.name}`}
          className={`mt-5 flex h-10 w-full items-center justify-center rounded-xl px-4 text-xs font-extrabold transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCompleted
              ? "bg-slate-100 text-[#0F172A] hover:bg-slate-200 focus:ring-slate-400"
              : isInProgress || isCurrent
              ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-xs focus:ring-[#2563EB]"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs focus:ring-slate-900"
          }`}
        >
          {isCompleted ? "Review Module" : isInProgress ? "Continue Learning →" : "Start Module →"}
        </button>
      </div>
    </article>
  );
}

export default ModuleCard;
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

function ModuleCard({ module, index, isCurrent }) {
  const navigate = useNavigate();

  const progress = Number(module.progress || module.progressPercentage) || 0;
  const moduleId = module._id || module.id || module.moduleId;
  const isCompleted = progress >= 100 || module.status === "completed";
  const isInProgress = progress > 0 && progress < 100 || module.status === "in_progress";

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isCurrent || isInProgress
          ? "border-[#4F46E5]/40 bg-white ring-2 ring-[#4F46E5]/15"
          : isCompleted
          ? "border-emerald-200/80 bg-white"
          : "border-slate-200/80 bg-white hover:border-slate-300"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ${
                isCompleted
                  ? "bg-[#10B981]"
                  : isInProgress || isCurrent
                  ? "bg-[#4F46E5]"
                  : "bg-slate-800"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition">
                  {module.title || module.name}
                </h3>
                {(isCurrent || isInProgress) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4F46E5] border border-indigo-200/60">
                    Active Focus
                  </span>
                )}
              </div>
            </div>
          </div>
          <StatusBadge progress={progress} status={module.status} />
        </div>

        {module.description && (
          <p className="mt-3 text-sm leading-relaxed text-[#64748B] line-clamp-2">
            {module.description}
          </p>
        )}

        {module.estimatedHours > 0 && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-[#64748B]">
            <svg className="h-3.5 w-3.5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{module.estimatedHours} {module.estimatedHours === 1 ? 'hour' : 'hours'}</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-[#64748B]">Progress</span>
          <span className="font-bold text-[#0F172A]">{progress}%</span>
        </div>

        <ProgressBar progress={progress} />

        <button
          type="button"
          onClick={() => navigate(`/learning-modules/${moduleId}`)}
          className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            isCompleted
              ? "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
              : isInProgress || isCurrent
              ? "bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-md"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
          }`}
        >
          {isCompleted ? "Review Module" : isInProgress ? "Continue Module" : "Start Module"}
        </button>
      </div>
    </article>
  );
}

export default ModuleCard;
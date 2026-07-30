import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

function ModuleCard({ module, index }) {
  const navigate = useNavigate();

  const progress = Number(module.progress || module.progressPercentage) || 0;
  const moduleId = module._id || module.id || module.moduleId;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-sm">
              {index + 1}
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-slate-800 transition">
              {module.title || module.name}
            </h3>
          </div>
          <StatusBadge progress={progress} status={module.status} />
        </div>

        {module.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {module.description}
          </p>
        )}

        {module.estimatedHours > 0 && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{module.estimatedHours} {module.estimatedHours === 1 ? 'hour' : 'hours'}</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">Progress</span>
          <span className="font-bold text-slate-900">{progress}%</span>
        </div>

        <ProgressBar progress={progress} />

        <button
          type="button"
          onClick={() => navigate(`/learning-modules/${moduleId}`)}
          className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            progress >= 100
              ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
              : progress > 0
              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
          }`}
        >
          {progress >= 100 ? "Review Module" : progress > 0 ? "Continue Module" : "Start Module"}
        </button>
      </div>
    </article>
  );
}

export default ModuleCard;
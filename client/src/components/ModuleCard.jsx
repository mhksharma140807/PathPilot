import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

function ModuleCard({ module, index }) {
  const navigate = useNavigate();

  const progress = module.progress || 0;

  const moduleId = module._id || module.id;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
          {index + 1}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">
            {module.title || module.name}
          </h3>

          {module.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {module.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Progress</span>

          <span className="font-semibold text-slate-700">
            {progress}%
          </span>
        </div>

        <ProgressBar progress={progress} />
      </div>

      <button
        type="button"
        onClick={() => navigate(`/learning-modules/${moduleId}`)}
        className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {progress > 0 ? "Continue Module" : "Start Module"}
      </button>
    </article>
  );
}

export default ModuleCard;
import { Link } from "react-router-dom";

function EmptyState({ title, description, actionText, actionLink }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">{description}</p>
      )}
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;

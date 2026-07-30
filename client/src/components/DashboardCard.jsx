function DashboardCard({ title, value, subtitle, icon, highlight }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md ${highlight ? "ring-2 ring-slate-900/5" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <h3 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default DashboardCard;
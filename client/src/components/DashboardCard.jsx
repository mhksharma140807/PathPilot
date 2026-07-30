function DashboardCard({ title, value, subtitle, icon, highlight }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${highlight ? "border-[#4F46E5]/40 ring-2 ring-[#4F46E5]/10" : "border-slate-200/80 hover:border-slate-300"}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        {icon && <div className="text-[#4F46E5]">{icon}</div>}
      </div>

      <h3 className="mt-3 text-3xl font-extrabold text-[#0F172A] tracking-tight">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-1.5 text-xs text-[#64748B]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default DashboardCard;
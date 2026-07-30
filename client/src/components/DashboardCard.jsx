function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default DashboardCard;
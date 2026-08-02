function StatusBadge({ status, progress }) {
  let label = "Not Started";
  let bgClass = "bg-slate-100 text-slate-600 border-slate-200";

  const effProgress = progress !== undefined && progress !== null ? Number(progress) : 0;
  const rawStatus = (status || "").toLowerCase();

  let effStatus = rawStatus;
  if (!rawStatus) {
    if (effProgress >= 100) effStatus = "completed";
    else if (effProgress > 0) effStatus = "in_progress";
    else effStatus = "not_started";
  }

  if (effStatus === "completed" || effStatus === "done" || effStatus === "mastered" || effProgress >= 100) {
    label = "Completed";
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (effStatus === "in_progress" || effStatus === "active" || effProgress > 0) {
    label = "In Progress";
    bgClass = "bg-blue-50 text-[#2563EB] border-blue-200";
  } else if (effStatus === "locked") {
    label = "Locked";
    bgClass = "bg-slate-100 text-slate-500 border-slate-200";
  } else if (effStatus === "coming_soon" || effStatus === "soon") {
    label = "Coming Soon";
    bgClass = "bg-slate-100 text-slate-500 border-slate-200";
  } else if (effStatus === "new") {
    label = "New";
    bgClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (effStatus === "available") {
    label = "Available";
    bgClass = "bg-slate-100 text-[#0F172A] border-slate-300";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all duration-200 ${bgClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          label === "Completed"
            ? "bg-emerald-500"
            : label === "In Progress"
            ? "bg-[#2563EB]"
            : label === "New"
            ? "bg-amber-500"
            : "bg-slate-400"
        }`}
      />
      {label}
    </span>
  );
}

export default StatusBadge;

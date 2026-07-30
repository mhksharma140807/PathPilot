function StatusBadge({ status, progress }) {
  let label = "Not Started";
  let bgClass = "bg-slate-100 text-slate-700 border-slate-200";

  const effProgress = progress !== undefined ? Number(progress) : 0;
  const effStatus = status || (effProgress >= 100 ? "completed" : effProgress > 0 ? "in_progress" : "not_started");

  if (effStatus === "completed" || effProgress >= 100) {
    label = "Completed";
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  } else if (effStatus === "in_progress" || effProgress > 0) {
    label = "In Progress";
    bgClass = "bg-blue-50 text-blue-700 border-blue-200/60";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${bgClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          label === "Completed"
            ? "bg-emerald-500"
            : label === "In Progress"
            ? "bg-blue-500"
            : "bg-slate-400"
        }`}
      />
      {label}
    </span>
  );
}

export default StatusBadge;

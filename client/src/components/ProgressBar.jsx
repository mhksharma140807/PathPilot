function ProgressBar({ progress = 0 }) {
  const barColor = progress >= 100 ? "bg-emerald-500" : "bg-slate-900";

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${barColor} transition-all`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

export default ProgressBar;
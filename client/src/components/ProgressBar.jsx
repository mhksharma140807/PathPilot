function ProgressBar({ progress = 0, className = "" }) {
  const clamped = Math.min(Math.max(Number(progress) || 0, 0), 100);
  const barColor = clamped >= 100 ? "bg-emerald-500" : "bg-slate-900";

  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 ${className}`}>
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
function ProgressBar({ progress = 0 }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-slate-900 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;
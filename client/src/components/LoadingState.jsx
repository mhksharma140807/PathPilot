function LoadingState({ message = "Loading...", variant = "default" }) {
  if (variant === "dashboard") {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-28 rounded-3xl bg-slate-200/70 w-full" />

        {/* Hero Card Skeleton */}
        <div className="h-64 rounded-3xl bg-slate-800/90 w-full" />

        {/* 3 Stats Skeletons */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-24 rounded-2xl bg-slate-200/70" />
          <div className="h-24 rounded-2xl bg-slate-200/70" />
          <div className="h-24 rounded-2xl bg-slate-200/70" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 h-64 rounded-3xl bg-slate-200/70" />
          <div className="lg:col-span-5 h-64 rounded-3xl bg-slate-200/70" />
        </div>
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 md:px-8 animate-pulse">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4 h-80 rounded-3xl bg-slate-200/70" />
          <div className="md:col-span-8 space-y-6">
            <div className="h-40 rounded-3xl bg-slate-200/70" />
            <div className="h-40 rounded-3xl bg-slate-200/70" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "modules") {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-8 animate-pulse">
        <div className="h-44 rounded-3xl bg-slate-800/90 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-56 rounded-3xl bg-slate-200/70" />
          <div className="h-56 rounded-3xl bg-slate-200/70" />
          <div className="h-56 rounded-3xl bg-slate-200/70" />
          <div className="h-56 rounded-3xl bg-slate-200/70" />
        </div>
      </div>
    );
  }

  if (variant === "progress") {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-8 animate-pulse">
        <div className="h-44 rounded-3xl bg-slate-800/90 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-28 rounded-2xl bg-slate-200/70" />
          <div className="h-28 rounded-2xl bg-slate-200/70" />
          <div className="h-28 rounded-2xl bg-slate-200/70" />
          <div className="h-28 rounded-2xl bg-slate-200/70" />
        </div>
        <div className="h-64 rounded-3xl bg-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12 text-center">
      <div className="flex items-center space-x-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-xs">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent"></div>
        <span className="text-sm font-semibold text-slate-600">{message}</span>
      </div>
    </div>
  );
}

export default LoadingState;

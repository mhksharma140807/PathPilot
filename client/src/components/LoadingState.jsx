function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="flex items-center space-x-3 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
        <span className="text-sm font-medium text-slate-600">{message}</span>
      </div>
    </div>
  );
}

export default LoadingState;

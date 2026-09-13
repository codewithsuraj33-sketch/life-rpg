export default function GameLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pointer-events-none select-none">
      {/* Top Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-[var(--bg-secondary)] via-[#0f0d32] to-[var(--bg-primary)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar skeleton */}
            <div className="w-20 h-20 rounded-2xl bg-purple-900/30 border border-purple-500/30 animate-pulse flex-shrink-0" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-7 w-40 bg-purple-500/20 rounded-xl animate-pulse" />
                <div className="h-5 w-24 bg-amber-500/20 rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-56 sm:w-80 bg-slate-700/30 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-28 bg-amber-500/15 border border-amber-500/20 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-purple-500/15 border border-purple-500/20 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="mt-6 pt-5 border-t border-purple-500/15 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-3 w-28 bg-slate-700/40 rounded animate-pulse" />
            <div className="h-3 w-20 bg-amber-500/20 rounded animate-pulse" />
          </div>
          <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-purple-500/20">
            <div className="h-full w-2/5 bg-gradient-to-r from-purple-500/40 to-cyan-500/40 animate-pulse rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-purple-500/15 bg-[var(--bg-card)] space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-slate-700/40 rounded-lg animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-purple-500/30 rounded-xl animate-pulse" />
            <div className="h-2 w-full bg-black/50 rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Large Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-purple-500/15 bg-[var(--bg-card)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
            <div className="h-5 w-32 bg-slate-700/40 rounded-lg animate-pulse" />
            <div className="h-4 w-16 bg-cyan-500/20 rounded-lg animate-pulse" />
          </div>
          {[1, 2, 3].map((j) => (
            <div
              key={j}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 animate-pulse flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 bg-slate-700/30 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-800/40 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-16 bg-amber-500/15 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-purple-500/15 bg-[var(--bg-card)] space-y-4">
          <div className="h-5 w-28 bg-slate-700/40 rounded-lg animate-pulse" />
          <div className="h-32 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-700/30 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-700/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

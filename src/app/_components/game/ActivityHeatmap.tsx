'use client'

import { useMemo } from 'react'

interface Activity {
  created_at: string
}

export function ActivityHeatmap({ activities }: { activities: Activity[] }) {
  // We want to show a 60-day heatmap (approx 8.5 weeks)
  const DAYS_TO_SHOW = 60

  const heatmapData = useMemo(() => {
    // Initialize a map of the last 60 days with 0 counts
    const counts = new Map<string, number>()
    const today = new Date()
    today.setHours(0, 0, 0, 0) // normalize to midnight

    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      counts.set(dateStr, 0)
    }

    // Populate counts based on activities
    activities.forEach((act) => {
      const actDate = new Date(act.created_at)
      actDate.setHours(0, 0, 0, 0)
      const dateStr = actDate.toISOString().split('T')[0]
      if (counts.has(dateStr)) {
        counts.set(dateStr, counts.get(dateStr)! + 1)
      }
    })

    // Convert to array of objects
    return Array.from(counts.entries()).map(([date, count]) => ({
      date,
      count,
    }))
  }, [activities])

  // Determine color based on intensity (0, 1-2, 3-5, 6+)
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-[var(--bg-secondary)] border-[var(--border-default)]'
    if (count <= 2) return 'bg-[var(--purple-bg)] border-[var(--purple)]/30'
    if (count <= 5) return 'bg-[var(--purple-glow)] border-[var(--purple)]/60'
    return 'bg-[var(--purple)] shadow-[0_0_8px_rgba(168,85,247,0.5)] border-[var(--purple)]'
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div className="flex gap-1.5 min-w-max">
        {/* We arrange them in columns of 7 days (weeks). But for a simple linear or masonry layout, 
            a flex wrap or CSS grid is better. Let's use a standard grid for the classic GitHub look:
            Rows = days of week, Cols = weeks. 
            However, we have exactly 60 days, which is ~8.5 columns of 7 rows.
            We will arrange them vertically (column-first flow) using CSS columns or grid auto-flow.
        */}
        <div 
          className="grid gap-1.5" 
          style={{ 
            gridTemplateRows: 'repeat(7, 1fr)', 
            gridAutoFlow: 'column' 
          }}
        >
          {heatmapData.map((day, i) => (
            <div
              key={day.date}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[4px] border ${getColorClass(day.count)} transition-all hover:scale-125 hover:z-10 cursor-help relative group`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                {day.count} quests on {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111827]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

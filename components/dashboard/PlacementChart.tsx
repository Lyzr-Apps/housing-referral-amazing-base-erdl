'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { HiOutlineChartBar } from 'react-icons/hi2'

interface PlacementChartProps {
  data: { day: string; referrals: number; placements: number }[]
}

export default function PlacementChart({ data }: PlacementChartProps) {
  const hasData = data.length > 0 && data.some((d) => d.referrals > 0 || d.placements > 0)

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">This Week: Referrals vs Placements</h3>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-slate-100 mb-3">
              <HiOutlineChartBar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">No data yet</p>
            <p className="text-xs text-slate-400 max-w-[200px]">
              Chart data will populate as referrals and placements are recorded this week.
            </p>
          </div>
        ) : (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="referrals" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Referrals" />
                <Bar dataKey="placements" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Placements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

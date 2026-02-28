'use client'

import { DashboardStats } from './types'
import { Card, CardContent } from '@/components/ui/card'
import {
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineHomeModern,
  HiOutlineChartBar,
  HiOutlineCalendarDays,
  HiOutlineQueueList,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    { label: 'Total Referrals', value: stats.totalReferrals, icon: HiOutlineDocumentText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Review', value: stats.pendingReferrals, icon: HiOutlineClock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Placed This Week', value: stats.placedThisWeek, icon: HiOutlineCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Beds Available', value: `${stats.totalBedsAvailable} / ${stats.totalBeds}`, icon: HiOutlineHomeModern, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: HiOutlineChartBar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg Placement', value: stats.avgPlacementTime, icon: HiOutlineCalendarDays, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Waitlisted', value: stats.waitlistedClients, icon: HiOutlineQueueList, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'This Month', value: `+${stats.placedThisWeek * 4}`, icon: HiOutlineArrowTrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md ${item.bg}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-900 leading-tight">{item.value}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

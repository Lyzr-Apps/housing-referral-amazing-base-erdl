'use client'

import { ReferralStats } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineArrowTrendingUp, HiOutlineCalendarDays } from 'react-icons/hi2'

interface StatsCardsProps {
  stats: ReferralStats
}

const statItems = [
  { key: 'totalReferrals' as const, label: 'Total Referrals', icon: HiOutlineUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'converted' as const, label: 'Converted', icon: HiOutlineCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'pending' as const, label: 'Pending', icon: HiOutlineClock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'totalEarnings' as const, label: 'Total Earnings', icon: HiOutlineCurrencyDollar, color: 'text-violet-600', bg: 'bg-violet-50', prefix: '$' },
  { key: 'conversionRate' as const, label: 'Conversion Rate', icon: HiOutlineArrowTrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', suffix: '%' },
  { key: 'thisMonth' as const, label: 'This Month', icon: HiOutlineCalendarDays, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon
        const value = stats[item.key]
        return (
          <Card key={item.key} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 truncate">{item.label}</p>
                  <p className="text-xl font-bold text-slate-900">
                    {item.prefix || ''}{typeof value === 'number' ? value.toLocaleString() : value}{item.suffix || ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

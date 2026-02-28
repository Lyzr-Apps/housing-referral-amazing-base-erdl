'use client'

import { ActivityItem } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { HiOutlineUserPlus, HiOutlineCheckBadge, HiOutlineGift, HiOutlineCursorArrowRays } from 'react-icons/hi2'

interface RecentActivityProps {
  activities: ActivityItem[]
}

const activityConfig = {
  signup: { icon: HiOutlineUserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  conversion: { icon: HiOutlineCheckBadge, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  reward: { icon: HiOutlineGift, color: 'text-violet-600', bg: 'bg-violet-50' },
  click: { icon: HiOutlineCursorArrowRays, color: 'text-amber-600', bg: 'bg-amber-50' },
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon
            return (
              <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`p-1.5 rounded-lg ${config.bg} mt-0.5 shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 leading-snug">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

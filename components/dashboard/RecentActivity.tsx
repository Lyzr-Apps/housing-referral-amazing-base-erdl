'use client'

import { ActivityItem } from './types'
import { Card, CardContent } from '@/components/ui/card'
import {
  HiOutlineInboxArrowDown,
  HiOutlineHomeModern,
  HiOutlineArrowRightOnRectangle,
  HiOutlineWrench,
  HiOutlineQueueList,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2'

interface RecentActivityProps {
  activities: ActivityItem[]
}

const activityConfig: Record<string, { icon: typeof HiOutlineInboxArrowDown; color: string; bg: string }> = {
  referral_in: { icon: HiOutlineInboxArrowDown, color: 'text-blue-600', bg: 'bg-blue-50' },
  placement: { icon: HiOutlineHomeModern, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  discharge: { icon: HiOutlineArrowRightOnRectangle, color: 'text-violet-600', bg: 'bg-violet-50' },
  bed_update: { icon: HiOutlineWrench, color: 'text-amber-600', bg: 'bg-amber-50' },
  waitlist: { icon: HiOutlineQueueList, color: 'text-rose-600', bg: 'bg-rose-50' },
  intake: { icon: HiOutlineClipboardDocumentCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {activities.map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.referral_in
            const Icon = config.icon
            return (
              <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`p-1.5 rounded-md ${config.bg} mt-0.5 shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 leading-snug">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">{activity.time}</span>
                    {activity.facility && (
                      <>
                        <span className="text-slate-300 text-[11px]">--</span>
                        <span className="text-[11px] text-slate-500 font-medium">{activity.facility}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

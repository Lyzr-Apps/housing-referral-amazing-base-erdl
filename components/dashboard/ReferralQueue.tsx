'use client'

import { ClientReferral } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HiOutlineExclamationTriangle,
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlineInboxArrowDown,
} from 'react-icons/hi2'

interface ReferralQueueProps {
  referrals: ClientReferral[]
}

const urgencyConfig: Record<string, { label: string; style: string; dot: string }> = {
  critical: { label: 'Critical', style: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500 animate-pulse' },
  high: { label: 'High', style: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  medium: { label: 'Medium', style: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low: { label: 'Low', style: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
}

const statusLabels: Record<string, string> = {
  new: 'New',
  in_review: 'In Review',
  accepted: 'Accepted',
  waitlisted: 'Waitlisted',
}

export default function ReferralQueue({ referrals }: ReferralQueueProps) {
  const activeReferrals = referrals.filter(
    (r) => r.status === 'new' || r.status === 'in_review' || r.status === 'accepted' || r.status === 'waitlisted'
  )

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineInboxArrowDown className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">Incoming Referrals</h3>
            <Badge variant="secondary" className="text-[10px] h-5">{activeReferrals.length} active</Badge>
          </div>
        </div>

        <div className="space-y-2">
          {activeReferrals.map((referral) => {
            const urgency = urgencyConfig[referral.urgency]
            return (
              <div
                key={referral.id}
                className={`p-3 rounded-lg border transition-colors hover:shadow-sm ${
                  referral.urgency === 'critical'
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-2 h-2 rounded-full ${urgency.dot} shrink-0`} />
                      <span className="text-sm font-semibold text-slate-900">{referral.clientName}</span>
                      <span className="text-[11px] text-slate-400">{referral.clientId}</span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${urgency.style}`}>
                        {urgency.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>{referral.age}yo {referral.gender}</span>
                      <span className="text-slate-300">|</span>
                      <span>From: {referral.referredFrom}</span>
                      <span className="text-slate-300">|</span>
                      <span>By: {referral.referredBy}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {referral.needs.map((need) => (
                        <span
                          key={need}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                    {referral.notes && (
                      <p className="text-[11px] text-slate-500 mt-1.5 flex items-start gap-1">
                        <HiOutlineExclamationTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        {referral.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {statusLabels[referral.status] || referral.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <HiOutlineEye className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <HiOutlineArrowRight className="w-3.5 h-3.5 text-teal-600" />
                      </Button>
                    </div>
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

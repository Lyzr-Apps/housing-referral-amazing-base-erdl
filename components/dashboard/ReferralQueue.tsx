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
  HiOutlineUserPlus,
} from 'react-icons/hi2'

interface ReferralQueueProps {
  referrals: ClientReferral[]
  onAddReferral?: () => void
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

const bedTypeLabels: Record<string, string> = {
  workforce: 'Workforce',
  medical: 'Medical Step-Down',
}

export default function ReferralQueue({ referrals, onAddReferral }: ReferralQueueProps) {
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

        {activeReferrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-slate-100 mb-3">
              <HiOutlineInboxArrowDown className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">No referrals yet</p>
            <p className="text-xs text-slate-400 mb-4 max-w-[240px]">
              Incoming client referrals will appear here once they are submitted.
            </p>
            <Button
              size="sm"
              className="gap-1.5 bg-teal-600 hover:bg-teal-700"
              onClick={onAddReferral}
            >
              <HiOutlineUserPlus className="w-4 h-4" />
              Add Referral
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {activeReferrals.map((referral) => {
              const urgency = urgencyConfig[referral.urgency] || urgencyConfig.low
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
                        <span className="text-sm font-semibold text-slate-900">
                          {referral.firstName} {referral.lastInitial}.
                        </span>
                        {referral.urgency && (
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${urgency.style}`}>
                            {urgency.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>From: {referral.referralPartner}</span>
                        {referral.bedType && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>Bed: {bedTypeLabels[referral.bedType] || referral.bedType}</span>
                          </>
                        )}
                        {referral.phone && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>{referral.phone}</span>
                          </>
                        )}
                      </div>
                      {referral.staffNotes && (
                        <p className="text-[11px] text-slate-500 mt-1.5 flex items-start gap-1">
                          <HiOutlineExclamationTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                          {referral.staffNotes}
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
        )}
      </CardContent>
    </Card>
  )
}

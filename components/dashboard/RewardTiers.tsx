'use client'

import { RewardTier } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { HiOutlineTrophy } from 'react-icons/hi2'

interface RewardTiersProps {
  tiers: RewardTier[]
  currentReferrals: number
}

export default function RewardTiers({ tiers, currentReferrals }: RewardTiersProps) {
  const currentTierIndex = tiers.reduce((acc, tier, index) => {
    if (currentReferrals >= tier.minReferrals) return index
    return acc
  }, 0)

  const currentTier = tiers[currentTierIndex]
  const nextTier = tiers[currentTierIndex + 1]
  const progressToNext = nextTier
    ? Math.min(100, ((currentReferrals - currentTier.minReferrals) / (nextTier.minReferrals - currentTier.minReferrals)) * 100)
    : 100

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineTrophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-sm font-semibold text-slate-900">Reward Tiers</h3>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={`text-sm font-bold ${currentTier.color}`}>{currentTier.name}</span>
              <span className="text-xs text-slate-500 ml-2">Current Tier</span>
            </div>
            {nextTier && (
              <span className="text-xs text-slate-500">
                {nextTier.minReferrals - currentReferrals} more to {nextTier.name}
              </span>
            )}
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>

        <div className="space-y-2">
          {tiers.map((tier, index) => {
            const isActive = index === currentTierIndex
            const isCompleted = index < currentTierIndex
            return (
              <div
                key={tier.name}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 border border-blue-200' : isCompleted ? 'bg-slate-50' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${tier.color}`}>{tier.name}</span>
                  <span className="text-xs text-slate-500">{tier.minReferrals}+ referrals</span>
                </div>
                <span className="text-xs font-medium text-slate-600">{tier.reward}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

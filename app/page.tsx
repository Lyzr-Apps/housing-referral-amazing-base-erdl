'use client'

import Header from '@/components/dashboard/Header'
import StatsCards from '@/components/dashboard/StatsCards'
import ReferralChart from '@/components/dashboard/ReferralChart'
import ReferralLink from '@/components/dashboard/ReferralLink'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ReferralTable from '@/components/dashboard/ReferralTable'
import RewardTiers from '@/components/dashboard/RewardTiers'
import InviteForm from '@/components/dashboard/InviteForm'
import { stats, referrals, rewardTiers, recentActivity, monthlyData } from '@/components/dashboard/mock-data'

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Overview */}
        <StatsCards stats={stats} />

        {/* Chart + Referral Link + Invite */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReferralChart data={monthlyData} />
          </div>
          <div className="space-y-6">
            <ReferralLink />
            <InviteForm />
          </div>
        </div>

        {/* Referral Table */}
        <ReferralTable referrals={referrals} />

        {/* Activity + Reward Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={recentActivity} />
          <RewardTiers tiers={rewardTiers} currentReferrals={stats.totalReferrals} />
        </div>
      </main>
    </div>
  )
}

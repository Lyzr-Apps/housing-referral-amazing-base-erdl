'use client'

import { useRef } from 'react'
import Header from '@/components/dashboard/Header'
import StatsCards from '@/components/dashboard/StatsCards'
import BedTracker from '@/components/dashboard/BedTracker'
import ReferralQueue from '@/components/dashboard/ReferralQueue'
import ClientIntake from '@/components/dashboard/ClientIntake'
import PlacementChart from '@/components/dashboard/PlacementChart'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ReferralTable from '@/components/dashboard/ReferralTable'
import {
  dashboardStats,
  facilities,
  referrals,
  recentActivity,
  weeklyPlacementData,
} from '@/components/dashboard/mock-data'

export default function Page() {
  const intakeRef = useRef<HTMLDivElement>(null)

  const pendingCount = referrals.filter(
    (r) => r.status === 'new' || r.status === 'in_review'
  ).length

  const scrollToIntake = () => {
    intakeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pendingCount={pendingCount} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Stats */}
        <StatsCards stats={dashboardStats} />

        {/* Incoming Referrals Queue + Intake Form */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ReferralQueue referrals={referrals} onAddReferral={scrollToIntake} />
          </div>
          <div ref={intakeRef}>
            <ClientIntake />
          </div>
        </div>

        {/* Bed Tracker + Weekly Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <BedTracker facilities={facilities} />
          </div>
          <div className="space-y-6">
            <PlacementChart data={weeklyPlacementData} />
            <RecentActivity activities={recentActivity} />
          </div>
        </div>

        {/* Full Referral History Table */}
        <ReferralTable referrals={referrals} onAddReferral={scrollToIntake} />
      </main>
    </div>
  )
}

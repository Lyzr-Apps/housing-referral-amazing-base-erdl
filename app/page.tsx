'use client'

import { useRef, useState, useCallback } from 'react'
import Header from '@/components/dashboard/Header'
import StatsCards from '@/components/dashboard/StatsCards'
import BedTracker from '@/components/dashboard/BedTracker'
import ReferralQueue from '@/components/dashboard/ReferralQueue'
import ClientIntake from '@/components/dashboard/ClientIntake'
import PlacementChart from '@/components/dashboard/PlacementChart'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ReferralTable from '@/components/dashboard/ReferralTable'
import BedSetup from '@/components/dashboard/BedSetup'
import { BedRecord, DashboardStats, Facility } from '@/components/dashboard/types'
import {
  dashboardStats as initialStats,
  referrals,
  recentActivity,
  weeklyPlacementData,
} from '@/components/dashboard/mock-data'
import { HiOutlineViewColumns, HiOutlineWrenchScrewdriver } from 'react-icons/hi2'

type TabId = 'dashboard' | 'bed-setup'

export default function Page() {
  const intakeRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [beds, setBeds] = useState<BedRecord[]>([])

  const pendingCount = referrals.filter(
    (r) => r.status === 'new' || r.status === 'in_review'
  ).length

  const scrollToIntake = () => {
    intakeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToBedSetup = useCallback(() => {
    setActiveTab('bed-setup')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Derive stats from beds state
  const stats: DashboardStats = {
    ...initialStats,
    totalBeds: beds.length,
    totalBedsAvailable: beds.filter((b) => b.status === 'available').length,
    occupancyRate: beds.length > 0
      ? Math.round((beds.filter((b) => b.status === 'occupied').length / beds.length) * 100)
      : 0,
  }

  // Derive facilities summary from beds for the BedTracker
  const facilities: Facility[] = deriveFacilities(beds)

  const tabs: { id: TabId; label: string; icon: typeof HiOutlineViewColumns }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HiOutlineViewColumns },
    { id: 'bed-setup', label: 'Bed Setup', icon: HiOutlineWrenchScrewdriver },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pendingCount={pendingCount} />

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'bed-setup' && beds.length > 0 && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full ml-0.5">
                      {beds.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            {/* KPI Stats */}
            <StatsCards stats={stats} />

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
                <BedTracker facilities={facilities} onAddBeds={goToBedSetup} />
              </div>
              <div className="space-y-6">
                <PlacementChart data={weeklyPlacementData} />
                <RecentActivity activities={recentActivity} />
              </div>
            </div>

            {/* Full Referral History Table */}
            <ReferralTable referrals={referrals} onAddReferral={scrollToIntake} />
          </>
        )}

        {activeTab === 'bed-setup' && (
          <BedSetup beds={beds} onBedsChange={setBeds} />
        )}
      </main>
    </div>
  )
}

// Helper: derive facility summaries from individual bed records
function deriveFacilities(beds: BedRecord[]): Facility[] {
  if (beds.length === 0) return []

  const groups: Record<string, BedRecord[]> = {}
  for (const bed of beds) {
    if (!groups[bed.facilityId]) groups[bed.facilityId] = []
    groups[bed.facilityId].push(bed)
  }

  return Object.entries(groups).map(([facilityId, facilityBeds]) => {
    const available = facilityBeds.filter((b) => b.status === 'available').length
    const occupied = facilityBeds.filter((b) => b.status === 'occupied').length
    const reserved = facilityBeds.filter((b) => b.status === 'reserved').length
    const maintenance = facilityBeds.filter((b) => b.status === 'maintenance').length

    return {
      id: facilityId,
      name: facilityBeds[0].facilityName,
      type: facilityId === 'workforce' ? 'transitional' as const : 'permanent_supportive' as const,
      totalBeds: facilityBeds.length,
      availableBeds: available,
      reservedBeds: reserved,
      maintenanceBeds: maintenance,
      occupiedBeds: occupied,
      address: '',
      phone: '',
      acceptingReferrals: available > 0,
      specializations: [],
    }
  })
}

'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Header from '@/components/dashboard/Header'
import StatsCards from '@/components/dashboard/StatsCards'
import BedTracker from '@/components/dashboard/BedTracker'
import ReferralQueue from '@/components/dashboard/ReferralQueue'
import ClientIntake from '@/components/dashboard/ClientIntake'
import PlacementChart from '@/components/dashboard/PlacementChart'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ReferralTable from '@/components/dashboard/ReferralTable'
import BedSetup from '@/components/dashboard/BedSetup'
import { BedRecord, ClientReferral, DashboardStats, Facility, ActivityItem } from '@/components/dashboard/types'
import { HiOutlineViewColumns, HiOutlineWrenchScrewdriver } from 'react-icons/hi2'

type TabId = 'dashboard' | 'bed-setup'

const emptyStats: DashboardStats = {
  totalReferrals: 0,
  pendingReferrals: 0,
  placedThisWeek: 0,
  totalBedsAvailable: 0,
  totalBeds: 0,
  occupancyRate: 0,
  avgPlacementTime: '--',
  waitlistedClients: 0,
}

export default function Page() {
  const intakeRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [beds, setBeds] = useState<BedRecord[]>([])
  const [referrals, setReferrals] = useState<ClientReferral[]>([])
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all data from API
  const fetchData = useCallback(async () => {
    try {
      const [refRes, bedRes, statsRes, actRes] = await Promise.all([
        fetch('/api/referrals'),
        fetch('/api/beds'),
        fetch('/api/stats'),
        fetch('/api/activity'),
      ])

      if (refRes.ok) {
        const data = await refRes.json()
        setReferrals(data.referrals || [])
      }
      if (bedRes.ok) {
        const data = await bedRes.json()
        setBeds(data.beds || [])
      }
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats || emptyStats)
      }
      if (actRes.ok) {
        const data = await actRes.json()
        setActivities(data.activities || [])
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  // When beds change locally, also refresh stats
  const handleBedsChange = useCallback((newBeds: BedRecord[]) => {
    setBeds(newBeds)
    fetch('/api/stats').then(res => res.ok ? res.json() : null).then(data => {
      if (data?.stats) setStats(data.stats)
    }).catch(() => {})
    fetch('/api/activity').then(res => res.ok ? res.json() : null).then(data => {
      if (data?.activities) setActivities(data.activities)
    }).catch(() => {})
  }, [])

  // After a referral is created, refresh everything
  const handleReferralCreated = useCallback(() => {
    fetchData()
  }, [fetchData])

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading data...</p>
            </div>
          </div>
        ) : (
          <>
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
                    <ClientIntake onReferralCreated={handleReferralCreated} />
                  </div>
                </div>

                {/* Bed Tracker + Weekly Chart */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <BedTracker facilities={facilities} onAddBeds={goToBedSetup} />
                  </div>
                  <div className="space-y-6">
                    <PlacementChart data={[]} />
                    <RecentActivity activities={activities} />
                  </div>
                </div>

                {/* Full Referral History Table */}
                <ReferralTable referrals={referrals} onAddReferral={scrollToIntake} />
              </>
            )}

            {activeTab === 'bed-setup' && (
              <BedSetup beds={beds} onBedsChange={handleBedsChange} />
            )}
          </>
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

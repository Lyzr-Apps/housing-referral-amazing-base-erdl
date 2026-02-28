import {
  ClientReferral,
  Facility,
  BedRecord,
  DashboardStats,
  ActivityItem,
} from './types'

export const dashboardStats: DashboardStats = {
  totalReferrals: 0,
  pendingReferrals: 0,
  placedThisWeek: 0,
  totalBedsAvailable: 0,
  totalBeds: 0,
  occupancyRate: 0,
  avgPlacementTime: '--',
  waitlistedClients: 0,
}

export const facilities: Facility[] = []

export const referrals: ClientReferral[] = []

export const beds: BedRecord[] = []

export const recentActivity: ActivityItem[] = []

export const weeklyPlacementData: { day: string; referrals: number; placements: number }[] = []

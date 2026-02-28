export type ReferralStatus = 'new' | 'in_review' | 'accepted' | 'placed' | 'waitlisted' | 'declined' | 'discharged'
export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance'
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low'
export type FacilityType = 'emergency_shelter' | 'transitional' | 'permanent_supportive' | 'safe_haven' | 'rapid_rehousing'

export interface ClientReferral {
  id: string
  firstName: string
  lastInitial: string
  phone: string
  dob: string
  referralPartner: string
  bedType: string
  urgency: string
  dateReferred: string
  status: ReferralStatus
  waitlistPriority: number
  staffNotes: string
  partnerNotes: string
  createdAt: string
  updatedAt: string
}

export interface Facility {
  id: string
  name: string
  type: FacilityType
  totalBeds: number
  availableBeds: number
  reservedBeds: number
  maintenanceBeds: number
  occupiedBeds: number
  address: string
  phone: string
  acceptingReferrals: boolean
  specializations: string[]
}

export interface BedRecord {
  id: string
  bedNumber: string
  facilityId: string
  facilityName: string
  status: BedStatus
  occupantName?: string
  occupantId?: string
  checkInDate?: string
  expectedCheckout?: string
}

export interface DashboardStats {
  totalReferrals: number
  pendingReferrals: number
  placedThisWeek: number
  totalBedsAvailable: number
  totalBeds: number
  occupancyRate: number
  avgPlacementTime: string
  waitlistedClients: number
}

export interface ActivityItem {
  id: string
  type: 'referral_in' | 'placement' | 'discharge' | 'bed_update' | 'waitlist' | 'intake'
  message: string
  time: string
  facility?: string
}

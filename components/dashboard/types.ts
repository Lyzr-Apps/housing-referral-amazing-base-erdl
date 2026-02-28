export interface Referral {
  id: string
  name: string
  email: string
  status: 'pending' | 'contacted' | 'converted' | 'expired'
  date: string
  reward: number
  source: string
}

export interface ReferralStats {
  totalReferrals: number
  converted: number
  pending: number
  totalEarnings: number
  conversionRate: number
  thisMonth: number
}

export interface RewardTier {
  name: string
  minReferrals: number
  reward: string
  color: string
}

export interface ActivityItem {
  id: string
  type: 'signup' | 'conversion' | 'reward' | 'click'
  message: string
  time: string
}

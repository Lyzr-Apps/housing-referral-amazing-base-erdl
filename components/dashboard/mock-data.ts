import { Referral, ReferralStats, RewardTier, ActivityItem } from './types'

export const stats: ReferralStats = {
  totalReferrals: 248,
  converted: 67,
  pending: 34,
  totalEarnings: 3350,
  conversionRate: 27,
  thisMonth: 18,
}

export const referrals: Referral[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@email.com', status: 'converted', date: '2026-02-25', reward: 50, source: 'Email' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus.j@email.com', status: 'contacted', date: '2026-02-24', reward: 0, source: 'Social' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@email.com', status: 'pending', date: '2026-02-23', reward: 0, source: 'Link' },
  { id: '4', name: 'David Kim', email: 'david.kim@email.com', status: 'converted', date: '2026-02-22', reward: 50, source: 'Email' },
  { id: '5', name: 'Lisa Thompson', email: 'lisa.t@email.com', status: 'expired', date: '2026-02-20', reward: 0, source: 'Social' },
  { id: '6', name: 'James Wilson', email: 'james.w@email.com', status: 'converted', date: '2026-02-19', reward: 50, source: 'Link' },
  { id: '7', name: 'Anna Petrov', email: 'anna.p@email.com', status: 'pending', date: '2026-02-18', reward: 0, source: 'Email' },
  { id: '8', name: 'Carlos Garcia', email: 'carlos.g@email.com', status: 'contacted', date: '2026-02-17', reward: 0, source: 'Social' },
  { id: '9', name: 'Priya Sharma', email: 'priya.s@email.com', status: 'converted', date: '2026-02-15', reward: 50, source: 'Link' },
  { id: '10', name: 'Tom Anderson', email: 'tom.a@email.com', status: 'pending', date: '2026-02-14', reward: 0, source: 'Email' },
]

export const rewardTiers: RewardTier[] = [
  { name: 'Bronze', minReferrals: 0, reward: '$25 per referral', color: 'text-amber-700' },
  { name: 'Silver', minReferrals: 10, reward: '$50 per referral', color: 'text-slate-400' },
  { name: 'Gold', minReferrals: 25, reward: '$75 per referral', color: 'text-yellow-500' },
  { name: 'Platinum', minReferrals: 50, reward: '$100 per referral + 5% recurring', color: 'text-indigo-400' },
]

export const recentActivity: ActivityItem[] = [
  { id: '1', type: 'conversion', message: 'Sarah Chen signed up and completed onboarding', time: '2 hours ago' },
  { id: '2', type: 'click', message: 'Your referral link was clicked 12 times', time: '5 hours ago' },
  { id: '3', type: 'signup', message: 'Marcus Johnson signed up via your link', time: '1 day ago' },
  { id: '4', type: 'reward', message: 'You earned $50 from David Kim\'s conversion', time: '2 days ago' },
  { id: '5', type: 'click', message: 'Your referral link was shared on Twitter', time: '3 days ago' },
  { id: '6', type: 'conversion', message: 'James Wilson upgraded to Pro plan', time: '4 days ago' },
]

export const monthlyData = [
  { month: 'Sep', referrals: 12, conversions: 3 },
  { month: 'Oct', referrals: 19, conversions: 5 },
  { month: 'Nov', referrals: 15, conversions: 4 },
  { month: 'Dec', referrals: 22, conversions: 7 },
  { month: 'Jan', referrals: 28, conversions: 9 },
  { month: 'Feb', referrals: 18, conversions: 6 },
]

'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HiOutlineBell, HiOutlineCog6Tooth } from 'react-icons/hi2'

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Referral Dashboard</h1>
            <p className="text-xs text-slate-500">Track your referrals, rewards, and performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
            <HiOutlineBell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <HiOutlineCog6Tooth className="w-5 h-5 text-slate-600" />
          </Button>
          <Avatar className="h-8 w-8 ml-1">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

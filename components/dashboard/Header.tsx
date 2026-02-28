'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { HiOutlineBell, HiOutlineCog6Tooth, HiOutlineBuildingOffice } from 'react-icons/hi2'

interface HeaderProps {
  pendingCount: number
}

export default function Header({ pendingCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center shadow-sm">
            <HiOutlineBuildingOffice className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Coordinated Entry
            </h1>
            <p className="text-xs text-slate-500">Referral & Bed Tracking System</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
            <HiOutlineBell className="w-5 h-5 text-slate-600" />
            {pendingCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-red-500 text-white border-2 border-white rounded-full flex items-center justify-center">
                {pendingCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <HiOutlineCog6Tooth className="w-5 h-5 text-slate-600" />
          </Button>
          <Avatar className="h-8 w-8 ml-1">
            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-semibold">CM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

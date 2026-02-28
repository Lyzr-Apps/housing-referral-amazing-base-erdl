'use client'

import { Facility } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  HiOutlineHomeModern,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePlusCircle,
} from 'react-icons/hi2'

interface BedTrackerProps {
  facilities: Facility[]
  onAddBeds?: () => void
}

const typeLabels: Record<string, string> = {
  emergency_shelter: 'Emergency',
  transitional: 'Transitional',
  permanent_supportive: 'PSH',
  safe_haven: 'Safe Haven',
  rapid_rehousing: 'RRH',
}

const typeColors: Record<string, string> = {
  emergency_shelter: 'bg-red-50 text-red-700 border-red-200',
  transitional: 'bg-blue-50 text-blue-700 border-blue-200',
  permanent_supportive: 'bg-violet-50 text-violet-700 border-violet-200',
  safe_haven: 'bg-amber-50 text-amber-700 border-amber-200',
  rapid_rehousing: 'bg-teal-50 text-teal-700 border-teal-200',
}

export default function BedTracker({ facilities, onAddBeds }: BedTrackerProps) {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineHomeModern className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-900">Facility Bed Status</h3>
          </div>
          {facilities.length > 0 && (
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Occupied
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Reserved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Maint.
              </span>
            </div>
          )}
        </div>

        {facilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-slate-100 mb-3">
              <HiOutlineHomeModern className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">No facilities or beds added</p>
            <p className="text-xs text-slate-400 mb-4 max-w-[260px]">
              Add your shelter facilities and their bed inventory to start tracking availability.
            </p>
            <Button
              size="sm"
              className="gap-1.5 bg-teal-600 hover:bg-teal-700"
              onClick={onAddBeds}
            >
              <HiOutlinePlusCircle className="w-4 h-4" />
              Add Beds
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {facilities.map((facility) => {
              const occupancyPct = facility.totalBeds > 0
                ? Math.round((facility.occupiedBeds / facility.totalBeds) * 100)
                : 0
              return (
                <div
                  key={facility.id}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">{facility.name}</span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeColors[facility.type]}`}>
                          {typeLabels[facility.type]}
                        </Badge>
                        {facility.acceptingReferrals ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                            <HiOutlineCheckCircle className="w-3 h-3" /> Accepting
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] text-red-500 font-medium">
                            <HiOutlineXCircle className="w-3 h-3" /> Closed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{facility.address} -- {facility.phone}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-lg font-bold text-emerald-600">{facility.availableBeds}</span>
                      <span className="text-xs text-slate-400"> / {facility.totalBeds}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress
                      value={occupancyPct}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-[11px] text-slate-500 font-medium w-10 text-right">{occupancyPct}%</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      {facility.availableBeds} open
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                      {facility.reservedBeds} reserved
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      {facility.maintenanceBeds} maint.
                    </span>
                    {facility.specializations.length > 0 && (
                      <span className="text-slate-400 ml-auto truncate">
                        {facility.specializations.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

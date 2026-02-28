'use client'

import { useState } from 'react'
import { BedRecord, BedStatus } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  HiOutlineHomeModern,
  HiOutlinePlusCircle,
  HiOutlineSquares2X2,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineTrash,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2'

interface BedSetupProps {
  beds: BedRecord[]
  onBedsChange: (beds: BedRecord[]) => void
}

const statusConfig: Record<BedStatus, { label: string; style: string; dot: string }> = {
  available: { label: 'Available', style: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  occupied: { label: 'Occupied', style: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  reserved: { label: 'Reserved', style: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  maintenance: { label: 'Maintenance', style: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

export default function BedSetup({ beds, onBedsChange }: BedSetupProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)
  const [addForm, setAddForm] = useState({
    bedNumber: '',
    wing: '',
    status: 'available' as BedStatus,
  })

  const showBanner = (msg: string) => {
    setSuccessBanner(msg)
    setTimeout(() => setSuccessBanner(null), 4000)
  }

  const handleCreateDefaults = async () => {
    const defaultBeds: BedRecord[] = []

    for (let i = 1; i <= 8; i++) {
      defaultBeds.push({
        id: `default-w${i}`,
        bedNumber: `W${i}`,
        facilityId: 'workforce',
        facilityName: 'Workforce',
        status: 'available',
      })
    }

    for (let i = 1; i <= 4; i++) {
      defaultBeds.push({
        id: `default-m${i}`,
        bedNumber: `M${i}`,
        facilityId: 'medical',
        facilityName: 'Medical Step-Down',
        status: 'available',
      })
    }

    try {
      const res = await fetch('/api/beds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulk: true, beds: defaultBeds }),
      })
      if (res.ok) {
        onBedsChange(defaultBeds)
        showBanner('12 beds created')
      }
    } catch {
      // fallback to local state
      onBedsChange(defaultBeds)
      showBanner('12 beds created')
    }
  }

  const handleAddBed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.bedNumber || !addForm.wing) return

    const wingName = addForm.wing === 'workforce' ? 'Workforce' : 'Medical Step-Down'
    const newBed: BedRecord = {
      id: `bed-${Date.now()}`,
      bedNumber: addForm.bedNumber,
      facilityId: addForm.wing,
      facilityName: wingName,
      status: addForm.status,
    }

    try {
      await fetch('/api/beds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBed),
      })
    } catch {
      // continue with local state update
    }

    onBedsChange([...beds, newBed])
    setAddForm({ bedNumber: '', wing: '', status: 'available' })
    setShowAddForm(false)
    showBanner(`Bed ${newBed.bedNumber} added to ${wingName}`)
  }

  const handleDeleteBed = async (bedId: string) => {
    try {
      await fetch(`/api/beds?id=${bedId}`, { method: 'DELETE' })
    } catch {
      // continue with local state
    }
    onBedsChange(beds.filter((b) => b.id !== bedId))
  }

  const handleStatusChange = async (bedId: string, newStatus: BedStatus) => {
    try {
      await fetch('/api/beds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bedId, status: newStatus }),
      })
    } catch {
      // continue with local state
    }
    onBedsChange(
      beds.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b))
    )
  }

  const workforceBeds = beds.filter((b) => b.facilityId === 'workforce')
  const medicalBeds = beds.filter((b) => b.facilityId === 'medical')
  const availableCount = beds.filter((b) => b.status === 'available').length
  const occupiedCount = beds.filter((b) => b.status === 'occupied').length

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {successBanner && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successBanner}</p>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-800">
            <HiOutlineXMark className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Card */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50">
                <HiOutlineWrenchScrewdriver className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Bed Setup</h2>
                <p className="text-xs text-slate-500">Manage shelter bed inventory and availability</p>
              </div>
            </div>
            {beds.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">{beds.length}</p>
                  <p className="text-[11px] text-slate-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{availableCount}</p>
                  <p className="text-[11px] text-slate-500">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-600">{occupiedCount}</p>
                  <p className="text-[11px] text-slate-500">Occupied</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {beds.length === 0 && !showAddForm && (
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-slate-100 mb-4">
                <HiOutlineHomeModern className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">No beds configured</p>
              <p className="text-sm text-slate-400 mb-6 max-w-[320px]">
                Set up your bed inventory to start tracking availability. You can add beds individually or create a default set.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-slate-300"
                  onClick={() => setShowAddForm(true)}
                >
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  Add Bed
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-teal-600 hover:bg-teal-700"
                  onClick={handleCreateDefaults}
                >
                  <HiOutlineSquares2X2 className="w-4 h-4" />
                  Create Default 12 Beds
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Default creates Workforce W1-W8 and Medical Step-Down M1-M4
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Bed Form */}
      {showAddForm && (
        <Card className="border border-teal-200 shadow-sm bg-teal-50/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiOutlinePlusCircle className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-900">Add New Bed</h3>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBed} className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <Label className="text-xs text-slate-600 mb-1">Bed Number *</Label>
                <Input
                  placeholder="e.g. W9, M5, B1"
                  value={addForm.bedNumber}
                  onChange={(e) => setAddForm((f) => ({ ...f, bedNumber: e.target.value.toUpperCase() }))}
                  className="h-9 text-sm border-slate-200 bg-white"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <Label className="text-xs text-slate-600 mb-1">Wing / Unit *</Label>
                <Select value={addForm.wing} onValueChange={(v) => setAddForm((f) => ({ ...f, wing: v }))}>
                  <SelectTrigger className="h-9 text-sm border-slate-200 bg-white">
                    <SelectValue placeholder="Select wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workforce">Workforce</SelectItem>
                    <SelectItem value="medical">Medical Step-Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <Label className="text-xs text-slate-600 mb-1">Status</Label>
                <Select value={addForm.status} onValueChange={(v) => setAddForm((f) => ({ ...f, status: v as BedStatus }))}>
                  <SelectTrigger className="h-9 text-sm border-slate-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-200"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 bg-teal-600 hover:bg-teal-700 gap-1"
                  disabled={!addForm.bedNumber || !addForm.wing}
                >
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bed Inventory Table */}
      {beds.length > 0 && (
        <>
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Available ({availableCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Occupied ({occupiedCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Reserved ({beds.filter((b) => b.status === 'reserved').length})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Maint. ({beds.filter((b) => b.status === 'maintenance').length})
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-slate-300 h-8"
              onClick={() => setShowAddForm(true)}
            >
              <HiOutlinePlusCircle className="w-4 h-4" />
              Add Bed
            </Button>
          </div>

          {/* Workforce Wing */}
          {workforceBeds.length > 0 && (
            <BedWingTable
              title="Workforce"
              beds={workforceBeds}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteBed}
            />
          )}

          {/* Medical Step-Down Wing */}
          {medicalBeds.length > 0 && (
            <BedWingTable
              title="Medical Step-Down"
              beds={medicalBeds}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteBed}
            />
          )}
        </>
      )}
    </div>
  )
}

function BedWingTable({
  title,
  beds,
  onStatusChange,
  onDelete,
}: {
  title: string
  beds: BedRecord[]
  onStatusChange: (bedId: string, status: BedStatus) => void
  onDelete: (bedId: string) => void
}) {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineHomeModern className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <Badge variant="secondary" className="text-[10px] h-5">{beds.length} beds</Badge>
        </div>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="text-[11px] font-semibold text-slate-600 w-[100px]">Bed #</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-600">Status</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-600">Occupant</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-600">Check-In</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-600 w-[180px]">Change Status</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-600 w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beds.map((bed) => {
                const sc = statusConfig[bed.status]
                return (
                  <TableRow key={bed.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-sm font-semibold text-slate-900 font-mono">{bed.bedNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${sc.style}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} inline-block mr-1`} />
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {bed.occupantName || <span className="text-slate-400">--</span>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {bed.checkInDate
                        ? new Date(bed.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : <span className="text-slate-400">--</span>}
                    </TableCell>
                    <TableCell>
                      <Select value={bed.status} onValueChange={(v) => onStatusChange(bed.id, v as BedStatus)}>
                        <SelectTrigger className="h-7 text-[11px] border-slate-200 w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                        onClick={() => onDelete(bed.id)}
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

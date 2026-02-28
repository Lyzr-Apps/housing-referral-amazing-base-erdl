'use client'

import { useState } from 'react'
import { ClientReferral, ReferralStatus } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineDocumentText,
  HiOutlineUserPlus,
} from 'react-icons/hi2'

interface ReferralTableProps {
  referrals: ClientReferral[]
  onAddReferral?: () => void
}

const statusStyles: Record<ReferralStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  in_review: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-teal-50 text-teal-700 border-teal-200',
  placed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  waitlisted: 'bg-orange-50 text-orange-700 border-orange-200',
  declined: 'bg-red-50 text-red-600 border-red-200',
  discharged: 'bg-violet-50 text-violet-700 border-violet-200',
}

const statusLabels: Record<ReferralStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  accepted: 'Accepted',
  placed: 'Placed',
  waitlisted: 'Waitlisted',
  declined: 'Declined',
  discharged: 'Discharged',
}

const urgencyDots: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-slate-400',
}

const bedTypeLabels: Record<string, string> = {
  workforce: 'Workforce',
  medical: 'Medical Step-Down',
}

const PER_PAGE = 5

export default function ReferralTable({ referrals, onAddReferral }: ReferralTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)

  const filtered = referrals.filter((r) => {
    const clientDisplay = `${r.firstName} ${r.lastInitial}`.toLowerCase()
    const matchesSearch =
      clientDisplay.includes(search.toLowerCase()) ||
      r.referralPartner.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-900">All Referrals</h3>
          {referrals.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <HiOutlineMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="pl-8 h-8 text-sm w-48 border-slate-200"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                <HiOutlineFunnel className="w-4 h-4 text-slate-400 shrink-0" />
                {['all', 'new', 'in_review', 'accepted', 'placed', 'waitlisted', 'declined', 'discharged'].map((s) => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => { setStatusFilter(s); setPage(1) }}
                    className={`h-6 text-[11px] px-2 shrink-0 ${statusFilter === s ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                  >
                    {s === 'all' ? 'All' : statusLabels[s as ReferralStatus]}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-slate-100 mb-3">
              <HiOutlineDocumentText className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">No referral records</p>
            <p className="text-xs text-slate-400 mb-4 max-w-[260px]">
              Your referral history will appear here once clients are referred into the system.
            </p>
            <Button
              size="sm"
              className="gap-1.5 bg-teal-600 hover:bg-teal-700"
              onClick={onAddReferral}
            >
              <HiOutlineUserPlus className="w-4 h-4" />
              Add Referral
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="text-[11px] font-semibold text-slate-600">Client</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-600">Urgency</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-600">Referral Partner</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-600">Bed Type</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-600">Date Referred</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-600">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-slate-400 py-8">
                        No matching referrals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((r) => (
                      <TableRow key={r.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{r.firstName} {r.lastInitial}.</p>
                            {r.phone && <p className="text-[11px] text-slate-400">{r.phone}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {r.urgency ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${urgencyDots[r.urgency] || 'bg-slate-400'}`} />
                              <span className="text-xs capitalize text-slate-600">{r.urgency}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusStyles[r.status]}`}>
                            {statusLabels[r.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{r.referralPartner}</TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {r.bedType ? (bedTypeLabels[r.bedType] || r.bedType) : <span className="text-slate-400">--</span>}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(r.dateReferred).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {r.waitlistPriority > 0 ? `#${r.waitlistPriority}` : <span className="text-slate-400">--</span>}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-500">
                {filtered.length > 0
                  ? `${(page - 1) * PER_PAGE + 1}-${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`
                  : '0 results'}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-slate-200"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <HiOutlineChevronLeft className="w-3.5 h-3.5" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    className={`h-7 w-7 p-0 text-xs border-slate-200 ${page === i + 1 ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-slate-200"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <HiOutlineChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Referral } from './types'
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
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

interface ReferralTableProps {
  referrals: Referral[]
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-50 text-slate-500 border-slate-200',
}

const ITEMS_PER_PAGE = 5

export default function ReferralTable({ referrals }: ReferralTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = referrals.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Referral History</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search referrals..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="pl-8 h-8 text-sm w-48 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-1">
              <HiOutlineFunnel className="w-4 h-4 text-slate-400" />
              {['all', 'pending', 'contacted', 'converted', 'expired'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => { setStatusFilter(status); setCurrentPage(1) }}
                  className="h-7 text-xs capitalize px-2.5"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="text-xs font-semibold text-slate-600">Name</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Email</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Source</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-400 py-8">
                    No referrals found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((referral) => (
                  <TableRow key={referral.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-sm font-medium text-slate-900">{referral.name}</TableCell>
                    <TableCell className="text-sm text-slate-600">{referral.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs capitalize ${statusStyles[referral.status]}`}>
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{referral.source}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(referral.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">
                      {referral.reward > 0 ? (
                        <span className="text-emerald-600">${referral.reward}</span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-slate-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <HiOutlineChevronLeft className="w-3.5 h-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                className="h-7 w-7 p-0 text-xs border-slate-200"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-slate-200"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <HiOutlineChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

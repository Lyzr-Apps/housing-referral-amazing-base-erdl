'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HiOutlineUserPlus, HiOutlineCheck, HiOutlineExclamationCircle } from 'react-icons/hi2'

const REFERRAL_PARTNERS = [
  'Community Health Center',
  'County Social Services',
  'VA Medical Center',
  'Salvation Army',
  'St. Vincent de Paul',
  'Catholic Charities',
  'United Way 211',
  'Hospital Discharge Planning',
  'Mental Health Services',
  'Probation & Parole',
  'School District Liaison',
  'Street Outreach Team',
  'Self-Referral',
  'Other',
]

function getTodayISO() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

interface IntakeForm {
  firstName: string
  lastInitial: string
  phone: string
  dob: string
  referralPartner: string
  bedType: string
  urgency: string
  dateReferred: string
  status: string
  waitlistPriority: string
  staffNotes: string
  partnerNotes: string
}

const initialForm: IntakeForm = {
  firstName: '',
  lastInitial: '',
  phone: '',
  dob: '',
  referralPartner: '',
  bedType: '',
  urgency: '',
  dateReferred: getTodayISO(),
  status: 'new',
  waitlistPriority: '',
  staffNotes: '',
  partnerNotes: '',
}

interface ClientIntakeProps {
  onReferralCreated?: () => void
}

export default function ClientIntake({ onReferralCreated }: ClientIntakeProps) {
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<IntakeForm>({ ...initialForm })

  const handleChange = (field: keyof IntakeForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isValid = form.firstName && form.lastInitial && form.referralPartner

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || saving) return

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save referral')
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setForm({ ...initialForm, dateReferred: getTodayISO() })
        onReferralCreated?.()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to save referral')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineUserPlus className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-semibold text-slate-900">New Referral Intake</h3>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 mb-4">
            <HiOutlineExclamationCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Info */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Client Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-xs text-slate-600">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastInitial" className="text-xs text-slate-600">Last Initial *</Label>
                <Input
                  id="lastInitial"
                  placeholder="e.g. S"
                  maxLength={1}
                  value={form.lastInitial}
                  onChange={(e) => handleChange('lastInitial', e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <Label htmlFor="phone" className="text-xs text-slate-600">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dob" className="text-xs text-slate-600">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Referral Info */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Referral Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Referral Partner *</Label>
                <Select value={form.referralPartner} onValueChange={(v) => handleChange('referralPartner', v)}>
                  <SelectTrigger className="h-8 text-sm border-slate-200 mt-1">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFERRAL_PARTNERS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Bed Type Requested</Label>
                <Select value={form.bedType} onValueChange={(v) => handleChange('bedType', v)}>
                  <SelectTrigger className="h-8 text-sm border-slate-200 mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workforce">Workforce</SelectItem>
                    <SelectItem value="medical">Medical Step-Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <Label className="text-xs text-slate-600">Urgency Level</Label>
                <Select value={form.urgency} onValueChange={(v) => handleChange('urgency', v)}>
                  <SelectTrigger className="h-8 text-sm border-slate-200 mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateReferred" className="text-xs text-slate-600">Date Referred</Label>
                <Input
                  id="dateReferred"
                  type="date"
                  value={form.dateReferred}
                  onChange={(e) => handleChange('dateReferred', e.target.value)}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Status */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Status</Label>
                <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger className="h-8 text-sm border-slate-200 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="waitlistPriority" className="text-xs text-slate-600">Waitlist Priority</Label>
                <Input
                  id="waitlistPriority"
                  type="number"
                  min="1"
                  placeholder="Optional"
                  value={form.waitlistPriority}
                  onChange={(e) => handleChange('waitlistPriority', e.target.value)}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Notes */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="staffNotes" className="text-xs text-slate-600">Staff Notes <span className="text-slate-400">(internal only)</span></Label>
                <Textarea
                  id="staffNotes"
                  placeholder="Internal notes for case management staff..."
                  value={form.staffNotes}
                  onChange={(e) => handleChange('staffNotes', e.target.value)}
                  rows={2}
                  className="text-sm border-slate-200 resize-none mt-1"
                />
              </div>
              <div>
                <Label htmlFor="partnerNotes" className="text-xs text-slate-600">Partner Notes <span className="text-slate-400">(visible to referral partner)</span></Label>
                <Textarea
                  id="partnerNotes"
                  placeholder="Notes shared with the referring partner..."
                  value={form.partnerNotes}
                  onChange={(e) => handleChange('partnerNotes', e.target.value)}
                  rows={2}
                  className="text-sm border-slate-200 resize-none mt-1"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full gap-2 bg-teal-600 hover:bg-teal-700"
            disabled={!isValid || submitted || saving}
          >
            {submitted ? (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                Referral Saved
              </>
            ) : saving ? (
              'Saving...'
            ) : (
              <>
                <HiOutlineUserPlus className="w-4 h-4" />
                Submit Referral
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

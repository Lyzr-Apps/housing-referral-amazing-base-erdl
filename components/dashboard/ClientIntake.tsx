'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HiOutlineUserPlus, HiOutlineCheck } from 'react-icons/hi2'

export default function ClientIntake() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    clientName: '',
    age: '',
    gender: '',
    referredBy: '',
    referredFrom: '',
    urgency: '',
    needs: '',
    notes: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientName || !form.urgency) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ clientName: '', age: '', gender: '', referredBy: '', referredFrom: '', urgency: '', needs: '', notes: '' })
    }, 2000)
  }

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineUserPlus className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-semibold text-slate-900">New Referral Intake</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clientName" className="text-xs text-slate-600">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="Full name"
                value={form.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                className="h-8 text-sm border-slate-200 mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="age" className="text-xs text-slate-600">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="h-8 text-sm border-slate-200 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => handleChange('gender', v)}>
                  <SelectTrigger className="h-8 text-sm border-slate-200 mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="nonbinary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="referredBy" className="text-xs text-slate-600">Referred By</Label>
              <Input
                id="referredBy"
                placeholder="Name & role"
                value={form.referredBy}
                onChange={(e) => handleChange('referredBy', e.target.value)}
                className="h-8 text-sm border-slate-200 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="referredFrom" className="text-xs text-slate-600">Referring Agency</Label>
              <Input
                id="referredFrom"
                placeholder="Organization"
                value={form.referredFrom}
                onChange={(e) => handleChange('referredFrom', e.target.value)}
                className="h-8 text-sm border-slate-200 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-600">Urgency *</Label>
              <Select value={form.urgency} onValueChange={(v) => handleChange('urgency', v)}>
                <SelectTrigger className="h-8 text-sm border-slate-200 mt-1">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="needs" className="text-xs text-slate-600">Needs (comma-separated)</Label>
              <Input
                id="needs"
                placeholder="Shelter, Medical, etc."
                value={form.needs}
                onChange={(e) => handleChange('needs', e.target.value)}
                className="h-8 text-sm border-slate-200 mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs text-slate-600">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional context..."
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
              className="text-sm border-slate-200 resize-none mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2 bg-teal-600 hover:bg-teal-700"
            disabled={!form.clientName || !form.urgency || submitted}
          >
            {submitted ? (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                Referral Submitted
              </>
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

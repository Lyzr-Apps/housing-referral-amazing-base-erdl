'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HiOutlinePaperAirplane, HiOutlineCheck } from 'react-icons/hi2'

export default function InviteForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('Hey! I\'ve been using this amazing platform and thought you\'d love it too. Sign up with my referral link and we both get rewarded!')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setEmail('')
      setName('')
    }, 2000)
  }

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Invite Someone</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="invite-name" className="text-xs text-slate-600 mb-1">Name</Label>
              <Input
                id="invite-name"
                placeholder="Their name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="invite-email" className="text-xs text-slate-600 mb-1">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="their@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-sm border-slate-200"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="invite-message" className="text-xs text-slate-600 mb-1">Personal Message</Label>
            <Textarea
              id="invite-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="text-sm border-slate-200 resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={!email || !name || sent}
          >
            {sent ? (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                Invitation Sent
              </>
            ) : (
              <>
                <HiOutlinePaperAirplane className="w-4 h-4" />
                Send Invitation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

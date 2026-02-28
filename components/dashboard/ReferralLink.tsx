'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { copyToClipboard } from '@/lib/clipboard'
import { HiOutlineClipboardDocument, HiOutlineCheck, HiOutlineShare, HiOutlineEnvelope, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import { FaXTwitter } from 'react-icons/fa6'

export default function ReferralLink() {
  const [copied, setCopied] = useState(false)
  const referralLink = 'https://app.example.com/ref/USR-2847X'
  const referralCode = 'USR-2847X'

  const handleCopy = async () => {
    const success = await copyToClipboard(referralLink)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Your Referral Link</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Code: {referralCode}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            readOnly
            value={referralLink}
            className="text-sm bg-slate-50 border-slate-200 text-slate-700 font-mono"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 gap-1.5 border-slate-200"
          >
            {copied ? (
              <>
                <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <HiOutlineClipboardDocument className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 mr-1">Share via:</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200">
            <HiOutlineEnvelope className="w-4 h-4 text-slate-600" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200">
            <FaXTwitter className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200">
            <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-slate-600" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200">
            <HiOutlineShare className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

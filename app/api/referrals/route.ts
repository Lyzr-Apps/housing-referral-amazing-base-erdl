import { NextRequest, NextResponse } from 'next/server'
import { getAllReferrals, createReferral, updateReferralStatus } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const referrals = getAllReferrals()
    return NextResponse.json({ referrals })
  } catch (error: any) {
    console.error('GET /api/referrals error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.firstName || !body.lastInitial || !body.referralPartner) {
      return NextResponse.json(
        { error: 'firstName, lastInitial, and referralPartner are required' },
        { status: 400 }
      )
    }

    const referral = createReferral({
      firstName: body.firstName,
      lastInitial: body.lastInitial,
      phone: body.phone || '',
      dob: body.dob || '',
      referralPartner: body.referralPartner,
      bedType: body.bedType || '',
      urgency: body.urgency || '',
      dateReferred: body.dateReferred || new Date().toISOString().split('T')[0],
      status: body.status || 'new',
      waitlistPriority: body.waitlistPriority ? parseInt(body.waitlistPriority, 10) : 0,
      staffNotes: body.staffNotes || '',
      partnerNotes: body.partnerNotes || '',
    })

    return NextResponse.json({ referral }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/referrals error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }
    updateReferralStatus(body.id, body.status)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('PATCH /api/referrals error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

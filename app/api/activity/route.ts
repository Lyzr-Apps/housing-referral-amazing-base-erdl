import { NextResponse } from 'next/server'
import { getRecentActivity } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activities = getRecentActivity(20)
    return NextResponse.json({ activities })
  } catch (error: any) {
    console.error('GET /api/activity error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

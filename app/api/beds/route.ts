import { NextRequest, NextResponse } from 'next/server'
import { getAllBeds, createBed, createBedsBulk, updateBedStatus, deleteBed, deleteAllBeds } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const beds = getAllBeds()
    return NextResponse.json({ beds })
  } catch (error: any) {
    console.error('GET /api/beds error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Bulk create (used by "Create Default 12 Beds")
    if (body.bulk && Array.isArray(body.beds)) {
      // Clear existing beds first when doing bulk create
      deleteAllBeds()
      const beds = createBedsBulk(body.beds)
      return NextResponse.json({ beds }, { status: 201 })
    }

    // Single create
    if (!body.bedNumber || !body.facilityId || !body.facilityName) {
      return NextResponse.json(
        { error: 'bedNumber, facilityId, and facilityName are required' },
        { status: 400 }
      )
    }

    const bed = createBed({
      id: body.id,
      bedNumber: body.bedNumber,
      facilityId: body.facilityId,
      facilityName: body.facilityName,
      status: body.status || 'available',
    })

    return NextResponse.json({ bed }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/beds error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }
    updateBedStatus(body.id, body.status)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('PATCH /api/beds error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    deleteBed(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/beds error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { DatabaseSync } from 'node:sqlite'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'shelter.db')

// Ensure data directory exists
import fs from 'fs'
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let _db: DatabaseSync | null = null

export function getDb(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH)
    _db.exec('PRAGMA journal_mode = WAL')
    _db.exec('PRAGMA foreign_keys = ON')
    initTables(_db)
  }
  return _db
}

function initTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastInitial TEXT NOT NULL,
      phone TEXT DEFAULT '',
      dob TEXT DEFAULT '',
      referralPartner TEXT NOT NULL,
      bedType TEXT DEFAULT '',
      urgency TEXT DEFAULT '',
      dateReferred TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      waitlistPriority INTEGER DEFAULT 0,
      staffNotes TEXT DEFAULT '',
      partnerNotes TEXT DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS beds (
      id TEXT PRIMARY KEY,
      bedNumber TEXT NOT NULL,
      facilityId TEXT NOT NULL,
      facilityName TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      occupantName TEXT DEFAULT '',
      occupantId TEXT DEFAULT '',
      checkInDate TEXT DEFAULT '',
      expectedCheckout TEXT DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      time TEXT NOT NULL,
      facility TEXT DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}

// ── Referral helpers ──

export function getAllReferrals() {
  const db = getDb()
  return db.prepare('SELECT * FROM referrals ORDER BY createdAt DESC').all() as any[]
}

export function createReferral(data: {
  firstName: string
  lastInitial: string
  phone?: string
  dob?: string
  referralPartner: string
  bedType?: string
  urgency?: string
  dateReferred: string
  status?: string
  waitlistPriority?: number
  staffNotes?: string
  partnerNotes?: string
}) {
  const db = getDb()
  const id = `ref-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO referrals (id, firstName, lastInitial, phone, dob, referralPartner, bedType, urgency, dateReferred, status, waitlistPriority, staffNotes, partnerNotes, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    id,
    data.firstName,
    data.lastInitial,
    data.phone || '',
    data.dob || '',
    data.referralPartner,
    data.bedType || '',
    data.urgency || '',
    data.dateReferred,
    data.status || 'new',
    data.waitlistPriority || 0,
    data.staffNotes || '',
    data.partnerNotes || '',
    now,
    now
  )

  // Log activity
  addActivity('intake', `New referral: ${data.firstName} ${data.lastInitial}. from ${data.referralPartner}`, '')

  return { id, ...data, createdAt: now, updatedAt: now }
}

export function updateReferralStatus(id: string, status: string) {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare('UPDATE referrals SET status = ?, updatedAt = ? WHERE id = ?').run(status, now, id)
}

// ── Bed helpers ──

export function getAllBeds() {
  const db = getDb()
  return db.prepare('SELECT * FROM beds ORDER BY facilityId, bedNumber').all() as any[]
}

export function createBed(data: {
  id?: string
  bedNumber: string
  facilityId: string
  facilityName: string
  status?: string
}) {
  const db = getDb()
  const id = data.id || `bed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  db.prepare(`
    INSERT INTO beds (id, bedNumber, facilityId, facilityName, status, createdAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(id, data.bedNumber, data.facilityId, data.facilityName, data.status || 'available')

  return { id, ...data, status: data.status || 'available' }
}

export function createBedsBulk(bedsData: Array<{
  id: string
  bedNumber: string
  facilityId: string
  facilityName: string
  status: string
}>) {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO beds (id, bedNumber, facilityId, facilityName, status, createdAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `)

  for (const bed of bedsData) {
    stmt.run(bed.id, bed.bedNumber, bed.facilityId, bed.facilityName, bed.status)
  }

  addActivity('bed_update', `${bedsData.length} beds created`, '')
  return bedsData
}

export function updateBedStatus(id: string, status: string) {
  const db = getDb()
  db.prepare('UPDATE beds SET status = ? WHERE id = ?').run(status, id)
}

export function deleteBed(id: string) {
  const db = getDb()
  db.prepare('DELETE FROM beds WHERE id = ?').run(id)
}

export function deleteAllBeds() {
  const db = getDb()
  db.prepare('DELETE FROM beds').run()
}

// ── Activity helpers ──

export function addActivity(type: string, message: string, facility: string) {
  const db = getDb()
  const id = `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const now = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  db.prepare(`
    INSERT INTO activity (id, type, message, time, facility, createdAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(id, type, message, now, facility)
}

export function getRecentActivity(limit = 20) {
  const db = getDb()
  return db.prepare('SELECT * FROM activity ORDER BY createdAt DESC LIMIT ?').all(limit) as any[]
}

// ── Stats helpers ──

export function getDashboardStats() {
  const db = getDb()

  const totalReferrals = (db.prepare('SELECT COUNT(*) as cnt FROM referrals').get() as any).cnt
  const pendingReferrals = (db.prepare("SELECT COUNT(*) as cnt FROM referrals WHERE status IN ('new', 'in_review')").get() as any).cnt
  const waitlistedClients = (db.prepare("SELECT COUNT(*) as cnt FROM referrals WHERE status = 'waitlisted'").get() as any).cnt

  // Placed this week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoStr = weekAgo.toISOString()
  const placedThisWeek = (db.prepare("SELECT COUNT(*) as cnt FROM referrals WHERE status = 'placed' AND updatedAt >= ?").get(weekAgoStr) as any).cnt

  const totalBeds = (db.prepare('SELECT COUNT(*) as cnt FROM beds').get() as any).cnt
  const totalBedsAvailable = (db.prepare("SELECT COUNT(*) as cnt FROM beds WHERE status = 'available'").get() as any).cnt
  const occupiedBeds = (db.prepare("SELECT COUNT(*) as cnt FROM beds WHERE status = 'occupied'").get() as any).cnt
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  return {
    totalReferrals,
    pendingReferrals,
    placedThisWeek,
    totalBedsAvailable,
    totalBeds,
    occupancyRate,
    avgPlacementTime: totalReferrals > 0 ? '~3 days' : '--',
    waitlistedClients,
  }
}

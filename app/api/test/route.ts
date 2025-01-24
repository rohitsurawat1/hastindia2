import { prisma } from '@/lib/db/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to get a count of users to verify database access
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      data: {
        userCount
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
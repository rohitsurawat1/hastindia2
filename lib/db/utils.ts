import { prisma } from '.'

export async function connectToDatabase() {
  try {
    await prisma.$connect()
    return { success: true }
  } catch (error) {
    console.error('Failed to connect to database:', error)
    return { success: false, error }
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect()
    return { success: true }
  } catch (error) {
    console.error('Failed to disconnect from database:', error)
    return { success: false, error }
  }
}

export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    // Try a simple query
    await prisma.user.count()
    return { success: true }
  } catch (error) {
    console.error('Database check failed:', error)
    return { success: false, error }
  } finally {
    await prisma.$disconnect()
  }
}
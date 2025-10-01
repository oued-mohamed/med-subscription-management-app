import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Helper function to calculate end date based on subscription type
export function calculateEndDate(startDate: Date, subscriptionType: string): Date {
  const endDate = new Date(startDate)

  switch (subscriptionType) {
    case "Monthly":
      endDate.setMonth(endDate.getMonth() + 1)
      break
    case "3 Months":
      endDate.setMonth(endDate.getMonth() + 3)
      break
    case "Yearly":
      endDate.setFullYear(endDate.getFullYear() + 1)
      break
    default:
      throw new Error("Invalid subscription type")
  }

  return endDate
}

// Helper function to format date for SQL
export function formatDateForSQL(date: Date): string {
  return date.toISOString().split("T")[0]
}

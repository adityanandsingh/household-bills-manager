// Web Worker for offloading heavy calculations
// This file will be imported dynamically when needed

// Function to calculate bill statistics
export function calculateBillStatistics(bills: any[], paymentHistory: any[]) {
  // Get current date info
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Filter bills for current month
  const billsThisMonth = bills.filter((bill) => {
    const dueDate = new Date(bill.dueDate)
    return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear
  })

  // Calculate totals
  const totalDue = billsThisMonth.filter((bill) => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)

  const totalPaid = billsThisMonth.filter((bill) => bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)

  // Calculate bills by category
  const categorySummary = billsThisMonth.reduce((acc: any, bill) => {
    if (!acc[bill.category]) {
      acc[bill.category] = {
        total: 0,
        paid: 0,
        unpaid: 0,
      }
    }

    acc[bill.category].total += bill.amount

    if (bill.isPaid) {
      acc[bill.category].paid += bill.amount
    } else {
      acc[bill.category].unpaid += bill.amount
    }

    return acc
  }, {})

  // Calculate upcoming bills
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const upcomingBills = bills.filter((bill) => {
    if (bill.isPaid) return false

    const dueDate = new Date(bill.dueDate)
    return dueDate >= today && dueDate <= nextWeek
  })

  return {
    totalDue,
    totalPaid,
    categorySummary,
    upcomingBills,
  }
}

// Listen for messages from the main thread
self.addEventListener("message", (event) => {
  const { type, data } = event.data

  if (type === "calculateStatistics") {
    const result = calculateBillStatistics(data.bills, data.paymentHistory)
    self.postMessage({ type: "statisticsResult", data: result })
  }
})


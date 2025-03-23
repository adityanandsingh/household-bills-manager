"use client"

import { memo, useMemo } from "react"
import type { PaymentHistory } from "../../types"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MonthlyExpensesChartProps {
  paymentHistory: PaymentHistory[]
}

function MonthlyExpensesChartComponent({ paymentHistory }: MonthlyExpensesChartProps) {
  // Get the last 6 months of data - memoized to avoid recalculation
  const chartData = useMemo(() => {
    const today = new Date()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(today.getMonth() - i)
      return {
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        yearMonth: `${d.getFullYear()}-${d.getMonth().toString().padStart(2, "0")}`,
      }
    }).reverse()

    return last6Months.map((monthData) => {
      const monthPayments = paymentHistory.filter((payment) => {
        const paymentDate = new Date(payment.date)
        return paymentDate.getMonth() === monthData.monthIndex && paymentDate.getFullYear() === monthData.year
      })

      const total = monthPayments.reduce((sum, payment) => sum + payment.amount, 0)

      return {
        name: monthData.month,
        total: total,
      }
    })
  }, [paymentHistory])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Total"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const MonthlyExpensesChart = memo(MonthlyExpensesChartComponent)


"use client"

import { memo, useMemo } from "react"
import type { PaymentHistory } from "../types"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MonthlySpendingChartProps {
  paymentHistory: PaymentHistory[]
}

function MonthlySpendingChartComponent({ paymentHistory }: MonthlySpendingChartProps) {
  // Get the last 12 months of data - memoized to avoid recalculation
  const chartData = useMemo(() => {
    const today = new Date()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date()
      d.setMonth(today.getMonth() - i)
      return {
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        yearMonth: `${d.getFullYear()}-${d.getMonth().toString().padStart(2, "0")}`,
      }
    }).reverse()

    return last12Months.map((monthData) => {
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
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Total"]} />
        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const MonthlySpendingChart = memo(MonthlySpendingChartComponent)


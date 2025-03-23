"use client"

import { memo, useMemo } from "react"
import type { Category, PaymentHistory } from "../types"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface PaymentTrendsChartProps {
  paymentHistory: PaymentHistory[]
  categories: Category[]
}

function PaymentTrendsChartComponent({ paymentHistory, categories }: PaymentTrendsChartProps) {
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

    // Group payments by month and category
    return last6Months.map((monthData) => {
      const monthPayments = paymentHistory.filter((payment) => {
        const paymentDate = new Date(payment.date)
        return paymentDate.getMonth() === monthData.monthIndex && paymentDate.getFullYear() === monthData.year
      })

      const result: any = {
        name: monthData.month,
      }

      // Add category totals
      categories.forEach((category) => {
        const categoryPayments = monthPayments.filter((payment) => payment.category === category.name)
        const total = categoryPayments.reduce((sum, payment) => sum + payment.amount, 0)

        if (total > 0) {
          result[category.name] = total
        }
      })

      return result
    })
  }, [paymentHistory, categories])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
        <Legend />
        {categories.map((category) => (
          <Bar key={category.id} dataKey={category.name} stackId="a" fill={category.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const PaymentTrendsChart = memo(PaymentTrendsChartComponent)


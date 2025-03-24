"use client"

import { memo, useMemo } from "react"
import type { Bill, Category } from "../../types"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryBreakdownChartProps {
  bills: Bill[]
  categories: Category[]
}

function CategoryBreakdownChartComponent({ bills, categories }: CategoryBreakdownChartProps) {
  // Get current month bills and category totals - memoized to avoid recalculation
  const categoryTotals = useMemo(() => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const currentMonthBills = bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate)
      return dueDate >= startOfMonth && dueDate <= endOfMonth
    })

    // Group by category
    return categories
      .map((category) => {
        const categoryBills = currentMonthBills.filter((bill) => bill.category === category.name)
        const total = categoryBills.reduce((sum, bill) => sum + bill.amount, 0)

        return {
          name: category.name,
          value: total,
          color: category.color,
        }
      })
      .filter((category) => category.value > 0)
  }, [bills, categories])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryTotals}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {categoryTotals.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} labelFormatter={(label) => `Category: ${label}`} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const CategoryBreakdownChart = memo(CategoryBreakdownChartComponent)


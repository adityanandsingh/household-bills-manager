"use client"

import { memo } from "react"
import type { BudgetSummary } from "../../types"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BudgetVsActualChartProps {
  budgetSummaries: BudgetSummary[]
}

function BudgetVsActualChartComponent({ budgetSummaries }: BudgetVsActualChartProps) {
  // Filter out categories with no budget
  const filteredSummaries = budgetSummaries.filter((summary) => summary.budgeted > 0)

  // Format data for the chart
  const chartData = filteredSummaries.map((summary) => ({
    name: summary.category,
    budgeted: summary.budgeted,
    actual: summary.actual,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={100} />
        <Tooltip formatter={(value) => [`$${value}`, ""]} />
        <Bar dataKey="budgeted" name="Budgeted" fill="#8884d8" />
        <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(BudgetVsActualChartComponent)


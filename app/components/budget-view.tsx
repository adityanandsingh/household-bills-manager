"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bill, Category, PaymentHistory } from "../types"
import { BudgetSummaryTable } from "./budget-summary-table"
import dynamic from "next/dynamic"

// Dynamically import heavy chart components
const BudgetVsActualChart = dynamic(() => import("./budget-vs-actual-chart").then((mod) => mod.BudgetVsActualChart), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Loading chart...</div>,
})

const MonthlySpendingChart = dynamic(() => import("./monthly-spending-chart").then((mod) => mod.MonthlySpendingChart), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Loading chart...</div>,
})

interface BudgetViewProps {
  bills: Bill[]
  paymentHistory: PaymentHistory[]
  categories: Category[]
}

function BudgetViewComponent({ bills, paymentHistory, categories }: BudgetViewProps) {
  // Calculate budget summaries - memoized to avoid recalculation
  const budgetSummaries = useMemo(() => {
    return categories.map((category) => {
      const budgeted = category.budget || 0
      const actual = bills.filter((bill) => bill.category === category.name).reduce((sum, bill) => sum + bill.amount, 0)

      return {
        category: category.name,
        budgeted,
        actual,
        remaining: budgeted - actual,
      }
    })
  }, [categories, bills])

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Budget Analysis</h2>
        <p className="text-muted-foreground">Track your spending against your budget</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>Your budget vs. actual spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetSummaryTable budgetSummaries={budgetSummaries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual</CardTitle>
            <CardDescription>Comparison of budgeted and actual spending</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BudgetVsActualChart budgetSummaries={budgetSummaries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your spending trends over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <MonthlySpendingChart paymentHistory={paymentHistory} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const BudgetView = memo(BudgetViewComponent)
export default BudgetView


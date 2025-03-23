"use client"

import type { BudgetSummary } from "../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface BudgetSummaryTableProps {
  budgetSummaries: BudgetSummary[]
}

export function BudgetSummaryTable({ budgetSummaries }: BudgetSummaryTableProps) {
  // Sort by highest percentage used
  const sortedSummaries = [...budgetSummaries]
    .filter((summary) => summary.budgeted > 0)
    .sort((a, b) => b.actual / b.budgeted - a.actual / a.budgeted)

  if (sortedSummaries.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No budget data available</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Budgeted</TableHead>
          <TableHead>Actual</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedSummaries.map((summary) => {
          const percentUsed = summary.budgeted > 0 ? (summary.actual / summary.budgeted) * 100 : 0

          return (
            <TableRow key={summary.category}>
              <TableCell>{summary.category}</TableCell>
              <TableCell>${summary.budgeted.toFixed(2)}</TableCell>
              <TableCell>${summary.actual.toFixed(2)}</TableCell>
              <TableCell className={cn(summary.remaining < 0 ? "text-destructive font-medium" : "")}>
                ${summary.remaining.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={Math.min(percentUsed, 100)}
                    className={cn("h-2", percentUsed > 90 ? "bg-destructive/20" : "bg-primary/20")}
                    indicatorClassName={cn(percentUsed > 90 ? "bg-destructive" : "bg-primary")}
                  />
                  <span className="text-xs w-10">{percentUsed.toFixed(0)}%</span>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}


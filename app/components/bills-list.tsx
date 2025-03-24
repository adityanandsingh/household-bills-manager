"use client"

import { memo, useMemo } from "react"
import type { Bill, Category } from "../types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface BillsListProps {
  bills: Bill[]
  categories: Category[]
  onUpdateStatus: (id: string, isPaid: boolean) => void
  onDeleteBill: (id: string) => void
}

function BillsListComponent({ bills, categories, onUpdateStatus, onDeleteBill }: BillsListProps) {
  // Sort bills by due date - memoized to avoid recalculation
  const sortedBills = useMemo(() => {
    return [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [bills])

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
        <p className="text-muted-foreground">No bills to display</p>
      </div>
    )
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-4">
      {sortedBills.map((bill) => {
        const category = categories.find((c) => c.name === bill.category)
        const daysUntilDue = getDaysUntilDue(bill.dueDate)

        return (
          <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
            <div className="flex items-start gap-2">
              <div>
                <p className="font-medium">{bill.name}</p>
                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-1">
                  <p>Due {format(new Date(bill.dueDate), "MMM d, yyyy")}</p>
                  <Badge
                    variant="outline"
                    className="ml-0 sm:ml-2"
                    style={{ borderColor: category?.color, color: category?.color }}
                  >
                    {bill.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              <p className="font-bold">${bill.amount.toFixed(2)}</p>
              {!bill.isPaid && daysUntilDue > 0 && (
                <Badge
                  className={cn(
                    "flex items-center gap-1",
                    daysUntilDue <= 3 ? "bg-destructive" : daysUntilDue <= 7 ? "bg-amber-500" : "bg-emerald-500",
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {daysUntilDue} days
                </Badge>
              )}
              {!bill.isPaid && daysUntilDue <= 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  Overdue
                </Badge>
              )}
              <Button
                variant={bill.isPaid ? "outline" : "default"}
                size="sm"
                onClick={() => onUpdateStatus(bill.id, !bill.isPaid)}
              >
                {bill.isPaid ? "Mark Unpaid" : "Pay"}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDeleteBill(bill.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const BillsList = memo(BillsListComponent)


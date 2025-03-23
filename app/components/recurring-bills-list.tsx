"use client"

import type { Bill, Category } from "../types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, RefreshCw, Trash2 } from "lucide-react"

interface RecurringBillsListProps {
  bills: Bill[]
  categories: Category[]
  onUpdateStatus: (id: string, isPaid: boolean) => void
  onDeleteBill: (id: string) => void
}

export function RecurringBillsList({ bills, categories, onUpdateStatus, onDeleteBill }: RecurringBillsListProps) {
  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
        <p className="text-muted-foreground">No recurring bills set up</p>
      </div>
    )
  }

  // Sort bills by due date
  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const getRecurringText = (bill: Bill) => {
    if (!bill.isRecurring) return ""

    switch (bill.recurringFrequency) {
      case "weekly":
        return "Weekly"
      case "monthly":
        return `Monthly on day ${bill.recurringDay}`
      case "quarterly":
        return "Every 3 months"
      case "yearly":
        return "Yearly"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      {sortedBills.map((bill) => {
        const category = categories.find((c) => c.name === bill.category)

        return (
          <div key={bill.id} className="flex items-center justify-between border-b pb-3">
            <div className="flex items-start gap-2">
              <div className="text-primary">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{bill.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <p>Next due {format(new Date(bill.dueDate), "MMM d, yyyy")}</p>
                  <Badge
                    variant="outline"
                    className="ml-2"
                    style={{ borderColor: category?.color, color: category?.color }}
                  >
                    {bill.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{getRecurringText(bill)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold">${bill.amount.toFixed(2)}</p>
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


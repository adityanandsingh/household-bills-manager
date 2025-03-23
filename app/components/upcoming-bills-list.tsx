"use client"

import type { Bill } from "../types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo } from "react"

interface UpcomingBillsListProps {
  bills: Bill[]
}

function UpcomingBillsListComponent({ bills }: UpcomingBillsListProps) {
  // Get upcoming bills (due in the next 30 days and not paid)
  const today = new Date()
  const in30Days = new Date(today)
  in30Days.setDate(today.getDate() + 30)

  const upcomingBills = bills
    .filter((bill) => {
      if (bill.isPaid) return false

      const dueDate = new Date(bill.dueDate)
      return dueDate >= today && dueDate <= in30Days
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getBillStatusColor = (dueDate: string) => {
    const daysUntilDue = getDaysUntilDue(dueDate)
    if (daysUntilDue <= 3) return "text-destructive"
    if (daysUntilDue <= 7) return "text-amber-500"
    return "text-emerald-500"
  }

  if (upcomingBills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
        <p className="text-muted-foreground">No upcoming bills for the next 30 days</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {upcomingBills.map((bill) => (
        <div key={bill.id} className="flex items-center justify-between border-b pb-3">
          <div className="flex items-start gap-2">
            <div className={cn("mt-0.5", getBillStatusColor(bill.dueDate))}>
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{bill.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <p>Due {format(new Date(bill.dueDate), "MMM d, yyyy")}</p>
                <Badge variant="outline" className="ml-2">
                  {bill.category}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold">${bill.amount.toFixed(2)}</p>
            <Badge
              className={cn(
                "flex items-center gap-1",
                getDaysUntilDue(bill.dueDate) <= 3
                  ? "bg-destructive"
                  : getDaysUntilDue(bill.dueDate) <= 7
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
            >
              <Clock className="h-3 w-3" />
              {getDaysUntilDue(bill.dueDate)} days
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

export const UpcomingBillsList = memo(UpcomingBillsListComponent)


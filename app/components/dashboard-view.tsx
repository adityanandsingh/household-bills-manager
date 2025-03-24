"use client"

import { memo, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bill, Category, PaymentHistory, Reminder } from "../types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BellRing, CreditCard, DollarSign, Home, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UpcomingBillsList } from "./upcoming-bills-list"
import { RemindersList } from "./reminders-list"
import { AddReminderDialog } from "./add-reminder-dialog"
import { MonthlyExpensesChart } from "./charts/monthly-expenses-chart"
import { CategoryBreakdownChart } from "./charts/category-breakdown-chart"

interface DashboardViewProps {
  bills: Bill[]
  categories: Category[]
  paymentHistory: PaymentHistory[]
  reminders: Reminder[]
  onAddReminder: (reminder: Omit<Reminder, "id">) => void
}

function DashboardViewComponent({ bills, categories, paymentHistory, reminders, onAddReminder }: DashboardViewProps) {
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false)

  // Memoize expensive calculations
  const { billsDueThisMonth, totalDue, billsDueSoon, paidThisMonth, totalPaid, upcomingReminders, housingPercentage } =
    useMemo(() => {
      // Calculate total bills due this month
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      const billsDueThisMonth = bills.filter((bill) => {
        const dueDate = new Date(bill.dueDate)
        return dueDate >= startOfMonth && dueDate <= endOfMonth && !bill.isPaid
      })

      const totalDue = billsDueThisMonth.reduce((sum, bill) => sum + bill.amount, 0)

      // Calculate bills due soon (next 7 days)
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)

      const billsDueSoon = bills.filter((bill) => {
        const dueDate = new Date(bill.dueDate)
        return dueDate >= today && dueDate <= nextWeek && !bill.isPaid
      })

      // Calculate total paid this month
      const paidThisMonth = paymentHistory.filter((payment) => {
        const paymentDate = new Date(payment.date)
        return paymentDate >= startOfMonth && paymentDate <= endOfMonth
      })

      const totalPaid = paidThisMonth.reduce((sum, payment) => sum + payment.amount, 0)

      // Get upcoming reminders
      const upcomingReminders = reminders
        .filter((reminder) => {
          const reminderDate = new Date(reminder.date)
          return reminderDate >= today && !reminder.isCompleted
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Calculate housing percentage
      const housingTotal = bills
        .filter((bill) => bill.category === "Housing")
        .reduce((sum, bill) => sum + bill.amount, 0)
      const housingPercentage = totalDue > 0 ? ((housingTotal / totalDue) * 100).toFixed(0) : "0"

      return {
        billsDueThisMonth,
        totalDue,
        billsDueSoon,
        paidThisMonth,
        totalPaid,
        upcomingReminders,
        housingPercentage,
      }
    }, [bills, paymentHistory, reminders])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Due This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalDue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{billsDueThisMonth.length} bills remaining</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{paidThisMonth.length} payments made</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Housing</div>
          <p className="text-xs text-muted-foreground">{housingPercentage}% of monthly expenses</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Bills</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{billsDueSoon.length}</div>
          <p className="text-xs text-muted-foreground">Due in the next 7 days</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Your spending over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px]">
            <MonthlyExpensesChart paymentHistory={paymentHistory} />
          </div>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Current month expenses by category</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px]">
            <CategoryBreakdownChart bills={bills} categories={categories} />
          </div>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Bills</CardTitle>
            <CardDescription>Bills due in the next 30 days</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <UpcomingBillsList bills={bills} />
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reminders</CardTitle>
            <CardDescription>Your upcoming reminders</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsAddReminderOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <RemindersList reminders={upcomingReminders} />
        </CardContent>
      </Card>

      {billsDueSoon.length > 0 && (
        <Card className="sm:col-span-2 lg:col-span-4 shadow-sm">
          <CardHeader>
            <Alert variant="destructive">
              <BellRing className="h-4 w-4" />
              <AlertTitle>Attention Required</AlertTitle>
              <AlertDescription>
                You have {billsDueSoon.length} bill{billsDueSoon.length > 1 ? "s" : ""} due in the next 7 days totaling
                ${billsDueSoon.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}.
              </AlertDescription>
            </Alert>
          </CardHeader>
        </Card>
      )}

      <AddReminderDialog
        open={isAddReminderOpen}
        onOpenChange={setIsAddReminderOpen}
        onAddReminder={onAddReminder}
        bills={bills}
      />
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(DashboardViewComponent)


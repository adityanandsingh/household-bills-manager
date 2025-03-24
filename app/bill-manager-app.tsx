"use client"

import { useState, useEffect, lazy, Suspense, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import type { Bill, Category, PaymentHistory, Reminder, User } from "./types"
import { initialBills, initialCategories, initialPaymentHistory, initialReminders, initialUsers } from "./data"
import { LoadingSpinner } from "./components/loading-spinner"

// Import main views directly to avoid lazy loading the most common views
import DashboardView from "./components/dashboard-view"
import BillsView from "./components/bills-view"

// Lazy load less frequently accessed views
const PaymentHistoryView = lazy(() => import("./components/payment-history-view"))
const DocumentsView = lazy(() => import("./components/documents-view"))
const BudgetView = lazy(() => import("./components/budget-view"))
const SettingsView = lazy(() => import("./components/settings-view"))

export default function BillManagerApp() {
  // State management for all app data
  const [bills, setBills] = useState<Bill[]>(initialBills)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>(initialPaymentHistory)
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  const [users] = useState<User[]>(initialUsers)
  const [currentUser] = useState<User>(initialUsers[0])
  const [activeTab, setActiveTab] = useState("dashboard")

  const { toast } = useToast()

  // Check for due bills and show alerts - optimized with useCallback
  useEffect(() => {
    // Defer non-critical work
    const timeoutId = setTimeout(() => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const dueBills = bills.filter((bill) => {
        if (bill.isPaid) return false

        const dueDate = new Date(bill.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return diffDays <= 3 && diffDays >= 0
      })

      if (dueBills.length > 0) {
        toast({
          title: "Bills Due Soon",
          description: `You have ${dueBills.length} bill${dueBills.length > 1 ? "s" : ""} due in the next 3 days.`,
          variant: "destructive",
        })
      }
    }, 2000) // Delay by 2 seconds to prioritize rendering

    return () => clearTimeout(timeoutId)
  }, [bills, toast])

  // Add a new bill - optimized with useCallback
  const addBill = useCallback(
    (bill: Omit<Bill, "id">) => {
      const newBill: Bill = {
        ...bill,
        id: crypto.randomUUID(),
      }
      setBills((prevBills) => [...prevBills, newBill])

      toast({
        title: "Bill Added",
        description: `${bill.name} has been added to your bills.`,
      })
    },
    [toast],
  )

  // Update bill payment status - optimized with useCallback
  const updateBillStatus = useCallback(
    (id: string, isPaid: boolean) => {
      setBills((prevBills) => prevBills.map((bill) => (bill.id === id ? { ...bill, isPaid } : bill)))

      if (isPaid) {
        const bill = bills.find((b) => b.id === id)
        if (bill) {
          const newPayment: PaymentHistory = {
            id: crypto.randomUUID(),
            billId: id,
            billName: bill.name,
            amount: bill.amount,
            date: new Date().toISOString(),
            category: bill.category,
          }
          setPaymentHistory((prevHistory) => [...prevHistory, newPayment])

          toast({
            title: "Payment Recorded",
            description: `Payment for ${bill.name} has been recorded.`,
          })
        }
      }
    },
    [bills, toast],
  )

  // Add a new category - optimized with useCallback
  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    }
    setCategories((prevCategories) => [...prevCategories, newCategory])
  }, [])

  // Add a new reminder - optimized with useCallback
  const addReminder = useCallback(
    (reminder: Omit<Reminder, "id">) => {
      const newReminder: Reminder = {
        ...reminder,
        id: crypto.randomUUID(),
      }
      setReminders((prevReminders) => [...prevReminders, newReminder])

      toast({
        title: "Reminder Set",
        description: `Reminder for ${reminder.title} has been set.`,
      })
    },
    [toast],
  )

  // Delete a bill - optimized with useCallback
  const deleteBill = useCallback(
    (id: string) => {
      setBills((prevBills) => prevBills.filter((bill) => bill.id !== id))

      toast({
        title: "Bill Deleted",
        description: "The bill has been deleted.",
      })
    },
    [toast],
  )

  return (
    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="overflow-auto pb-2">
        <TabsList className="inline-flex h-auto p-1 w-full max-w-3xl">
          <TabsTrigger value="dashboard" className="flex-1 py-2 px-3">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="bills" className="flex-1 py-2 px-3">
            Bills
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 py-2 px-3">
            History
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 py-2 px-3">
            Documents
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex-1 py-2 px-3">
            Budget
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 py-2 px-3">
            Settings
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="dashboard" className="mt-0">
        <DashboardView
          bills={bills}
          categories={categories}
          paymentHistory={paymentHistory}
          reminders={reminders}
          onAddReminder={addReminder}
        />
      </TabsContent>
      <TabsContent value="bills" className="mt-0">
        <BillsView
          bills={bills}
          categories={categories}
          onAddBill={addBill}
          onUpdateBillStatus={updateBillStatus}
          onDeleteBill={deleteBill}
          onAddCategory={addCategory}
        />
      </TabsContent>

      {/* Lazy load less frequently accessed views */}
      <TabsContent value="history" className="mt-0">
        <Suspense fallback={<LoadingSpinner />}>
          <PaymentHistoryView paymentHistory={paymentHistory} categories={categories} />
        </Suspense>
      </TabsContent>
      <TabsContent value="documents" className="mt-0">
        <Suspense fallback={<LoadingSpinner />}>
          <DocumentsView bills={bills} />
        </Suspense>
      </TabsContent>
      <TabsContent value="budget" className="mt-0">
        <Suspense fallback={<LoadingSpinner />}>
          <BudgetView bills={bills} paymentHistory={paymentHistory} categories={categories} />
        </Suspense>
      </TabsContent>
      <TabsContent value="settings" className="mt-0">
        <Suspense fallback={<LoadingSpinner />}>
          <SettingsView
            categories={categories}
            onAddCategory={addCategory}
            reminders={reminders}
            onAddReminder={addReminder}
            currentUser={currentUser}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}


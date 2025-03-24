"use client"

import { memo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bill, Category } from "../types"
import { Plus } from "lucide-react"
import { AddBillDialog } from "./add-bill-dialog"
import { BillsList } from "./bills-list"
import { AddCategoryDialog } from "./add-category-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecurringBillsList } from "./recurring-bills-list"

interface BillsViewProps {
  bills: Bill[]
  categories: Category[]
  onAddBill: (bill: Omit<Bill, "id">) => void
  onUpdateBillStatus: (id: string, isPaid: boolean) => void
  onDeleteBill: (id: string) => void
  onAddCategory: (category: Omit<Category, "id">) => void
}

function BillsViewComponent({
  bills,
  categories,
  onAddBill,
  onUpdateBillStatus,
  onDeleteBill,
  onAddCategory,
}: BillsViewProps) {
  const [isAddBillOpen, setIsAddBillOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  // Filter bills - moved inside component to avoid recalculation on every render
  const unpaidBills = bills.filter((bill) => !bill.isPaid)
  const paidBills = bills.filter((bill) => bill.isPaid)
  const recurringBills = bills.filter((bill) => bill.isRecurring)

  return (
    <div className="grid gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bills</h2>
          <p className="text-muted-foreground">Manage your household bills and recurring payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Category
          </Button>
          <Button onClick={() => setIsAddBillOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Bill
          </Button>
        </div>
      </div>

      <Tabs defaultValue="unpaid">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="unpaid" className="flex-1">
            Unpaid Bills
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex-1">
            Paid Bills
          </TabsTrigger>
          <TabsTrigger value="recurring" className="flex-1">
            Recurring Bills
          </TabsTrigger>
        </TabsList>
        <TabsContent value="unpaid">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Unpaid Bills</CardTitle>
              <CardDescription>Bills that need to be paid</CardDescription>
            </CardHeader>
            <CardContent>
              <BillsList
                bills={unpaidBills}
                categories={categories}
                onUpdateStatus={onUpdateBillStatus}
                onDeleteBill={onDeleteBill}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paid">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Paid Bills</CardTitle>
              <CardDescription>Bills that have been paid</CardDescription>
            </CardHeader>
            <CardContent>
              <BillsList
                bills={paidBills}
                categories={categories}
                onUpdateStatus={onUpdateBillStatus}
                onDeleteBill={onDeleteBill}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recurring">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recurring Bills</CardTitle>
              <CardDescription>Bills that repeat on a schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <RecurringBillsList
                bills={recurringBills}
                categories={categories}
                onUpdateStatus={onUpdateBillStatus}
                onDeleteBill={onDeleteBill}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddBillDialog
        open={isAddBillOpen}
        onOpenChange={setIsAddBillOpen}
        onAddBill={onAddBill}
        categories={categories}
      />

      <AddCategoryDialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen} onAddCategory={onAddCategory} />
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(BillsViewComponent)


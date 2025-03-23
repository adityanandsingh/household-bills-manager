"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Bill, Category } from "../types"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface AddBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddBill: (bill: Omit<Bill, "id">) => void
  categories: Category[]
}

export function AddBillDialog({ open, onOpenChange, onAddBill, categories }: AddBillDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [category, setCategory] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly")
  const [recurringDay, setRecurringDay] = useState<number | undefined>(undefined)
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    if (!name || !amount || !dueDate || !category) return

    onAddBill({
      name,
      amount: Number.parseFloat(amount),
      dueDate: dueDate.toISOString(),
      category,
      isPaid: false,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      recurringDay: isRecurring ? recurringDay : undefined,
      notes: notes || undefined,
      documents: [],
    })

    // Reset form
    setName("")
    setAmount("")
    setDueDate(undefined)
    setCategory("")
    setIsRecurring(false)
    setRecurringFrequency("monthly")
    setRecurringDay(undefined)
    setNotes("")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Bill</DialogTitle>
          <DialogDescription>Add a new bill to track</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Bill Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rent, Electricity"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
            <Label htmlFor="recurring">This is a recurring bill</Label>
          </div>
          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={recurringFrequency} onValueChange={(value) => setRecurringFrequency(value as any)}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {recurringFrequency === "monthly" && (
                <div className="grid gap-2">
                  <Label htmlFor="day">Day of Month</Label>
                  <Input
                    id="day"
                    type="number"
                    min="1"
                    max="31"
                    value={recurringDay || ""}
                    onChange={(e) => setRecurringDay(Number.parseInt(e.target.value))}
                    placeholder="e.g., 1, 15"
                  />
                </div>
              )}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Bill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


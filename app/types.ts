export interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  isPaid: boolean
  isRecurring: boolean
  recurringFrequency?: "weekly" | "monthly" | "quarterly" | "yearly"
  recurringDay?: number
  notes?: string
  documents?: Document[]
  sharedWith?: string[]
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
  budget?: number
}

export interface PaymentHistory {
  id: string
  billId: string
  billName: string
  amount: number
  date: string
  category: string
  paymentMethod?: string
  notes?: string
}

export interface Document {
  id: string
  billId: string
  name: string
  type: string
  size: number
  url: string
  uploadDate: string
  uploadedBy: string
}

export interface Reminder {
  id: string
  title: string
  description?: string
  date: string
  billId?: string
  isCompleted: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "owner" | "editor" | "viewer"
}

export interface BudgetSummary {
  category: string
  budgeted: number
  actual: number
  remaining: number
}


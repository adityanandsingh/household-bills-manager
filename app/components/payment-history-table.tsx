"use client"

import type { Category, PaymentHistory } from "../types"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface PaymentHistoryTableProps {
  paymentHistory: PaymentHistory[]
  categories: Category[]
}

export function PaymentHistoryTable({ paymentHistory, categories }: PaymentHistoryTableProps) {
  if (paymentHistory.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No payment history available</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Bill</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentHistory.map((payment) => {
          const category = categories.find((c) => c.name === payment.category)

          return (
            <TableRow key={payment.id}>
              <TableCell>{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{payment.billName}</TableCell>
              <TableCell>
                <Badge variant="outline" style={{ borderColor: category?.color, color: category?.color }}>
                  {payment.category}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.paymentMethod || "—"}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}


"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, PaymentHistory } from "../types"
import dynamic from "next/dynamic"
import { PaymentHistoryTable } from "./payment-history-table"

// Dynamically import heavy chart components
const PaymentTrendsChart = dynamic(() => import("./payment-trends-chart").then((mod) => mod.PaymentTrendsChart), {
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center">Loading chart...</div>,
})

interface PaymentHistoryViewProps {
  paymentHistory: PaymentHistory[]
  categories: Category[]
}

function PaymentHistoryViewComponent({ paymentHistory, categories }: PaymentHistoryViewProps) {
  // Sort payment history by date (newest first) - memoized to avoid recalculation
  const sortedHistory = useMemo(() => {
    return [...paymentHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [paymentHistory])

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
        <p className="text-muted-foreground">View and analyze your payment history</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your most recent bill payments</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentHistoryTable paymentHistory={sortedHistory} categories={categories} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
            <CardDescription>Monthly payment trends by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <PaymentTrendsChart paymentHistory={paymentHistory} categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const PaymentHistoryView = memo(PaymentHistoryViewComponent)
export default PaymentHistoryView


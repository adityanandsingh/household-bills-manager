import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import BillManagerApp from "./bill-manager-app"
import { LoadingSpinner } from "./components/loading-spinner"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Household Bill Manager</h1>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <BillManagerApp />
        </Suspense>
      </div>
      <Toaster />
    </div>
  )
}


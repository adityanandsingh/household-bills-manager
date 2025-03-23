"use client"

import { memo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bill } from "../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Dynamically import components that might not be needed immediately
const FileUploadArea = dynamic(() => import("./file-upload-area").then((mod) => mod.FileUploadArea), {
  loading: () => <div className="p-4 text-center">Loading upload area...</div>,
})

const DocumentsList = dynamic(() => import("./documents-list").then((mod) => mod.DocumentsList), {
  loading: () => <div className="p-4 text-center">Loading documents...</div>,
})

interface DocumentsViewProps {
  bills: Bill[]
}

function DocumentsViewComponent({ bills }: DocumentsViewProps) {
  const [activeTab, setActiveTab] = useState("upload")

  // Get all bills with documents - moved inside component to avoid recalculation
  const billsWithDocuments = bills.filter((bill) => bill.documents && bill.documents.length > 0)

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
        <p className="text-muted-foreground">Upload and manage receipts and other bill-related documents</p>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Upload receipts, invoices, or other bill-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea bills={bills} onSuccess={() => setActiveTab("documents")} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>View and manage your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsList bills={billsWithDocuments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const DocumentsView = memo(DocumentsViewComponent)
export default DocumentsView


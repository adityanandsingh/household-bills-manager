"use client"

import type { Bill } from "../types"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText } from "lucide-react"

interface DocumentsListProps {
  bills: Bill[]
}

export function DocumentsList({ bills }: DocumentsListProps) {
  // Flatten all documents from all bills
  const allDocuments = bills.flatMap((bill) =>
    (bill.documents || []).map((doc) => ({
      ...doc,
      billName: bill.name,
    })),
  )

  if (allDocuments.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No documents uploaded yet</p>
      </div>
    )
  }

  // Sort documents by upload date (newest first)
  const sortedDocuments = [...allDocuments].sort(
    (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Bill</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedDocuments.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {doc.name}
            </TableCell>
            <TableCell>{doc.billName}</TableCell>
            <TableCell>{format(new Date(doc.uploadDate), "MMM d, yyyy")}</TableCell>
            <TableCell>{formatFileSize(doc.size)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


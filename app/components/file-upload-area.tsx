"use client"

import type React from "react"

import type { Bill } from "../types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { FileUp, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface FileUploadAreaProps {
  bills: Bill[]
  onSuccess: () => void
}

export function FileUploadArea({ bills, onSuccess }: FileUploadAreaProps) {
  const [selectedBill, setSelectedBill] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedBill || !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please select a bill and file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
      })
      setSelectedBill("")
      setSelectedFile(null)
      onSuccess()
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="bill">Select Bill</Label>
        <Select value={selectedBill} onValueChange={setSelectedBill}>
          <SelectTrigger id="bill">
            <SelectValue placeholder="Select a bill" />
          </SelectTrigger>
          <SelectContent>
            {bills.map((bill) => (
              <SelectItem key={bill.id} value={bill.id}>
                {bill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="file">Upload Receipt or Document</Label>
        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
          <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
          <Input id="file" type="file" className="hidden" onChange={handleFileChange} />
          <Button variant="outline" onClick={() => document.getElementById("file")?.click()}>
            Browse Files
          </Button>
          {selectedFile && (
            <div className="mt-4 text-sm">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </div>

      <Button className="w-full" onClick={handleUpload} disabled={!selectedBill || !selectedFile || isUploading}>
        {isUploading ? (
          <>Uploading...</>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </>
        )}
      </Button>
    </div>
  )
}


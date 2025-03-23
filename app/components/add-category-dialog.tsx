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
import type { Category } from "../types"
import { useState } from "react"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCategory: (category: Omit<Category, "id">) => void
}

export function AddCategoryDialog({ open, onOpenChange, onAddCategory }: AddCategoryDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#4f46e5")
  const [budget, setBudget] = useState("")

  const handleSubmit = () => {
    if (!name || !color) return

    onAddCategory({
      name,
      color,
      budget: budget ? Number.parseFloat(budget) : undefined,
    })

    // Reset form
    setName("")
    setColor("#4f46e5")
    setBudget("")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>Create a new category for organizing your bills</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Utilities, Entertainment"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#HEX" className="flex-1" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="budget">Monthly Budget (optional)</Label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import type { Category } from "../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CategoriesListProps {
  categories: Category[]
}

export function CategoriesList({ categories }: CategoriesListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No categories available</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Color</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
            </TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.budget ? `$${category.budget.toFixed(2)}` : "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


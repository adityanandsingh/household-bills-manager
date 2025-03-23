"use client"

import { memo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, Reminder, User } from "../types"
import { Plus } from "lucide-react"
import { AddCategoryDialog } from "./add-category-dialog"
import { CategoriesList } from "./categories-list"
import { AddReminderDialog } from "./add-reminder-dialog"
import { RemindersList } from "./reminders-list"
import dynamic from "next/dynamic"

// Dynamically import components that might not be needed immediately
const UserSettings = dynamic(() => import("./user-settings").then((mod) => mod.UserSettings), {
  loading: () => <div className="p-4 text-center">Loading user settings...</div>,
})

interface SettingsViewProps {
  categories: Category[]
  onAddCategory: (category: Omit<Category, "id">) => void
  reminders: Reminder[]
  onAddReminder: (reminder: Omit<Reminder, "id">) => void
  currentUser: User
}

function SettingsViewComponent({
  categories,
  onAddCategory,
  reminders,
  onAddReminder,
  currentUser,
}: SettingsViewProps) {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false)

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage bill categories</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <CategoriesList categories={categories} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reminders</CardTitle>
              <CardDescription>Manage your reminders</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsAddReminderOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <RemindersList reminders={reminders} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <UserSettings currentUser={currentUser} />
          </CardContent>
        </Card>
      </div>

      <AddCategoryDialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen} onAddCategory={onAddCategory} />

      <AddReminderDialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen} onAddReminder={onAddReminder} />
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const SettingsView = memo(SettingsViewComponent)
export default SettingsView


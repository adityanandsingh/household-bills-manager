"use client"

import type { Reminder } from "../types"
import { format } from "date-fns"
import { Bell, CheckCircle2 } from "lucide-react"

interface RemindersListProps {
  reminders: Reminder[]
}

export function RemindersList({ reminders }: RemindersListProps) {
  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
        <p className="text-muted-foreground">No reminders set</p>
      </div>
    )
  }

  // Sort reminders by date
  const sortedReminders = [...reminders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-4">
      {sortedReminders.map((reminder) => (
        <div key={reminder.id} className="flex items-start gap-3 border-b pb-3">
          <div className="mt-0.5 text-amber-500">
            <Bell className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{reminder.title}</p>
            {reminder.description && <p className="text-sm text-muted-foreground">{reminder.description}</p>}
            <p className="text-sm text-muted-foreground mt-1">{format(new Date(reminder.date), "MMM d, yyyy")}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


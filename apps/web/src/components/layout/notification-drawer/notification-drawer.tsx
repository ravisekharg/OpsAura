"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useNotificationStore } from "@/store/notification-store"
import { NotificationItem } from "./notification-item"

export function NotificationDrawer() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  const latest = notifications.slice(0, 5)

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>

      <SheetContent side="right">
        <SheetHeader>
          <div className="flex items-center justify-between pr-6">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
        </SheetHeader>

        <SheetBody>
          <ScrollArea className="h-full">
            {latest.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bell className="h-8 w-8 mb-3 opacity-30" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5 pb-4">
                {latest.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetBody>

        <SheetFooter>
          <Link
            href="/notifications/history"
            className="text-xs text-primary hover:underline"
          >
            View all notifications
          </Link>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

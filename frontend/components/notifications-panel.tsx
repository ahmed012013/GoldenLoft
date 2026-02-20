"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { AlertCircle, Heart, Clock, Trophy, Bell, X } from "lucide-react";

interface Notification {
  id: string;
  type: "alert" | "health" | "reminder" | "achievement";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "health",
    title: "تنبيه صحي",
    description: "الحمام رقم 5 يحتاج فحص صحي عاجل",
    time: "قبل 30 دقيقة",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "تذكير مهم",
    description: "موعد إطعام الحمام الصباحي في 9 صباحاً",
    time: "قبل ساعة",
    read: false,
  },
  {
    id: "3",
    type: "achievement",
    title: "إنجاز",
    description: "فاز حمام الفينيكس بالمركز الأول في سباق الإسكندرية",
    time: "قبل يومين",
    read: true,
  },
  {
    id: "4",
    type: "alert",
    title: "تحذير",
    description: "انخفاض درجة الحرارة في الحظيرة أقل من المطلوب",
    time: "قبل 3 أيام",
    read: true,
  },
];

export function NotificationsPanel() {
  const { t } = useLanguage();
  const [items, setItems] = useState(notifications);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = items.filter((n) => !n.read).length;
  const displayedItems = showAll ? items : items.slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case "health":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "reminder":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const removeNotification = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">الإشعارات والتنبيهات</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {displayedItems.map((notification) => (
          <Card
            key={notification.id}
            className={`${!notification.read ? "border-blue-500/50 bg-blue-50/50" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs"
                    >
                      علم
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNotification(notification.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length > 5 && !showAll && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => setShowAll(true)}
        >
          عرض جميع الإشعارات ({items.length})
        </Button>
      )}
    </div>
  );
}

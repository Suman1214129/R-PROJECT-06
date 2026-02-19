"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Package, MessageCircle, Star, AlertCircle, Check, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const notifications = [
     {
          id: "1",
          type: "order",
          icon: Package,
          iconBg: "bg-accent-light",
          iconColor: "text-accent",
          title: "Order Confirmed",
          message: "Your order for Calculus Textbook has been confirmed by the seller.",
          time: "2025-02-19T10:30:00",
          read: false,
     },
     {
          id: "2",
          type: "message",
          icon: MessageCircle,
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
          title: "New Message from Sarah Chen",
          message: "\"Hi! Is the MacBook still available? I can pick it up today.\"",
          time: "2025-02-19T09:15:00",
          read: false,
     },
     {
          id: "3",
          type: "review",
          icon: Star,
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
          title: "New Review Received",
          message: "Alex Johnson left a 5-star review on your listing.",
          time: "2025-02-18T16:45:00",
          read: true,
     },
     {
          id: "4",
          type: "price",
          icon: AlertCircle,
          iconBg: "bg-rose-50",
          iconColor: "text-rose-600",
          title: "Price Drop Alert",
          message: "A listing on your wishlist dropped 20% in price: Wireless Earbuds",
          time: "2025-02-18T12:00:00",
          read: true,
     },
     {
          id: "5",
          type: "order",
          icon: Package,
          iconBg: "bg-accent-light",
          iconColor: "text-accent",
          title: "Order Delivered",
          message: "Your Desk Lamp has been marked as delivered. Please confirm receipt.",
          time: "2025-02-17T14:20:00",
          read: true,
     },
     {
          id: "6",
          type: "order",
          icon: Check,
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
          title: "Payment Released",
          message: "Payment of 25 ALGO has been released from escrow to your wallet.",
          time: "2025-02-16T09:00:00",
          read: true,
     },
];

export default function NotificationsPage() {
     const [items, setItems] = useState(notifications);
     const [filter, setFilter] = useState<"all" | "unread">("all");

     const filteredItems = filter === "unread" ? items.filter((n) => !n.read) : items;
     const unreadCount = items.filter((n) => !n.read).length;

     const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
     const removeItem = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));
     const toggleRead = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));

     const formatTime = (dateStr: string) => {
          const date = new Date(dateStr);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffHours < 1) return "Just now";
          if (diffHours < 24) return `${diffHours}h ago`;
          const diffDays = Math.floor(diffHours / 24);
          if (diffDays < 7) return `${diffDays}d ago`;
          return formatDate(dateStr);
     };

     return (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
               {/* Header */}
               <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                         <h1 className="font-serif text-2xl font-semibold text-text-primary">Notifications</h1>
                         {unreadCount > 0 && (
                              <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                                   {unreadCount}
                              </span>
                         )}
                    </div>
                    {unreadCount > 0 && (
                         <button onClick={markAllRead} className="text-[12px] text-accent hover:text-accent-hover font-medium transition-colors">
                              Mark all read
                         </button>
                    )}
               </div>

               {/* Filter */}
               <div className="flex items-center gap-1.5 mb-6">
                    <button
                         onClick={() => setFilter("all")}
                         className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${filter === "all" ? "bg-primary text-white" : "bg-surface-2 text-text-muted border border-border"
                              }`}
                    >
                         All
                    </button>
                    <button
                         onClick={() => setFilter("unread")}
                         className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${filter === "unread" ? "bg-primary text-white" : "bg-surface-2 text-text-muted border border-border"
                              }`}
                    >
                         Unread ({unreadCount})
                    </button>
               </div>

               {/* Notifications List */}
               <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                         {filteredItems.map((item) => (
                              <motion.div
                                   key={item.id}
                                   layout
                                   initial={{ opacity: 0, y: 8 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   exit={{ opacity: 0, x: -20 }}
                                   className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${item.read
                                             ? "border-border bg-white"
                                             : "border-accent/20 bg-accent-light/30"
                                        }`}
                              >
                                   <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                                        <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                             <h4 className={`text-sm ${item.read ? "text-text-muted" : "font-medium text-text-primary"}`}>{item.title}</h4>
                                             <span className="text-[10px] text-text-light whitespace-nowrap shrink-0">{formatTime(item.time)}</span>
                                        </div>
                                        <p className="text-[12px] text-text-light mt-0.5 leading-relaxed">{item.message}</p>
                                   </div>
                                   <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                             onClick={() => toggleRead(item.id)}
                                             className="p-1 rounded-md hover:bg-surface-2 text-text-light"
                                             title={item.read ? "Mark unread" : "Mark read"}
                                        >
                                             {item.read ? <Bell className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                        </button>
                                        <button
                                             onClick={() => removeItem(item.id)}
                                             className="p-1 rounded-md hover:bg-surface-2 text-text-light hover:text-danger"
                                             title="Remove"
                                        >
                                             <Trash2 className="w-3 h-3" />
                                        </button>
                                   </div>
                              </motion.div>
                         ))}
                    </AnimatePresence>

                    {filteredItems.length === 0 && (
                         <div className="text-center py-16">
                              <Bell className="w-10 h-10 text-text-light mx-auto mb-3" />
                              <p className="font-serif text-lg text-text-muted italic">No notifications</p>
                              <p className="text-xs text-text-light mt-1">You&apos;re all caught up!</p>
                         </div>
                    )}
               </div>
          </div>
     );
}

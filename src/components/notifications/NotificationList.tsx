"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";
import {
     subscribeToNotifications,
     subscribeToUnreadCount,
     markAsRead,
     markAllAsRead,
     deleteNotification,
     type Notification
} from "@/backend/notifications";
import { timeAgo } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationList() {
     const { user } = useAuthStore();
     const [notifications, setNotifications] = useState<Notification[]>([]);
     const [unreadCount, setUnreadCount] = useState(0);

     useEffect(() => {
          if (!user?.uid) return;

          // Subscribe to list
          const unsubList = subscribeToNotifications(user.uid, (data) => {
               setNotifications(data);
          });

          // Subscribe to count
          const unsubCount = subscribeToUnreadCount(user.uid, (count) => {
               setUnreadCount(count);
          });

          return () => {
               unsubList();
               unsubCount();
          };
     }, [user]);

     if (!user) return null;

     const handleMarkAllRead = async () => {
          await markAllAsRead(user.uid);
     };

     const handleDelete = async (e: React.MouseEvent, id: string) => {
          e.stopPropagation(); // Prevent navigation
          await deleteNotification(id);
     };

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <button className="relative p-2 rounded-lg hover:bg-surface-2 text-text-muted transition-colors outline-none focus:ring-2 focus:ring-accent/20">
                         <Bell className="w-5 h-5" />
                         {unreadCount > 0 && (
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-white" />
                         )}
                    </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden bg-white border-border shadow-xl rounded-xl">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
                         <h4 className="font-medium text-sm text-text-primary">Notifications</h4>
                         {unreadCount > 0 && (
                              <button
                                   onClick={handleMarkAllRead}
                                   className="text-[10px] uppercase font-bold text-accent hover:text-accent-hover tracking-wide"
                              >
                                   Mark all read
                              </button>
                         )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                         {notifications.length === 0 ? (
                              <div className="py-8 text-center">
                                   <Bell className="w-8 h-8 mx-auto text-text-light/30 mb-2" />
                                   <p className="text-xs text-text-muted">No notifications yet</p>
                              </div>
                         ) : (
                              <div className="divide-y divide-border/50">
                                   <AnimatePresence initial={false}>
                                        {notifications.map((n) => (
                                             <motion.div
                                                  key={n.id}
                                                  initial={{ opacity: 0, height: 0 }}
                                                  animate={{ opacity: 1, height: "auto" }}
                                                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                  transition={{ duration: 0.2 }}
                                             >
                                                  <NotificationItem
                                                       notification={n}
                                                       onDelete={(e) => handleDelete(e, n.id)}
                                                  />
                                             </motion.div>
                                        ))}
                                   </AnimatePresence>
                              </div>
                         )}
                    </div>
               </DropdownMenuContent>
          </DropdownMenu>
     );
}

function NotificationItem({ notification: n, onDelete }: { notification: Notification, onDelete: (e: React.MouseEvent) => void }) {
     const isRead = n.read;

     const handleClick = () => {
          if (!isRead) markAsRead(n.id);
     };

     return (
          <DropdownMenuItem asChild>
               <Link
                    href={n.link}
                    onClick={handleClick}
                    className={`relative flex gap-3 px-4 py-3 cursor-pointer outline-none transition-colors group
                         ${isRead ? "bg-white hover:bg-surface" : "bg-accent/5 hover:bg-accent/10"}
                    `}
               >
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isRead ? "bg-transparent" : "bg-accent"}`} />
                    <div className="flex-1 min-w-0">
                         <h5 className={`text-sm ${isRead ? "text-text-primary" : "text-text-primary font-medium"}`}>
                              {n.title}
                         </h5>
                         <p className="text-xs text-text-muted line-clamp-2 mt-0.5 leading-relaxed">
                              {n.message}
                         </p>
                         <span className="text-[10px] text-text-light mt-1 block">
                              {n.createdAt?.seconds ? timeAgo(new Date(n.createdAt.seconds * 1000).toISOString()) : "Just now"}
                         </span>
                    </div>

                    {/* Delete Button - Visible on Group Hover */}
                    <button
                         onClick={onDelete}
                         className="absolute top-2 right-2 p-1.5 rounded-md text-text-light opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition-all"
                         title="Delete notification"
                    >
                         <Trash2 className="w-3.5 h-3.5" />
                    </button>
               </Link>
          </DropdownMenuItem>
     );
}

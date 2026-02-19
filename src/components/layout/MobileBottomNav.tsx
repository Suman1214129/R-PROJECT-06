"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, PlusCircle, ShoppingCart, MessageCircle, User } from "lucide-react";

const navItems = [
     { href: "/", icon: Store, label: "Market" },
     { href: "/dashboard/listings/new", icon: PlusCircle, label: "Sell" },
     { href: "/orders", icon: ShoppingCart, label: "Orders" },
     { href: "/messages", icon: MessageCircle, label: "Chat" },
     { href: "/profile/seller-1", icon: User, label: "Profile" },
];

export function MobileBottomNav() {
     const pathname = usePathname();

     return (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-xl">
               <div className="flex items-center justify-around py-2 px-2">
                    {navItems.map((item) => {
                         const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                         return (
                              <Link
                                   key={item.href}
                                   href={item.href}
                                   className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-primary" : "text-text-muted"
                                        }`}
                              >
                                   <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                                   <span className="text-[10px] font-medium">{item.label}</span>
                              </Link>
                         );
                    })}
               </div>
          </nav>
     );
}

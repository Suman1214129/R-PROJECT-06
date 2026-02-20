"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Plus, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const navItems = [
     { href: "/dashboard/listings", label: "Listings", icon: Package },
     { href: "/dashboard/listings/new", label: "New Listing", icon: Plus },
];

export function Sidebar() {
     const pathname = usePathname();
     const [collapsed, setCollapsed] = useState(false);

     return (
          <aside className={`hidden lg:flex flex-col border-r border-border bg-white h-[calc(100vh-56px)] sticky top-14 transition-all ${collapsed ? "w-16" : "w-56"}`}>
               <div className="flex-1 py-4 space-y-1 px-2">
                    {navItems.map((item) => {
                         const isActive = pathname === item.href;
                         return (
                              <Link
                                   key={item.href}
                                   href={item.href}
                                   className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                             ? "text-primary bg-primary-light"
                                             : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                                        }`}
                              >
                                   <item.icon className="w-4 h-4 shrink-0" />
                                   {!collapsed && <span>{item.label}</span>}
                              </Link>
                         );
                    })}
               </div>

               <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center p-3 border-t border-border text-text-light hover:text-text-muted transition-colors"
               >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
               </button>
          </aside>
     );
}

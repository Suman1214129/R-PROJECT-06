"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Package, TrendingUp, ShoppingCart, Eye, Pause, Trash2, Check, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { listings } from "@/lib/mock-data";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { Sidebar } from "@/components/layout/Sidebar";
import { timeAgo } from "@/lib/utils";

const myListings = listings.filter((l) => l.sellerId === "seller-1");

const stats = [
     { label: "Active Listings", value: "5", trend: "+2 this week", icon: Package, color: "text-accent" },
     { label: "Total Sales", value: "1,247", trend: "+12% this month", icon: TrendingUp, color: "text-emerald-600", isCrypto: true },
     { label: "Pending Orders", value: "3", trend: "2 ready for pickup", icon: ShoppingCart, color: "text-amber-600" },
     { label: "Profile Views", value: "891", trend: "+28% this week", icon: Eye, color: "text-blue-500" },
];

export default function DashboardListingsPage() {
     const [viewMode, setViewMode] = useState<"grid" | "list">("list");

     return (
          <div className="flex">
               <Sidebar />
               <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                         <div>
                              <h1 className="font-serif text-2xl text-text-primary italic">My Listings</h1>
                              <p className="text-sm text-text-muted mt-1">Manage your marketplace listings</p>
                         </div>
                         <Link href="/dashboard/listings/new" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-[13px] font-medium tracking-wide transition-all active:scale-[0.97]">
                              <Plus className="w-4 h-4" />
                              New Listing
                         </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                         {stats.map((stat, i) => (
                              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-white p-5">
                                   <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-text-muted">{stat.label}</span>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                   </div>
                                   <p className={`text-2xl font-bold text-text-primary ${stat.isCrypto ? "font-mono" : ""}`}>
                                        {stat.value}
                                        {stat.isCrypto && <span className="text-sm text-text-muted ml-1">ALGO</span>}
                                   </p>
                                   <p className="text-xs text-emerald-600 mt-1">{stat.trend}</p>
                              </motion.div>
                         ))}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                         <span className="text-sm text-text-muted">{myListings.length} listings</span>
                         <div className="flex items-center gap-1 p-1 rounded-full bg-surface-2 border border-border">
                              <button onClick={() => setViewMode("list")} className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-white shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary"}`}>
                                   <List className="w-4 h-4" />
                              </button>
                              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary"}`}>
                                   <LayoutGrid className="w-4 h-4" />
                              </button>
                         </div>
                    </div>

                    {viewMode === "list" ? (
                         <div className="rounded-2xl border border-border bg-white overflow-hidden">
                              <div className="overflow-x-auto">
                                   <table className="w-full">
                                        <thead>
                                             <tr className="border-b border-border bg-surface">
                                                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Item</th>
                                                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Price</th>
                                                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Status</th>
                                                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Views</th>
                                                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {myListings.map((listing) => (
                                                  <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                                                       <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                 <img src={listing.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                                                 <span className="text-sm font-medium text-text-primary truncate max-w-[200px]">{listing.title}</span>
                                                            </div>
                                                       </td>
                                                       <td className="px-5 py-4 hidden sm:table-cell"><CryptoAmount amount={listing.price} size="sm" showUsd={false} /></td>
                                                       <td className="px-5 py-4"><OrderStatusBadge status={listing.status} /></td>
                                                       <td className="px-5 py-4 hidden lg:table-cell"><span className="text-sm text-text-muted">{listing.views}</span></td>
                                                       <td className="px-5 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                 <button className="p-1.5 rounded-lg hover:bg-surface-2 text-text-light hover:text-amber-600 transition-all" title="Pause"><Pause className="w-3.5 h-3.5" /></button>
                                                                 <button className="p-1.5 rounded-lg hover:bg-surface-2 text-text-light hover:text-emerald-600 transition-all" title="Mark Sold"><Check className="w-3.5 h-3.5" /></button>
                                                                 <button className="p-1.5 rounded-lg hover:bg-surface-2 text-text-light hover:text-red-500 transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                              {myListings.map((listing, i) => (
                                   <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-white overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={listing.images[0]} alt="" className="w-full aspect-video object-cover" />
                                        <div className="p-4">
                                             <div className="flex items-center justify-between mb-2">
                                                  <h3 className="text-sm font-medium text-text-primary truncate">{listing.title}</h3>
                                                  <OrderStatusBadge status={listing.status} />
                                             </div>
                                             <CryptoAmount amount={listing.price} size="sm" />
                                             <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                                  <span className="text-xs text-text-muted">{listing.views} views</span>
                                                  <span className="text-xs text-text-light">{timeAgo(listing.createdAt)}</span>
                                             </div>
                                        </div>
                                   </motion.div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
}

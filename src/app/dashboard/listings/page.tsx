"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Package, TrendingUp, ShoppingCart, Eye, Pause, Trash2, Check, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import type { ListingData } from "@/backend/firestore";

export default function DashboardListingsPage() {
     const { user } = useAuthStore();
     const [viewMode, setViewMode] = useState<"grid" | "list">("list");
     const [myListings, setMyListings] = useState<ListingData[]>([]);
     const [loading, setLoading] = useState(true);
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
     const [listingToDelete, setListingToDelete] = useState<string | null>(null);

     useEffect(() => {
          const fetchListings = async () => {
               if (!user) {
                    setLoading(false);
                    return;
               }

               try {
                    const response = await fetch(`/api/listings?uid=${user.uid}`);
                    if (response.ok) {
                         const data = await response.json();
                         setMyListings(data.listings);
                    }
               } catch (error) {
                    console.error("Error fetching listings:", error);
               } finally {
                    setLoading(false);
               }
          };

          fetchListings();
     }, [user]);

     const activeListings = myListings.filter((l) => l.status === "Active").length;
     const totalViews = myListings.reduce((sum, l) => sum + l.views, 0);

     const handleStatusChange = async (listingId: string, status: "Active" | "Paused" | "Sold") => {
          try {
               const response = await fetch(`/api/listings/${listingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status }),
               });

               if (response.ok) {
                    setMyListings((prev) =>
                         prev.map((l) => (l.id === listingId ? { ...l, status } : l))
                    );
               }
          } catch (error) {
               console.error("Error updating listing:", error);
          }
     };

     const handleDelete = async (listingId: string) => {
          setListingToDelete(listingId);
          setDeleteDialogOpen(true);
     };

     const confirmDelete = async () => {
          if (!listingToDelete) return;

          try {
               const response = await fetch(`/api/listings/${listingToDelete}`, {
                    method: "DELETE",
               });

               if (response.ok) {
                    setMyListings((prev) => prev.filter((l) => l.id !== listingToDelete));
               }
          } catch (error) {
               console.error("Error deleting listing:", error);
          } finally {
               setListingToDelete(null);
          }
     };

const stats = [
     { label: "Active Listings", value: activeListings.toString(), trend: "+2 this week", icon: Package, color: "text-accent" },
     { label: "Total Sales", value: "1,247", trend: "+12% this month", icon: TrendingUp, color: "text-emerald-600", isCrypto: true },
     { label: "Pending Orders", value: "3", trend: "2 ready for pickup", icon: ShoppingCart, color: "text-amber-600" },
     { label: "Profile Views", value: totalViews.toString(), trend: "+28% this week", icon: Eye, color: "text-blue-500" },
];

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

                    {loading ? (
                         <div className="rounded-2xl border border-border bg-white p-8 text-center">
                              <p className="text-text-muted">Loading your listings...</p>
                         </div>
                    ) : myListings.length === 0 ? (
                         <div className="rounded-2xl border border-border bg-white p-8 text-center">
                              <Package className="w-12 h-12 text-text-light mx-auto mb-3" />
                              <p className="text-text-muted mb-4">You haven't created any listings yet</p>
                              <Link href="/dashboard/listings/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium">
                                   <Plus className="w-4 h-4" />
                                   Create Your First Listing
                              </Link>
                         </div>
                    ) : viewMode === "list" ? (
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
                                                                 <button 
                                                                      onClick={() => handleStatusChange(listing.id, listing.status === "Paused" ? "Active" : "Paused")}
                                                                      className="p-1.5 rounded-lg hover:bg-surface-2 text-text-light hover:text-amber-600 transition-all" 
                                                                      title={listing.status === "Paused" ? "Activate" : "Pause"}
                                                                 >
                                                                      <Pause className="w-3.5 h-3.5" />
                                                                 </button>
                                                                 <button 
                                                                      onClick={() => handleStatusChange(listing.id, "Sold")}
                                                                      className="p-1.5 rounded-lg hover:bg-surface-2 text-text-light hover:text-emerald-600 transition-all" 
                                                                      title="Mark Sold"
                                                                 >
                                                                      <Check className="w-3.5 h-3.5" />
                                                                 </button>
                                                                 <button 
                                                                      onClick={() => handleDelete(listing.id)}
                                                                      className="p-1.5 rounded-lg hover:bg-surface-2 text-text-light hover:text-red-500 transition-all" 
                                                                      title="Delete"
                                                                 >
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                                 </button>
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

                    <ConfirmDialog
                         isOpen={deleteDialogOpen}
                         onClose={() => setDeleteDialogOpen(false)}
                         onConfirm={confirmDelete}
                         title="Delete Listing?"
                         message="This action cannot be undone. Your listing will be permanently removed from the marketplace."
                         confirmText="Delete"
                         cancelText="Cancel"
                    />
               </div>
          </div>
     );
}

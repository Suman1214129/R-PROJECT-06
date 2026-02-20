"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Clock, ChevronRight, ShoppingBag, Tag } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { getBuyerOrders, getSellerOrders, type EscrowOrder } from "@/backend/firestore";

function StatusBadge({ status }: { status: EscrowOrder["status"] }) {
     const map: Record<EscrowOrder["status"], { label: string; cls: string }> = {
          pending: { label: "Pending Payment", cls: "bg-amber-100 text-amber-700" },
          paid: { label: "Escrow Locked", cls: "bg-blue-100 text-blue-700" },
          completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-700" },
          cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
     };
     const s = map[status];
     return <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

function OrderCard({ order, delay }: { order: EscrowOrder; delay: number }) {
     return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
               <Link href={`/orders/${order.id}`}>
                    <div className="rounded-2xl border border-border bg-white p-5 hover:shadow-md hover:shadow-black/5 transition-all group">
                         <div className="flex items-start gap-4">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                   src={order.listingImage}
                                   alt=""
                                   className="w-14 h-14 rounded-xl object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                   <div className="flex items-start justify-between gap-3">
                                        <div>
                                             <h3 className="text-sm font-medium text-text-primary truncate">
                                                  {order.listingTitle}
                                             </h3>
                                             <div className="flex items-center gap-3 mt-1.5">
                                                  <StatusBadge status={order.status} />
                                                  <span className="text-xs text-text-light flex items-center gap-1">
                                                       <Clock className="w-3 h-3" />
                                                       Order #{order.id.slice(-6).toUpperCase()}
                                                  </span>
                                             </div>
                                        </div>
                                        <CryptoAmount amount={order.amount} size="sm" showUsd={false} />
                                   </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-light group-hover:text-text-muted shrink-0 mt-1 transition-colors" />
                         </div>
                    </div>
               </Link>
          </motion.div>
     );
}

export default function OrdersPage() {
     const { user } = useAuthStore();
     const { address } = useWalletStore();

     const [tab, setTab] = useState<"buying" | "selling">("buying");
     const [buyerOrders, setBuyerOrders] = useState<EscrowOrder[]>([]);
     const [sellerOrders, setSellerOrders] = useState<EscrowOrder[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          if (!user?.uid) { setLoading(false); return; }
          Promise.all([
               getBuyerOrders(user.uid),
               address ? getSellerOrders(address) : Promise.resolve([]),
          ]).then(([bought, sold]) => {
               setBuyerOrders(bought);
               setSellerOrders(sold);
               setLoading(false);
          });
     }, [user?.uid, address]);

     const displayed = tab === "buying" ? buyerOrders : sellerOrders;

     if (!user) {
          return (
               <div className="flex">
                    <Sidebar />
                    <div className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
                         <p className="text-text-muted">Please log in to view your orders.</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="flex">
               <Sidebar />
               <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                         <div>
                              <h1 className="font-serif text-2xl text-text-primary italic">Orders</h1>
                              <p className="text-sm text-text-muted mt-1">Manage your escrow orders</p>
                         </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 rounded-xl bg-surface-2 border border-border w-fit mb-6">
                         {(["buying", "selling"] as const).map((t) => (
                              <button
                                   key={t}
                                   onClick={() => setTab(t)}
                                   className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t
                                        ? "bg-white text-text-primary shadow-sm"
                                        : "text-text-muted hover:text-text-primary"
                                        }`}
                              >
                                   {t === "buying" ? <ShoppingBag className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                                   {t === "buying" ? `Buying (${buyerOrders.length})` : `Selling (${sellerOrders.length})`}
                              </button>
                         ))}
                    </div>

                    {loading ? (
                         <div className="space-y-3">
                              {[1, 2, 3].map((i) => (
                                   <div key={i} className="rounded-2xl border border-border bg-white p-5 animate-pulse">
                                        <div className="flex gap-4">
                                             <div className="w-14 h-14 rounded-xl bg-surface-2" />
                                             <div className="flex-1 space-y-2">
                                                  <div className="h-3 bg-surface-2 rounded w-1/2" />
                                                  <div className="h-3 bg-surface-2 rounded w-1/3" />
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    ) : displayed.length === 0 ? (
                         <div className="text-center py-20">
                              <Package className="w-10 h-10 text-text-light mx-auto mb-3" />
                              <p className="text-text-muted text-sm">
                                   {tab === "buying" ? "No purchases yet" : "No sales yet"}
                              </p>
                              {tab === "buying" && (
                                   <Link
                                        href="/"
                                        className="text-accent text-sm hover:underline mt-2 inline-block"
                                   >
                                        Browse marketplace
                                   </Link>
                              )}
                         </div>
                    ) : (
                         <div className="space-y-3">
                              {displayed.map((order, i) => (
                                   <OrderCard key={order.id} order={order} delay={i * 0.05} />
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
}

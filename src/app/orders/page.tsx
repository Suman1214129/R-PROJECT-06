"use client";

import { motion } from "framer-motion";
import { Package, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { orders, getListingById } from "@/lib/mock-data";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { Sidebar } from "@/components/layout/Sidebar";
import { formatDate } from "@/lib/utils";

export default function OrdersPage() {
     return (
          <div className="flex">
               <Sidebar />
               <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                         <div>
                              <h1 className="font-serif text-2xl text-text-primary italic">Orders</h1>
                              <p className="text-sm text-text-muted mt-1">{orders.length} total orders</p>
                         </div>
                    </div>
                    <div className="space-y-3">
                         {orders.map((order, i) => {
                              const listing = getListingById(order.listingId);
                              return (
                                   <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Link href={`/orders/${order.id}`}>
                                             <div className="rounded-2xl border border-border bg-white p-5 hover:shadow-md hover:shadow-black/5 transition-all group">
                                                  <div className="flex items-start gap-4">
                                                       {listing && (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={listing.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                                       )}
                                                       <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-3">
                                                                 <div>
                                                                      <h3 className="text-sm font-medium text-text-primary truncate">{listing?.title || order.listingId}</h3>
                                                                      <div className="flex items-center gap-3 mt-1">
                                                                           <OrderStatusBadge status={order.status} />
                                                                           <span className="text-xs text-text-light flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(order.createdAt)}</span>
                                                                      </div>
                                                                 </div>
                                                                 <CryptoAmount amount={order.price} size="sm" showUsd={false} />
                                                            </div>
                                                       </div>
                                                       <ChevronRight className="w-4 h-4 text-text-light group-hover:text-text-muted shrink-0 mt-1 transition-colors" />
                                                  </div>
                                             </div>
                                        </Link>
                                   </motion.div>
                              );
                         })}
                    </div>
               </div>
          </div>
     );
}

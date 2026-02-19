"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Circle, Copy, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getOrderById, getListingById, getSellerById } from "@/lib/mock-data";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { formatDate, truncateAddress } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const order = getOrderById(id);
     const listing = order ? getListingById(order.listingId) : undefined;
     const seller = order ? getSellerById(order.sellerId) : undefined;

     if (!order || !listing || !seller) {
          return (
               <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-2xl text-text-primary italic mb-4">Order not found</h1>
                    <Link href="/orders" className="text-accent hover:underline">Back to orders</Link>
               </div>
          );
     }

     return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
               <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-8">
                    <ChevronLeft className="w-4 h-4" /> Back to Orders
               </Link>

               <div className="flex items-start justify-between mb-8">
                    <div>
                         <h1 className="font-serif text-2xl text-text-primary italic">Order #{order.id.slice(-4)}</h1>
                         <div className="flex items-center gap-3 mt-2">
                              <OrderStatusBadge status={order.status} />
                              <span className="text-xs text-text-muted">Placed {formatDate(order.createdAt)}</span>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                         <div className="rounded-2xl border border-border bg-white p-6">
                              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">Order Timeline</h3>
                              <div className="relative pl-8">
                                   <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                                   {order.timeline.map((step, i) => (
                                        <motion.div key={step.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative pb-8 last:pb-0">
                                             <div className={`absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? "bg-emerald-100 text-emerald-600" : step.active ? "bg-accent-light text-accent ring-2 ring-accent/20" : "bg-surface-2 text-text-light"
                                                  }`}>
                                                  {step.completed ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                                             </div>
                                             <div className="ml-4">
                                                  <p className={`text-sm font-medium ${step.active ? "text-accent" : step.completed ? "text-text-primary" : "text-text-light"}`}>{step.label}</p>
                                                  {step.timestamp && <p className="text-xs text-text-muted mt-0.5">{formatDate(step.timestamp)}</p>}
                                             </div>
                                        </motion.div>
                                   ))}
                              </div>
                         </div>

                         <div className="rounded-2xl border border-border bg-white p-6">
                              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Transaction Details</h3>
                              <div className="space-y-3 text-sm">
                                   <div className="flex items-center justify-between">
                                        <span className="text-text-muted">Tx Hash</span>
                                        <div className="flex items-center gap-2">
                                             <span className="font-mono text-xs text-text-primary">{truncateAddress(order.txHash)}</span>
                                             <button onClick={() => navigator.clipboard.writeText(order.txHash)} className="p-1 rounded hover:bg-surface-2"><Copy className="w-3.5 h-3.5 text-text-light" /></button>
                                        </div>
                                   </div>
                                   <div className="flex items-center justify-between"><span className="text-text-muted">Amount</span><CryptoAmount amount={order.price} size="sm" /></div>
                                   <div className="flex items-center justify-between"><span className="text-text-muted">Est. Delivery</span><span className="text-text-primary">{formatDate(order.estimatedDelivery)}</span></div>
                              </div>
                         </div>
                    </div>

                    <div className="space-y-6">
                         <div className="rounded-2xl border border-border bg-white p-5">
                              <div className="flex items-center gap-3 mb-4">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                                   <div><h4 className="text-sm font-medium text-text-primary">{listing.title}</h4><CryptoAmount amount={listing.price} size="sm" showUsd={false} /></div>
                              </div>
                         </div>
                         <div className="rounded-2xl border border-border bg-white p-5">
                              <h4 className="text-xs text-text-muted uppercase tracking-wider mb-3">Seller</h4>
                              <div className="flex items-center gap-3">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src={seller.avatar} alt="" className="w-10 h-10 rounded-full" />
                                   <div><p className="text-sm font-medium text-text-primary">{seller.name}</p><p className="text-xs text-text-muted">{seller.university}</p></div>
                              </div>
                              <button className="flex items-center justify-center gap-2 w-full mt-4 py-2 rounded-full border border-border text-sm text-text-muted hover:text-text-primary hover:border-border-hover transition-all">
                                   <MessageCircle className="w-4 h-4" />Message Seller
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
}

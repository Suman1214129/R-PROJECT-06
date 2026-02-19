"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, Flag, UserPlus, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { getSellerById, getListingsBySeller, reviews } from "@/lib/mock-data";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { formatDate } from "@/lib/utils";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const seller = getSellerById(id);
     const [activeTab, setActiveTab] = useState("listings");

     if (!seller) {
          return (
               <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-2xl text-text-primary italic mb-4">Profile not found</h1>
                    <Link href="/" className="text-accent hover:underline">Back to marketplace</Link>
               </div>
          );
     }

     const sellerListings = getListingsBySeller(seller.id).filter((l) => l.status === "Active");
     const tabs = [
          { id: "listings", label: `Listings (${sellerListings.length})` },
          { id: "reviews", label: `Reviews (${seller.reviewCount})` },
          { id: "about", label: "About" },
     ];

     return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               {/* Header */}
               <div className="relative rounded-2xl overflow-hidden mb-8">
                    <div className="h-32 sm:h-44 bg-surface-warm relative">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.03)_0%,transparent_50%)]" />
                    </div>
                    <div className="bg-white border border-border border-t-0 rounded-b-2xl px-6 pb-6 pt-0">
                         <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                              <div className="relative">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src={seller.avatar} alt={seller.name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm" />
                                   <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                              </div>
                              <div className="flex-1">
                                   <div className="flex items-center gap-2">
                                        <h1 className="font-serif text-xl text-text-primary italic">{seller.name}</h1>
                                        {seller.isVerified && <VerifiedBadge />}
                                   </div>
                                   <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{seller.university}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Since {formatDate(seller.memberSince)}</span>
                                   </div>
                                   <div className="flex items-center gap-2 mt-2">
                                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(seller.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}
                                        <span className="text-sm text-text-muted">({seller.reviewCount})</span>
                                   </div>
                              </div>
                              <div className="flex items-center gap-6 text-center">
                                   <div><p className="text-lg font-bold text-text-primary">{seller.totalSold}</p><p className="text-xs text-text-muted">Sold</p></div>
                                   <div><p className="text-lg font-bold text-text-primary">{seller.activeListings}</p><p className="text-xs text-text-muted">Active</p></div>
                                   <div><p className="text-lg font-bold text-text-primary">{seller.responseRate}%</p><p className="text-xs text-text-muted">Response</p></div>
                              </div>
                         </div>
                         <div className="flex items-center gap-3 mt-6">
                              <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-[13px] font-medium tracking-wide transition-all active:scale-[0.97]"><UserPlus className="w-4 h-4" />Follow</button>
                              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-border text-text-muted hover:text-text-primary hover:border-border-hover text-[13px] transition-all active:scale-[0.97]"><MessageCircle className="w-4 h-4" />Message</button>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-text-muted hover:text-red-500 hover:border-red-200 text-[13px] transition-all active:scale-[0.97]"><Flag className="w-4 h-4" /></button>
                         </div>
                    </div>
               </div>

               {/* Tabs */}
               <div className="flex items-center gap-1 mb-8 border-b border-border">
                    {tabs.map((tab) => (
                         <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-5 py-3 text-[13px] font-medium transition-colors ${activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-primary"}`}>
                              {tab.label}
                              {activeTab === tab.id && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />}
                         </button>
                    ))}
               </div>

               {activeTab === "listings" && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                         {sellerListings.map((listing, i) => <ProductCard key={listing.id} listing={listing} index={i} />)}
                    </div>
               )}

               {activeTab === "reviews" && (
                    <div className="space-y-4">
                         {reviews.map((review, i) => (
                              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-white p-5">
                                   <div className="flex items-start gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={review.reviewerAvatar} alt="" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                             <div className="flex items-center justify-between"><div><h4 className="text-sm font-medium text-text-primary">{review.reviewerName}</h4><div className="flex items-center gap-0.5 mt-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}</div></div><span className="text-xs text-text-light">{formatDate(review.date)}</span></div>
                                             <p className="text-sm text-text-muted mt-2">{review.text}</p>
                                             <p className="text-xs text-text-light mt-2">Purchased: {review.itemPurchased}</p>
                                        </div>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               )}

               {activeTab === "about" && (
                    <div className="rounded-2xl border border-border bg-white p-6">
                         <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Bio</h3>
                         <p className="text-sm text-text-muted leading-relaxed">{seller.bio}</p>
                         <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                              <div><p className="text-xs text-text-light">University</p><p className="text-sm text-text-primary mt-1">{seller.university}</p></div>
                              <div><p className="text-xs text-text-light">Response Time</p><p className="text-sm text-text-primary mt-1">{seller.responseTime}</p></div>
                              <div><p className="text-xs text-text-light">Member Since</p><p className="text-sm text-text-primary mt-1">{formatDate(seller.memberSince)}</p></div>
                              <div><p className="text-xs text-text-light">Response Rate</p><p className="text-sm text-text-primary mt-1">{seller.responseRate}%</p></div>
                         </div>
                    </div>
               )}
          </div>
     );
}

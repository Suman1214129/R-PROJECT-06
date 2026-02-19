"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Eye } from "lucide-react";
import { Listing, getSellerById } from "@/lib/mock-data";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { saveListing, unsaveListing, isListingSaved } from "@/backend/firestore";

interface ProductCardProps {
     listing: Listing;
     index?: number;
}

export function ProductCard({ listing, index = 0 }: ProductCardProps) {
     const { user } = useAuthStore();
     const [saved, setSaved] = useState(false);
     const [saving, setSaving] = useState(false);
     const seller = getSellerById(listing.sellerId);

     // Check if listing is saved on mount
     useEffect(() => {
          if (!user?.uid) return;
          isListingSaved(user.uid, listing.id).then(setSaved).catch(() => { });
     }, [user?.uid, listing.id]);

     const handleToggleSave = async (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (!user?.uid || saving) return;

          setSaving(true);
          try {
               if (saved) {
                    await unsaveListing(user.uid, listing.id);
                    setSaved(false);
               } else {
                    await saveListing(user.uid, listing.id);
                    setSaved(true);
               }
          } catch (err) {
               console.error("Failed to toggle save:", err);
          } finally {
               setSaving(false);
          }
     };

     const conditionColors: Record<string, string> = {
          "Like New": "bg-emerald-50 text-emerald-700",
          Good: "bg-blue-50 text-blue-700",
          Fair: "bg-amber-50 text-amber-700",
     };

     return (
          <motion.div
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.04, duration: 0.3 }}
          >
               <Link href={`/listing/${listing.id}`}>
                    <div className="group rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200">
                         {/* Image */}
                         <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                   src={listing.images[0]}
                                   alt={listing.title}
                                   className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                              />

                              {/* Condition */}
                              <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[11px] font-medium ${conditionColors[listing.condition]}`}>
                                   {listing.condition}
                              </span>

                              {/* Save */}
                              <button
                                   onClick={handleToggleSave}
                                   disabled={saving}
                                   className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg transition-all ${saved ? "bg-primary/10 text-primary" : "bg-white/80 backdrop-blur-sm text-text-muted hover:text-primary"
                                        }`}
                              >
                                   <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
                              </button>
                         </div>

                         {/* Content */}
                         <div className="p-3.5">
                              <h3 className="text-sm font-medium text-text-primary truncate mb-1.5 group-hover:text-primary transition-colors">
                                   {listing.title}
                              </h3>
                              <CryptoAmount amount={listing.price} size="sm" />

                              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border">
                                   <div className="flex items-center gap-2">
                                        {seller && (
                                             <>
                                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                                  <img src={seller.avatar} alt="" className="w-5 h-5 rounded-full" />
                                                  <span className="text-[11px] text-text-muted">{seller.name}</span>
                                             </>
                                        )}
                                   </div>
                                   <span className="text-[10px] text-text-light">{timeAgo(listing.createdAt)}</span>
                              </div>
                         </div>
                    </div>
               </Link>
          </motion.div>
     );
}

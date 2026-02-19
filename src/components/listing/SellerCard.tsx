"use client";

import { Star, MessageCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Seller } from "@/lib/mock-data";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { formatDate } from "@/lib/utils";

interface SellerCardProps {
     seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
     return (
          <div className="rounded-2xl border border-border bg-white p-5">
               <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full border border-border" />
                    <div className="flex-1">
                         <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-text-primary">{seller.name}</h4>
                              {seller.isVerified && <VerifiedBadge />}
                         </div>
                         <p className="text-xs text-text-muted mt-0.5">{seller.university}</p>

                         <div className="flex items-center gap-1 mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                   <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(seller.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                              ))}
                              <span className="text-xs text-text-muted ml-1">({seller.reviewCount})</span>
                         </div>

                         <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                              <span>Since {formatDate(seller.memberSince)}</span>
                              <span>Responds {seller.responseTime}</span>
                         </div>
                    </div>
               </div>

               <div className="flex gap-2 mt-4">
                    <Link href="/messages" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm text-text-muted hover:text-text-primary hover:border-border-hover transition-all active:scale-[0.97]">
                         <MessageCircle className="w-4 h-4" />
                         Message
                    </Link>
                    <Link href={`/profile/${seller.id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm text-text-muted hover:text-text-primary hover:border-border-hover transition-all active:scale-[0.97]">
                         <ExternalLink className="w-4 h-4" />
                         Profile
                    </Link>
               </div>
          </div>
     );
}

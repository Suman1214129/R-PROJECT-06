"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Share2, Tag } from "lucide-react";
import Link from "next/link";
import { getListingById, getSellerById, listings } from "@/lib/mock-data";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { SellerCard } from "@/components/listing/SellerCard";
import { CheckoutBox } from "@/components/listing/CheckoutBox";
import { ProductCard } from "@/components/marketplace/ProductCard";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const listing = getListingById(id);
     const seller = listing ? getSellerById(listing.sellerId) : undefined;

     if (!listing || !seller) {
          return (
               <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-2xl text-text-primary italic mb-4">Listing not found</h1>
                    <Link href="/" className="text-accent hover:underline">Back to marketplace</Link>
               </div>
          );
     }

     const similarListings = listings
          .filter((l) => l.category === listing.category && l.id !== listing.id && l.status === "Active")
          .slice(0, 4);

     const conditionColors: Record<string, string> = {
          "Like New": "bg-emerald-50 text-emerald-700 border-emerald-200",
          Good: "bg-blue-50 text-blue-700 border-blue-200",
          Fair: "bg-amber-50 text-amber-700 border-amber-200",
     };

     return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               {/* Breadcrumb */}
               <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
                    <Link href="/" className="hover:text-text-primary transition-colors">Marketplace</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="capitalize">{listing.category}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-text-primary truncate max-w-[200px]">{listing.title}</span>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    <div className="lg:col-span-3">
                         <ImageGallery images={listing.images} title={listing.title} />
                    </div>

                    <div className="lg:col-span-2">
                         <div className="space-y-6">
                              <div>
                                   <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium border ${conditionColors[listing.condition]} mb-3`}>
                                        {listing.condition}
                                   </span>
                                   <h1 className="font-serif text-2xl sm:text-3xl text-text-primary italic">{listing.title}</h1>
                              </div>

                              <CheckoutBox listingId={listing.id} price={listing.price} />

                              <div>
                                   <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Description</h3>
                                   <p className="text-sm text-text-muted leading-relaxed">{listing.description}</p>
                              </div>

                              <SellerCard seller={seller} />

                              <div className="flex flex-wrap gap-2">
                                   {listing.tags.map((tag) => (
                                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs text-text-muted">
                                             <Tag className="w-3 h-3" />
                                             {tag}
                                        </span>
                                   ))}
                              </div>

                              <button className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
                                   <Share2 className="w-4 h-4" />
                                   Share this listing
                              </button>
                         </div>
                    </div>
               </div>

               {similarListings.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-border">
                         <h2 className="font-serif text-2xl text-text-primary italic mb-6">Similar listings</h2>
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                              {similarListings.map((l, i) => <ProductCard key={l.id} listing={l} index={i} />)}
                         </div>
                    </section>
               )}
          </motion.div>
     );
}

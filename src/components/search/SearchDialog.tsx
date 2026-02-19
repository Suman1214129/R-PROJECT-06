"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { listings } from "@/lib/mock-data";
import Link from "next/link";
import { CryptoAmount } from "@/components/ui/CryptoAmount";

interface SearchDialogProps {
     isOpen: boolean;
     onClose: () => void;
}

const recentSearches = ["MacBook Air", "Calculus textbook", "Desk lamp", "Bicycle"];
const trendingSearches = ["AirPods Pro", "Psychology 101", "Standing desk", "Nintendo Switch"];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
     const [query, setQuery] = useState("");
     const inputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
          if (isOpen && inputRef.current) {
               setTimeout(() => inputRef.current?.focus(), 100);
          }
          if (!isOpen) setQuery("");
     }, [isOpen]);

     // Keyboard shortcut
     useEffect(() => {
          const handler = (e: KeyboardEvent) => {
               if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                    e.preventDefault();
                    if (!isOpen) {
                         // parent handles opening
                    }
               }
               if (e.key === "Escape" && isOpen) onClose();
          };
          window.addEventListener("keydown", handler);
          return () => window.removeEventListener("keydown", handler);
     }, [isOpen, onClose]);

     const results = useMemo(() => {
          if (!query.trim()) return [];
          const q = query.toLowerCase();
          return listings
               .filter((l) => l.status === "Active")
               .filter((l) => l.title.toLowerCase().includes(q) || l.tags.some((t) => t.includes(q)) || l.category.includes(q))
               .slice(0, 6);
     }, [query]);

     return (
          <AnimatePresence>
               {isOpen && (
                    <>
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={onClose}
                              className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm"
                         />
                         <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.98 }}
                              transition={{ type: "spring", damping: 30, stiffness: 400 }}
                              className="fixed z-[91] left-1/2 top-[15%] -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl"
                         >
                              <div className="bg-white rounded-2xl border border-border shadow-2xl shadow-black/10 overflow-hidden">
                                   {/* Search Input */}
                                   <div className="flex items-center gap-3 px-5 border-b border-border">
                                        <Search className="w-5 h-5 text-text-light shrink-0" />
                                        <input
                                             ref={inputRef}
                                             type="text"
                                             value={query}
                                             onChange={(e) => setQuery(e.target.value)}
                                             placeholder="Search for anything..."
                                             className="flex-1 py-4 text-base text-text-primary placeholder:text-text-light bg-transparent focus:outline-none"
                                        />
                                        {query && (
                                             <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-surface-2 text-text-light">
                                                  <X className="w-4 h-4" />
                                             </button>
                                        )}
                                        <kbd className="hidden sm:inline-flex h-6 items-center rounded-md border border-border bg-surface px-2 text-[10px] font-mono text-text-light shrink-0">
                                             ESC
                                        </kbd>
                                   </div>

                                   {/* Content */}
                                   <div className="max-h-[60vh] overflow-y-auto">
                                        {query.trim() ? (
                                             /* Search Results */
                                             results.length > 0 ? (
                                                  <div className="p-2">
                                                       <p className="px-3 py-1.5 text-[10px] text-text-light uppercase tracking-widest font-medium">
                                                            Results
                                                       </p>
                                                       {results.map((listing) => (
                                                            <Link key={listing.id} href={`/listing/${listing.id}`} onClick={onClose}>
                                                                 <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface transition-colors group">
                                                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                      <img src={listing.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                                      <div className="flex-1 min-w-0">
                                                                           <h4 className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                                                                                {listing.title}
                                                                           </h4>
                                                                           <p className="text-[11px] text-text-light capitalize">{listing.category} · {listing.condition}</p>
                                                                      </div>
                                                                      <CryptoAmount amount={listing.price} size="sm" showUsd={false} />
                                                                      <ArrowRight className="w-3.5 h-3.5 text-text-light opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                 </div>
                                                            </Link>
                                                       ))}
                                                  </div>
                                             ) : (
                                                  <div className="p-8 text-center">
                                                       <p className="font-serif text-lg text-text-muted italic">No results found</p>
                                                       <p className="text-xs text-text-light mt-1">Try a different search term</p>
                                                  </div>
                                             )
                                        ) : (
                                             /* Empty State — Recent & Trending */
                                             <div className="p-3">
                                                  <div className="mb-4">
                                                       <p className="px-3 py-1.5 text-[10px] text-text-light uppercase tracking-widest font-medium flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" /> Recent
                                                       </p>
                                                       {recentSearches.map((term) => (
                                                            <button
                                                                 key={term}
                                                                 onClick={() => setQuery(term)}
                                                                 className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-surface hover:text-text-primary transition-colors text-left"
                                                            >
                                                                 <Clock className="w-3.5 h-3.5 text-text-light" />
                                                                 {term}
                                                            </button>
                                                       ))}
                                                  </div>
                                                  <div>
                                                       <p className="px-3 py-1.5 text-[10px] text-text-light uppercase tracking-widest font-medium flex items-center gap-1.5">
                                                            <TrendingUp className="w-3 h-3" /> Trending
                                                       </p>
                                                       {trendingSearches.map((term) => (
                                                            <button
                                                                 key={term}
                                                                 onClick={() => setQuery(term)}
                                                                 className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-surface hover:text-text-primary transition-colors text-left"
                                                            >
                                                                 <TrendingUp className="w-3.5 h-3.5 text-text-light" />
                                                                 {term}
                                                            </button>
                                                       ))}
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

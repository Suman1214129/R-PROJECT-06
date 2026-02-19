"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp, Trash2 } from "lucide-react";
import { listings } from "@/lib/mock-data";
import Link from "next/link";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { useAuthStore } from "@/store/auth";
import {
     saveSearch,
     getVisibleSearchHistory,
     hideSearchItem,
     hideAllSearchHistory,
     type SearchHistoryItem,
} from "@/backend/firestore";

interface SearchDialogProps {
     isOpen: boolean;
     onClose: () => void;
}

const trendingSearches = ["AirPods Pro", "Psychology 101", "Standing desk", "Nintendo Switch"];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
     const { user } = useAuthStore();
     const [query, setQuery] = useState("");
     const [history, setHistory] = useState<SearchHistoryItem[]>([]);
     const [historyLoading, setHistoryLoading] = useState(false);
     const inputRef = useRef<HTMLInputElement>(null);

     // Load search history from Firestore when dialog opens
     const loadHistory = useCallback(async () => {
          if (!user?.uid) return;
          setHistoryLoading(true);
          try {
               const items = await getVisibleSearchHistory(user.uid);
               setHistory(items);
          } catch (err) {
               console.error("Failed to load search history:", err);
          } finally {
               setHistoryLoading(false);
          }
     }, [user?.uid]);

     useEffect(() => {
          if (isOpen) {
               setTimeout(() => inputRef.current?.focus(), 100);
               loadHistory();
          }
          if (!isOpen) setQuery("");
     }, [isOpen, loadHistory]);

     // Keyboard shortcut
     useEffect(() => {
          const handler = (e: KeyboardEvent) => {
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

     // Save search when user clicks a result or presses Enter
     const handleSaveAndNavigate = useCallback(async (searchQuery: string) => {
          if (!user?.uid || !searchQuery.trim()) return;
          try {
               await saveSearch(user.uid, searchQuery.trim());
               // Refresh local history
               const updated = await getVisibleSearchHistory(user.uid);
               setHistory(updated);
          } catch (err) {
               console.error("Failed to save search:", err);
          }
     }, [user?.uid]);

     // When user presses Enter (submits search)
     const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && query.trim()) {
               await handleSaveAndNavigate(query.trim());
          }
     };

     // Click a result — save search term, close dialog
     const handleResultClick = async () => {
          if (query.trim()) await handleSaveAndNavigate(query.trim());
          onClose();
     };

     // Click a history item — fill search bar
     const handleHistoryClick = (term: string) => {
          setQuery(term);
     };

     // Delete (hide) a single history item — keeps data in Firestore
     const handleHideItem = async (e: React.MouseEvent, itemId: string) => {
          e.stopPropagation();
          if (!user?.uid) return;
          // Optimistic update
          setHistory((prev) => prev.filter((h) => h.id !== itemId));
          try {
               await hideSearchItem(user.uid, itemId);
          } catch (err) {
               console.error("Failed to hide search item:", err);
               loadHistory(); // revert on failure
          }
     };

     // Clear all — hides all from UI but keeps data in Firestore
     const handleClearAll = async () => {
          if (!user?.uid) return;
          setHistory([]);
          try {
               await hideAllSearchHistory(user.uid);
          } catch (err) {
               console.error("Failed to clear history:", err);
               loadHistory();
          }
     };

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
                                             onKeyDown={handleKeyDown}
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
                                                            <Link key={listing.id} href={`/listing/${listing.id}`} onClick={handleResultClick}>
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
                                                  {/* Search History */}
                                                  <div className="mb-4">
                                                       <div className="flex items-center justify-between px-3 py-1.5">
                                                            <p className="text-[10px] text-text-light uppercase tracking-widest font-medium flex items-center gap-1.5">
                                                                 <Clock className="w-3 h-3" /> Recent
                                                            </p>
                                                            {history.length > 0 && (
                                                                 <button
                                                                      onClick={handleClearAll}
                                                                      className="text-[10px] text-text-light hover:text-red-500 transition-colors flex items-center gap-1"
                                                                 >
                                                                      <Trash2 className="w-3 h-3" /> Clear all
                                                                 </button>
                                                            )}
                                                       </div>

                                                       {historyLoading ? (
                                                            <div className="px-3 py-3 flex items-center gap-2">
                                                                 <div className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                                                                 <span className="text-xs text-text-light">Loading history...</span>
                                                            </div>
                                                       ) : history.length > 0 ? (
                                                            history.map((item) => (
                                                                 <div
                                                                      key={item.id}
                                                                      onClick={() => handleHistoryClick(item.query)}
                                                                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-surface hover:text-text-primary transition-colors text-left group cursor-pointer"
                                                                 >
                                                                      <Clock className="w-3.5 h-3.5 text-text-light shrink-0" />
                                                                      <span className="flex-1 truncate">{item.query}</span>
                                                                      <button
                                                                           onClick={(e) => handleHideItem(e, item.id)}
                                                                           className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-400 text-text-light transition-all shrink-0"
                                                                      >
                                                                           <X className="w-3 h-3" />
                                                                      </button>
                                                                 </div>
                                                            ))
                                                       ) : (
                                                            <p className="px-3 py-2 text-xs text-text-light italic">No recent searches</p>
                                                       )}
                                                  </div>

                                                  {/* Trending */}
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

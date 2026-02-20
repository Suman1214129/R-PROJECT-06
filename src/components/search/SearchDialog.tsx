"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  TrendingUp,
  ArrowUpRight,
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Gamepad2,
  Bike,
  PenLine,
} from "lucide-react";
import { listings } from "@/lib/mock-data";
import Link from "next/link";
import { CryptoAmount } from "@/components/ui/CryptoAmount";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  query?: string;
  onQueryChange?: (q: string) => void;
}

const recentSearches = [
  "MacBook Air",
  "Calculus textbook",
  "Desk lamp",
  "Bicycle",
];

const trendingSearches = [
  "AirPods Pro",
  "Psychology 101",
  "Standing desk",
  "Nintendo Switch",
];

const quickCategories = [
  { label: "Books", icon: BookOpen, color: "#E85D4A" },
  { label: "Electronics", icon: Laptop, color: "#3B82F6" },
  { label: "Furniture", icon: Armchair, color: "#10B981" },
  { label: "Clothing", icon: Shirt, color: "#F59E0B" },
  { label: "Gaming", icon: Gamepad2, color: "#8B5CF6" },
  { label: "Transport", icon: Bike, color: "#06B6D4" },
  { label: "Supplies", icon: PenLine, color: "#F97316" },
];

const containerVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 500, damping: 28 } },
};

export function SearchDialog({
  isOpen,
  onClose,
  query,
  onQueryChange,
}: SearchDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query?.trim()) return [];
    const q = query.toLowerCase();
    return listings
      .filter((l) => l.status === "Active")
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.tags?.some((t) => t.toLowerCase().includes(q)) ||
          l.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full left-0 right-0 mt-3 z-50"
        >
          {/* Glassmorphism card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow:
                "0 20px 60px -10px rgba(0,0,0,0.12), 0 4px 16px -4px rgba(0,0,0,0.06)",
            }}
          >
            {/* Quick category pills */}
            <div className="px-4 pt-4 pb-3 border-b border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-2.5 px-1">
                Browse by category
              </p>
              <motion.div
                className="flex gap-2 flex-wrap"
                variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
              >
                {quickCategories.map((cat) => (
                  <motion.button
                    key={cat.label}
                    variants={pillVariants}
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onQueryChange?.(cat.label);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      background: `${cat.color}18`,
                      color: cat.color,
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Scrollable content */}
            <div className="max-h-[50vh] overflow-y-auto">
              {query?.trim() ? (
                /* ── Search results ── */
                results.length > 0 ? (
                  <motion.div className="p-2" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                    <p className="px-3 py-1.5 text-[10px] text-stone-400 uppercase tracking-widest font-medium flex items-center gap-1.5">
                      <Search className="w-3 h-3" /> Results
                    </p>
                    {results.map((listing) => (
                      <motion.div key={listing.id} variants={itemVariants}>
                        <Link href={`/listing/${listing.id}`} onClick={onClose}>
                          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={listing.images[0]}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0 ring-1 ring-black/5"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-stone-800 truncate group-hover:text-accent transition-colors">
                                {listing.title}
                              </h4>
                              <p className="text-[11px] text-stone-400 capitalize">
                                {listing.category} · {listing.condition}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <CryptoAmount amount={listing.price} size="sm" showUsd={false} />
                              <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-serif text-lg text-stone-400 italic">
                      No results for &quot;{query}&quot;
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Try a different term or browse a category above
                    </p>
                  </div>
                )
              ) : (
                /* ── Empty state: Recent + Trending ── */
                <div className="p-3 grid grid-cols-2 gap-x-4">
                  {/* Recent */}
                  <motion.div variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
                    <p className="px-3 py-1.5 text-[10px] text-stone-400 uppercase tracking-widest font-medium flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3" /> Recent
                    </p>
                    {recentSearches.map((term) => (
                      <motion.button
                        key={term}
                        variants={itemVariants}
                        whileHover={{ x: 3 }}
                        onClick={() => onQueryChange?.(term)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-colors text-left"
                      >
                        <Clock className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                        <span className="truncate">{term}</span>
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Trending */}
                  <motion.div variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
                    <p className="px-3 py-1.5 text-[10px] text-stone-400 uppercase tracking-widest font-medium flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </p>
                    {trendingSearches.map((term) => (
                      <motion.button
                        key={term}
                        variants={itemVariants}
                        whileHover={{ x: 3 }}
                        onClick={() => onQueryChange?.(term)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-colors text-left"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                        <span className="truncate">{term}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-black/5 bg-stone-50/60">
              <span className="text-[10px] text-stone-400">
                Press{" "}
                <kbd className="mx-0.5 px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[9px] text-stone-500">
                  ↵
                </kbd>{" "}
                to search ·{" "}
                <kbd className="mx-0.5 px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[9px] text-stone-500">
                  Esc
                </kbd>{" "}
                to close
              </span>
              <span className="text-[10px] text-stone-400 flex items-center gap-1">
                powered by{" "}
                <span className="font-semibold text-accent">PixelCraft</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

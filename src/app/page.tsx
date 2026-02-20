"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  GraduationCap,
  X,
} from "lucide-react";
import { listings } from "@/lib/mock-data";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FiltersPanel } from "@/components/marketplace/FiltersPanel";
import { SearchDialog } from "@/components/search/SearchDialog";
import { HomeQRScanner } from "@/components/home/HomeQRScanner";

const studentCategories = [
  {
    id: "books",
    title: "Books",
    context: "Textbooks, novels & study guides",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <rect x="10" y="8" width="30" height="42" rx="3" fill="#E85D4A" opacity="0.2" />
        <rect x="16" y="8" width="30" height="42" rx="3" fill="#E85D4A" opacity="0.5" />
        <rect x="16" y="8" width="30" height="42" rx="3" stroke="#E85D4A" strokeWidth="2" />
        <line x1="22" y1="20" x2="40" y2="20" stroke="#E85D4A" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="27" x2="40" y2="27" stroke="#E85D4A" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="34" x2="34" y2="34" stroke="#E85D4A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "electronics",
    title: "Electronics",
    context: "Laptops, phones & gadgets",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <rect x="10" y="16" width="44" height="28" rx="4" fill="#3B82F6" opacity="0.25" />
        <rect x="10" y="16" width="44" height="28" rx="4" stroke="#3B82F6" strokeWidth="2" />
        <rect x="14" y="20" width="36" height="20" rx="2" fill="#3B82F6" opacity="0.15" />
        <rect x="24" y="44" width="16" height="4" rx="1" fill="#3B82F6" opacity="0.5" />
        <circle cx="33" cy="30" r="5" fill="#3B82F6" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "furniture",
    title: "Furniture",
    context: "Desks, chairs & dorm essentials",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <rect x="12" y="24" width="40" height="18" rx="3" fill="#10B981" opacity="0.25" />
        <rect x="12" y="24" width="40" height="18" rx="3" stroke="#10B981" strokeWidth="2" />
        <rect x="18" y="18" width="28" height="8" rx="2" fill="#10B981" opacity="0.45" />
        <line x1="18" y1="42" x2="18" y2="52" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="46" y1="42" x2="46" y2="52" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "clothing",
    title: "Clothing",
    context: "Hoodies, tees & campus fits",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <path
          d="M22 10 L10 22 L18 26 L18 52 L46 52 L46 26 L54 22 L42 10 C42 10 38 16 32 16 C26 16 22 10 22 10Z"
          fill="#F59E0B"
          opacity="0.3"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M22 10 C22 10 26 16 32 16 C38 16 42 10 42 10"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "gaming",
    title: "Gaming",
    context: "Consoles, games & accessories",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <rect x="8" y="20" width="48" height="28" rx="10" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="2" />
        <line x1="22" y1="34" x2="30" y2="34" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="30" x2="26" y2="38" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="31" r="2.5" fill="#8B5CF6" opacity="0.9" />
        <circle cx="46" cy="36" r="2.5" fill="#8B5CF6" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "transport",
    title: "Transport",
    context: "Bikes, scooters & skateboards",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <circle cx="18" cy="44" r="8" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
        <circle cx="46" cy="44" r="8" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
        <path d="M18 44 L28 20 L40 20 L46 44" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 20 L32 32 L46 32" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "supplies",
    title: "Supplies",
    context: "Stationery, lab kits & art gear",
    bg: "rgba(240,239,237,0.55)",
    accent: "#44403C",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14"
      >
        <rect
          x="12"
          y="28"
          width="10"
          height="24"
          rx="2"
          fill="#F97316"
          opacity="0.6"
        />
        <rect
          x="27"
          y="18"
          width="10"
          height="34"
          rx="2"
          fill="#F97316"
          opacity="0.8"
        />
        <rect
          x="42"
          y="24"
          width="10"
          height="28"
          rx="2"
          fill="#F97316"
          opacity="0.6"
        />
        <line
          x1="10"
          y1="52"
          x2="54"
          y2="52"
          stroke="#F97316"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredListings = useMemo(() => {
    let result = listings.filter((l) => l.status === "Active");
    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    return result;
  }, [activeCategory, sort]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-surface-warm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.03)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl sm:text-6xl text-text-primary tracking-tight">
              Buy & sell on campus
            </h1>
            <p className="text-base sm:text-lg text-text-muted mt-4 max-w-md mx-auto">
              The peer-to-peer marketplace for students. Powered by Algorand.
            </p>
          </motion.div>

          {/* Hero Search Box */}
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 sm:mt-12 max-w-2xl mx-auto relative"
          >
            <div className="w-full flex items-center gap-3 px-6 py-4 sm:py-5 rounded-2xl bg-white border border-border hover:border-accent/30 transition-all focus-within:border-accent/40 focus-within:shadow-xl focus-within:shadow-accent/5"
              style={{ boxShadow: searchOpen ? "0 4px 24px -4px rgba(37,99,235,0.10)" : undefined }}
            >
              <Search className="w-5 h-5 text-text-light shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search for textbooks, electronics, furniture..."
                className="flex-1 text-base text-text-primary placeholder:text-text-light bg-transparent outline-none"
              />
              {searchQuery ? (
                <button
                  onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); }}
                  className="p-1.5 rounded-full hover:bg-surface transition-colors"
                >
                  <X className="w-4 h-4 text-text-light" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded-md border border-border bg-surface px-2 text-[10px] font-mono text-text-light">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Animated dropdown */}
            <SearchDialog
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
              query={searchQuery}
              onQueryChange={(q) => { setSearchQuery(q); }}
            />
          </motion.div>
        </div>
      </section>

      {/* Categories for Students */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-4 h-4 text-accent" />
          <h2 className="font-serif text-xl sm:text-2xl text-text-primary">
            Recommended categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {studentCategories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() =>
                setActiveCategory(activeCategory === cat.id ? "all" : cat.id)
              }
              className="group text-left focus:outline-none"
            >
              <div
                className={`relative flex flex-col items-center justify-between rounded-2xl overflow-hidden transition-all duration-300 ${activeCategory === cat.id
                    ? "ring-2 ring-offset-2"
                    : "hover:scale-[1.03] hover:shadow-lg"
                  }`}
                style={{
                  background: cat.bg,
                  minHeight: "160px",
                  padding: "18px 12px 14px",
                  boxShadow:
                    activeCategory === cat.id
                      ? `0 0 0 2px ${cat.accent}`
                      : undefined,
                }}
              >
                {/* Illustration centred */}
                <div className="flex-1 flex items-center justify-center w-full">
                  {cat.icon}
                </div>

                {/* Title + context at bottom */}
                <div className="w-full text-center mt-3">
                  <p
                    className="font-semibold text-[13px] leading-tight"
                    style={{ color: cat.accent }}
                  >
                    {cat.title}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 leading-snug opacity-75"
                    style={{ color: cat.accent }}
                  >
                    {cat.context}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Recommended for You — Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="font-serif text-xl sm:text-2xl text-text-primary">
              Recommended for you
            </h2>
            <span className="text-xs text-text-light bg-surface-2 px-2.5 py-1 rounded-full">
              {filteredListings.length}
            </span>
          </div>
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-[13px] text-text-muted hover:text-text-primary hover:border-border-hover transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeCategory !== "all" && (
              <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center ml-0.5">
                1
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeCategory !== "all" && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] text-text-light uppercase tracking-wider">
              Filtered:
            </span>
            <button
              onClick={() => setActiveCategory("all")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light border border-accent/20 text-xs text-accent hover:bg-accent/10 transition-all"
            >
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              <span>×</span>
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredListings.map((listing, i) => (
            <ProductCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-text-muted">
              No listings found
            </p>
            <p className="text-sm text-text-light mt-2">
              Try removing some filters
            </p>
          </div>
        )}
      </section>

      {/* Filters — Left Sidebar */}
      <FiltersPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sort={sort}
        onSortChange={setSort}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      {/* Floating QR Scanner */}
      <HomeQRScanner />
    </div>
  );
}

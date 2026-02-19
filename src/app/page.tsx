"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, GraduationCap } from "lucide-react";
import { listings } from "@/lib/mock-data";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FiltersPanel } from "@/components/marketplace/FiltersPanel";
import { SearchDialog } from "@/components/search/SearchDialog";

const studentCategories = [
  {
    id: "books",
    title: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
  },
  {
    id: "electronics",
    title: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
  },
  {
    id: "furniture",
    title: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
  {
    id: "clothing",
    title: "Clothing",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
  },
  {
    id: "gaming",
    title: "Gaming",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop",
  },
  {
    id: "transport",
    title: "Transport",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
  },
  {
    id: "supplies",
    title: "Supplies",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop",
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState("latest");

  const filteredListings = useMemo(() => {
    let result = listings.filter((l) => l.status === "Active");
    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }
    switch (sort) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "popular": result.sort((a, b) => b.views - a.views); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

          {/* Hero Search Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 sm:mt-12 max-w-2xl mx-auto"
          >
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 px-6 py-4 sm:py-5 rounded-2xl bg-white border border-border text-left hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group cursor-text"
            >
              <Search className="w-5 h-5 text-text-light group-hover:text-accent transition-colors" />
              <span className="flex-1 text-base text-text-light">Search for textbooks, electronics, furniture...</span>
              <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded-md border border-border bg-surface px-2 text-[10px] font-mono text-text-light">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories for Students */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-widest font-medium mb-6">
          <GraduationCap className="w-3.5 h-3.5" />
          Recommended for students
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {studentCategories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
              className="group text-left"
            >
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden mb-2.5 transition-all ${activeCategory === cat.id
                ? "ring-2 ring-accent ring-offset-2"
                : "hover:shadow-md hover:shadow-black/10"
                }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium transition-all ${activeCategory === cat.id
                ? "bg-accent text-white"
                : "bg-surface-2 text-text-muted group-hover:bg-accent/10 group-hover:text-accent"
                }`}>
                {cat.title}
              </span>
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
            <span className="text-[11px] text-text-light uppercase tracking-wider">Filtered:</span>
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
            <p className="font-serif text-xl text-text-muted">No listings found</p>
            <p className="text-sm text-text-light mt-2">Try removing some filters</p>
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

      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, BookOpen, Laptop, Armchair, Shirt, Gamepad2, Bike, Pencil, RotateCcw } from "lucide-react";

interface FiltersPanelProps {
     isOpen: boolean;
     onClose: () => void;
     sort: string;
     onSortChange: (sort: string) => void;
     activeCategory: string;
     onCategoryChange: (cat: string) => void;
}

const sortOptions = [
     { value: "latest", label: "Latest" },
     { value: "price-low", label: "Low → High" },
     { value: "price-high", label: "High → Low" },
     { value: "popular", label: "Popular" },
];

const conditionOptions = ["Like New", "Good", "Fair"];

const categoryOptions = [
     { id: "all", label: "All", icon: null },
     { id: "books", label: "Books", icon: BookOpen },
     { id: "electronics", label: "Gadgets", icon: Laptop },
     { id: "furniture", label: "Furniture", icon: Armchair },
     { id: "clothing", label: "Clothing", icon: Shirt },
     { id: "gaming", label: "Gaming", icon: Gamepad2 },
     { id: "transport", label: "Transport", icon: Bike },
     { id: "supplies", label: "Supplies", icon: Pencil },
];

export function FiltersPanel({ isOpen, onClose, sort, onSortChange, activeCategory, onCategoryChange }: FiltersPanelProps) {
     const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
     const [priceRange, setPriceRange] = useState<[string, string]>(["", ""]);

     const toggleCondition = (c: string) => {
          setSelectedConditions((prev) =>
               prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
          );
     };

     const activeCount = (activeCategory !== "all" ? 1 : 0) + selectedConditions.length + (sort !== "latest" ? 1 : 0);

     return (
          <AnimatePresence>
               {isOpen && (
                    <>
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={onClose}
                              className="fixed inset-0 bg-black/15 backdrop-blur-sm z-40"
                         />
                         <motion.div
                              initial={{ x: "-100%" }}
                              animate={{ x: 0 }}
                              exit={{ x: "-100%" }}
                              transition={{ type: "spring", damping: 30, stiffness: 300 }}
                              className="fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-border/50 shadow-2xl flex flex-col overflow-hidden"
                         >
                              <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto">
                                   {/* Header */}
                                   <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/30 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                             <h3 className="font-serif text-xl text-text-primary">Filters</h3>
                                             {activeCount > 0 && (
                                                  <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">{activeCount}</span>
                                             )}
                                        </div>
                                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-2/50 text-text-muted hover:text-text-primary transition-all">
                                             <X className="w-5 h-5" />
                                        </button>
                                   </div>

                                   {/* Category */}
                                   <div className="mb-5 flex-shrink-0">
                                        <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Category</p>
                                        <div className="grid grid-cols-2 gap-2">
                                             {categoryOptions.map((cat) => {
                                                  const isActive = activeCategory === cat.id;
                                                  return (
                                                       <button
                                                            key={cat.id}
                                                            onClick={() => onCategoryChange(cat.id)}
                                                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                                                                      ? "bg-text-primary text-white"
                                                                      : "bg-surface hover:bg-surface-2 text-text-muted border border-border/50"
                                                                 }`}
                                                       >
                                                            {cat.icon && <cat.icon className="w-4 h-4" />}
                                                            <span className="font-medium">{cat.label}</span>
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>

                                   {/* Sort */}
                                   <div className="mb-5 flex-shrink-0">
                                        <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Sort By</p>
                                        <div className="grid grid-cols-2 gap-2">
                                             {sortOptions.map((opt) => (
                                                  <button
                                                       key={opt.value}
                                                       onClick={() => onSortChange(opt.value)}
                                                       className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${sort === opt.value
                                                                 ? "bg-text-primary text-white"
                                                                 : "bg-surface hover:bg-surface-2 text-text-muted border border-border/50"
                                                            }`}
                                                  >
                                                       {opt.label}
                                                  </button>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Condition */}
                                   <div className="mb-5 flex-shrink-0">
                                        <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Condition</p>
                                        <div className="flex gap-2">
                                             {conditionOptions.map((c) => {
                                                  const selected = selectedConditions.includes(c);
                                                  return (
                                                       <button
                                                            key={c}
                                                            onClick={() => toggleCondition(c)}
                                                            className={`flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-sm font-medium transition-all ${selected
                                                                      ? "bg-text-primary text-white"
                                                                      : "bg-surface hover:bg-surface-2 text-text-muted border border-border/50"
                                                                 }`}
                                                       >
                                                            {selected && <Check className="w-4 h-4" />}
                                                            {c}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>

                                   {/* Price */}
                                   <div className="mb-5 flex-shrink-0">
                                        <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Price Range (ALGO)</p>
                                        <div className="flex items-center gap-2">
                                             <input
                                                  type="number"
                                                  value={priceRange[0]}
                                                  onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                                                  placeholder="0"
                                                  className="w-0 flex-1 px-3 py-3 rounded-xl bg-surface border border-border/50 text-sm text-text-primary font-mono placeholder:text-text-light focus:outline-none focus:border-text-primary/50 focus:ring-2 focus:ring-text-primary/10 transition-all"
                                             />
                                             <span className="text-text-light font-medium">—</span>
                                             <input
                                                  type="number"
                                                  value={priceRange[1]}
                                                  onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                                                  placeholder="0"
                                                  className="w-0 flex-1 px-3 py-3 rounded-xl bg-surface border border-border/50 text-sm text-text-primary font-mono placeholder:text-text-light focus:outline-none focus:border-text-primary/50 focus:ring-2 focus:ring-text-primary/10 transition-all"
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-3 mt-auto pt-5 border-t border-border/30 flex-shrink-0">
                                   <button
                                        onClick={() => {
                                             setSelectedConditions([]);
                                             setPriceRange(["", ""]);
                                             onSortChange("latest");
                                             onCategoryChange("all");
                                        }}
                                        className="flex-1 py-3 rounded-xl border border-border/50 text-sm font-medium text-text-muted hover:text-text-primary hover:border-border transition-all"
                                   >
                                        Reset All
                                   </button>
                                   <button
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl bg-text-primary hover:bg-text-primary/90 text-white text-sm font-semibold transition-all active:scale-[0.98]"
                                   >
                                        Apply Filters
                                   </button>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

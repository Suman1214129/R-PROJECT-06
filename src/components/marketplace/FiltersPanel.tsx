"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, BookOpen, Laptop, Armchair, Shirt, Gamepad2, Bike, Pencil } from "lucide-react";

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
     const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

     const toggleCondition = (c: string) => {
          setSelectedConditions((prev) =>
               prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
          );
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
                              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                         />
                         <motion.div
                              initial={{ y: "100%" }}
                              animate={{ y: 0 }}
                              exit={{ y: "100%" }}
                              transition={{ type: "spring", damping: 28, stiffness: 350 }}
                              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl border-t border-border"
                         >
                              {/* Handle */}
                              <div className="flex justify-center pt-2.5 pb-0.5">
                                   <div className="w-8 h-1 rounded-full bg-border" />
                              </div>

                              <div className="px-5 pb-5">
                                   {/* Header */}
                                   <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-serif text-base text-text-primary italic">Filters</h3>
                                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-2 text-text-muted transition-colors">
                                             <X className="w-4 h-4" />
                                        </button>
                                   </div>

                                   {/* Category — Compact horizontal scroll */}
                                   <div className="mb-4">
                                        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2">Category</p>
                                        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
                                             {categoryOptions.map((cat) => {
                                                  const isActive = activeCategory === cat.id;
                                                  return (
                                                       <button
                                                            key={cat.id}
                                                            onClick={() => onCategoryChange(cat.id)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all shrink-0 ${isActive
                                                                      ? "bg-text-primary text-white"
                                                                      : "bg-surface-2 text-text-muted border border-border hover:border-border-hover"
                                                                 }`}
                                                       >
                                                            {cat.icon && <cat.icon className="w-3 h-3" />}
                                                            {cat.label}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>

                                   {/* Sort — Compact row */}
                                   <div className="mb-4">
                                        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2">Sort</p>
                                        <div className="flex gap-1.5">
                                             {sortOptions.map((opt) => (
                                                  <button
                                                       key={opt.value}
                                                       onClick={() => onSortChange(opt.value)}
                                                       className={`flex-1 py-2 rounded-xl text-[12px] text-center transition-all ${sort === opt.value
                                                                 ? "bg-text-primary text-white font-medium"
                                                                 : "bg-surface-2 text-text-muted border border-border"
                                                            }`}
                                                  >
                                                       {opt.label}
                                                  </button>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Condition — Compact */}
                                   <div className="mb-4">
                                        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2">Condition</p>
                                        <div className="flex gap-1.5">
                                             {conditionOptions.map((c) => {
                                                  const selected = selectedConditions.includes(c);
                                                  return (
                                                       <button
                                                            key={c}
                                                            onClick={() => toggleCondition(c)}
                                                            className={`flex items-center gap-1 flex-1 justify-center py-2 rounded-xl text-[12px] transition-all ${selected
                                                                      ? "bg-text-primary text-white font-medium"
                                                                      : "bg-surface-2 text-text-muted border border-border"
                                                                 }`}
                                                       >
                                                            {selected && <Check className="w-3 h-3" />}
                                                            {c}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>

                                   {/* Price — Compact inline */}
                                   <div className="mb-5">
                                        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2">Price (ALGO)</p>
                                        <div className="flex items-center gap-2">
                                             <input
                                                  type="number"
                                                  value={priceRange[0]}
                                                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                                  placeholder="Min"
                                                  className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-[12px] text-text-primary font-mono placeholder:text-text-light focus:outline-none focus:border-border-hover transition-all"
                                             />
                                             <span className="text-text-light text-xs">—</span>
                                             <input
                                                  type="number"
                                                  value={priceRange[1]}
                                                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                  placeholder="Max"
                                                  className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-[12px] text-text-primary font-mono placeholder:text-text-light focus:outline-none focus:border-border-hover transition-all"
                                             />
                                        </div>
                                   </div>

                                   {/* Actions */}
                                   <div className="flex gap-2">
                                        <button
                                             onClick={() => {
                                                  setSelectedConditions([]);
                                                  setPriceRange([0, 1000]);
                                                  onSortChange("latest");
                                                  onCategoryChange("all");
                                             }}
                                             className="flex-1 py-2.5 rounded-full border border-border text-[12px] text-text-muted hover:text-text-primary transition-all"
                                        >
                                             Reset
                                        </button>
                                        <button
                                             onClick={onClose}
                                             className="flex-1 py-2.5 rounded-full bg-text-primary hover:bg-primary-hover text-white text-[12px] font-medium transition-all active:scale-[0.97]"
                                        >
                                             Apply
                                        </button>
                                   </div>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

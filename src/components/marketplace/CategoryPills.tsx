"use client";

import { motion } from "framer-motion";
import { LayoutGrid, BookOpen, Laptop, Armchair, Shirt, Gamepad2, Bike, Pencil } from "lucide-react";
import { categories } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
     LayoutGrid,
     BookOpen,
     Laptop,
     Armchair,
     Shirt,
     Gamepad2,
     Bike,
     Pencil,
};

interface CategoryPillsProps {
     activeCategory: string;
     onCategoryChange: (cat: string) => void;
}

export function CategoryPills({ activeCategory, onCategoryChange }: CategoryPillsProps) {
     return (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
               {categories.map((cat) => {
                    const Icon = iconMap[cat.iconName] || LayoutGrid;
                    const isActive = activeCategory === cat.id;
                    return (
                         <button
                              key={cat.id}
                              onClick={() => onCategoryChange(cat.id)}
                              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${isActive
                                        ? "text-primary"
                                        : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                                   }`}
                         >
                              <Icon className="w-4 h-4" />
                              {cat.label}
                              {isActive && (
                                   <motion.div
                                        layoutId="categoryPill"
                                        className="absolute inset-0 rounded-xl bg-primary-light border border-primary/20"
                                        style={{ zIndex: -1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                   />
                              )}
                         </button>
                    );
               })}
          </div>
     );
}

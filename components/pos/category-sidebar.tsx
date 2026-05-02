"use client";

import { Coffee, Croissant, Salad, GlassWater } from "lucide-react";
import type { Category } from "@/lib/pos-types";
import { categoryLabels } from "@/lib/products-data";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  cafe: <Coffee className="w-5 h-5" />,
  breakfast: <Croissant className="w-5 h-5" />,
  lunch: <Salad className="w-5 h-5" />,
  soft: <GlassWater className="w-5 h-5" />,
};

const categories: Category[] = ["cafe", "breakfast", "lunch", "soft"];

export function CategorySidebar({
  activeCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <aside className="w-20 lg:w-28 bg-sidebar text-sidebar-foreground flex flex-col gap-2 p-2 shrink-0">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all aspect-square",
            activeCategory === category
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
              : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          )}
          aria-label={categoryLabels[category]}
        >
          {categoryIcons[category]}
          <span className="text-xs font-medium text-center leading-tight">
            {categoryLabels[category]}
          </span>
        </button>
      ))}
    </aside>
  );
}

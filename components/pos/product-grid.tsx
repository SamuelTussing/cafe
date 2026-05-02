"use client";

import type { Product, Category } from "@/lib/pos-types";
import { products, categoryLabels } from "@/lib/products-data";

interface ProductGridProps {
  category: Category;
  onSelectProduct: (product: Product) => void;
}

export function ProductGrid({ category, onSelectProduct }: ProductGridProps) {
  const categoryProducts = products[category];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {categoryLabels[category]}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categoryProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all text-center min-h-[100px]"
            >
              <span className="font-medium text-card-foreground text-sm leading-tight mb-2">
                {product.name}
              </span>
              <span className="text-primary font-semibold">
                {product.basePrice.toFixed(2)} $
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

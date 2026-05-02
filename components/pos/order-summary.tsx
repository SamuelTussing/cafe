"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { OrderItem } from "@/lib/pos-types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function OrderSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSummaryProps) {
  const formatItemDetails = (item: OrderItem): string => {
    const details: string[] = [];
    if (item.selectedSize) details.push(item.selectedSize.name);
    if (item.selectedCoffeeType && item.selectedCoffeeType.id !== "regular") {
      details.push(item.selectedCoffeeType.name);
    }
    if (item.selectedExtras && item.selectedExtras.length > 0) {
      const extras = item.selectedExtras
        .filter((e) => e.id !== "none")
        .map((e) => e.name);
      details.push(...extras);
    }
    return details.join(" • ");
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm text-center">
          Aucun article dans la commande
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-card-foreground text-sm truncate">
                  {item.product.name}
                </h4>
                {formatItemDetails(item) && (
                  <p className="text-xs text-muted-foreground truncate">
                    {formatItemDetails(item)}
                  </p>
                )}
              </div>
              <span className="font-semibold text-primary text-sm whitespace-nowrap">
                {item.totalPrice.toFixed(2)} €
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-medium text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Supprimer l'article"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

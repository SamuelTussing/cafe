"use client";

import { Trash2 } from "lucide-react";

interface OrderTotalProps {
  total: number;
  itemCount: number;
  onClearOrder: () => void;
}

export function OrderTotal({ total, itemCount, onClearOrder }: OrderTotalProps) {
  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">
          {itemCount} article{itemCount !== 1 ? "s" : ""}
        </span>
        {itemCount > 0 && (
          <button
            onClick={onClearOrder}
            className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Vider
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-primary">
          {total.toFixed(2)} $
        </span>
      </div>
      <button
        disabled={itemCount === 0}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Payer
      </button>
    </div>
  );
}

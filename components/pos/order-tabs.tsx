"use client";

import { Plus, X } from "lucide-react";
import type { Order } from "@/lib/pos-types";
import { cn } from "@/lib/utils";

interface OrderTabsProps {
  orders: Order[];
  activeOrderId: string;
  onSelectOrder: (orderId: string) => void;
  onAddOrder: () => void;
  onRemoveOrder: (orderId: string) => void;
}

export function OrderTabs({
  orders,
  activeOrderId,
  onSelectOrder,
  onAddOrder,
  onRemoveOrder,
}: OrderTabsProps) {
  return (
    <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="flex items-center h-14 px-4 gap-2">
        <div className="flex items-center gap-1 overflow-x-auto flex-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-all min-w-[120px]",
                activeOrderId === order.id
                  ? "bg-background text-foreground"
                  : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              )}
              onClick={() => onSelectOrder(order.id)}
            >
              <span className="text-sm font-medium truncate">{order.name}</span>
              {orders.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveOrder(order.id);
                  }}
                  className="p-0.5 rounded hover:bg-destructive/20 transition-colors"
                  aria-label={`Fermer ${order.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onAddOrder}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors text-sm font-medium"
          aria-label="Nouvelle commande"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouvelle</span>
        </button>
      </div>
    </header>
  );
}

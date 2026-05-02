"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Product, ProductOption, OrderItem } from "@/lib/pos-types";
import { cn } from "@/lib/utils";

interface CustomizationModalProps {
  product: Product;
  onConfirm: (item: Omit<OrderItem, "id">) => void;
  onClose: () => void;
}

export function CustomizationModal({
  product,
  onConfirm,
  onClose,
}: CustomizationModalProps) {
  const customization = product.customization;
  
  const [selectedSize, setSelectedSize] = useState<ProductOption | undefined>(
    customization?.sizes[0]
  );
  const [selectedCoffeeType, setSelectedCoffeeType] = useState<ProductOption | undefined>(
    customization?.coffeeTypes?.[0]
  );
  const [selectedExtras, setSelectedExtras] = useState<ProductOption[]>([]);

  useEffect(() => {
    // Reset when product changes
    setSelectedSize(customization?.sizes[0]);
    setSelectedCoffeeType(customization?.coffeeTypes?.[0]);
    setSelectedExtras([]);
  }, [product.id, customization]);

  const calculateTotal = (): number => {
    let total = product.basePrice;
    if (selectedSize) total += selectedSize.price;
    if (selectedCoffeeType) total += selectedCoffeeType.price;
    selectedExtras.forEach((extra) => {
      total += extra.price;
    });
    return total;
  };

  const handleExtraToggle = (extra: ProductOption) => {
    if (extra.id === "none") {
      setSelectedExtras([]);
      return;
    }
    
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev.filter((e) => e.id !== "none"), extra];
    });
  };

  const handleConfirm = () => {
    onConfirm({
      product,
      quantity: 1,
      selectedSize,
      selectedCoffeeType,
      selectedExtras: selectedExtras.length > 0 ? selectedExtras : undefined,
      totalPrice: calculateTotal(),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Size Selection */}
          {customization?.sizes && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Taille
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {customization.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-center",
                      selectedSize?.id === size.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="block font-medium text-sm">{size.name}</span>
                    {size.price > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +{size.price.toFixed(2)} $
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coffee Type Selection */}
          {customization?.coffeeTypes && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Type de café
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {customization.coffeeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCoffeeType(type)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-center",
                      selectedCoffeeType?.id === type.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="block font-medium text-sm">{type.name}</span>
                    {type.price > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +{type.price.toFixed(2)} $
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras Selection */}
          {customization?.extras && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Extras
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {customization.extras.map((extra) => (
                  <button
                    key={extra.id}
                    onClick={() => handleExtraToggle(extra)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-left",
                      extra.id === "none"
                        ? selectedExtras.length === 0
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                        : selectedExtras.find((e) => e.id === extra.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="block font-medium text-sm">{extra.name}</span>
                    {extra.price > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +{extra.price.toFixed(2)} $
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              {calculateTotal().toFixed(2)} $
            </span>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Ajouter à la commande
          </button>
        </div>
      </div>
    </div>
  );
}

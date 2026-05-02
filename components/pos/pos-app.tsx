"use client";

import { useState, useCallback } from "react";
import type { Order, OrderItem, Product, Category } from "@/lib/pos-types";
import { OrderTabs } from "./order-tabs";
import { CategorySidebar } from "./category-sidebar";
import { ProductGrid } from "./product-grid";
import { OrderSummary } from "./order-summary";
import { OrderTotal } from "./order-total";
import { CustomizationModal } from "./customization-modal";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createNewOrder(orderNumber: number): Order {
  return {
    id: generateId(),
    name: `Commande ${orderNumber}`,
    items: [],
    total: 0,
    createdAt: new Date(),
  };
}

export function POSApp() {
  const [orders, setOrders] = useState<Order[]>([createNewOrder(1)]);
  const [activeOrderId, setActiveOrderId] = useState(orders[0].id);
  const [activeCategory, setActiveCategory] = useState<Category>("cafe");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderCounter, setOrderCounter] = useState(2);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const updateOrder = useCallback((orderId: string, updater: (order: Order) => Order) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updated = updater(order);
        return {
          ...updated,
          total: updated.items.reduce(
            (sum, item) => sum + item.totalPrice * item.quantity,
            0
          ),
        };
      })
    );
  }, []);

  const handleAddOrder = () => {
    const newOrder = createNewOrder(orderCounter);
    setOrders((prev) => [...prev, newOrder]);
    setActiveOrderId(newOrder.id);
    setOrderCounter((c) => c + 1);
  };

  const handleRemoveOrder = (orderId: string) => {
    if (orders.length <= 1) return;
    const newOrders = orders.filter((o) => o.id !== orderId);
    setOrders(newOrders);
    if (activeOrderId === orderId) {
      setActiveOrderId(newOrders[0].id);
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (product.customization) {
      setSelectedProduct(product);
    } else {
      // Add directly without customization
      const newItem: OrderItem = {
        id: generateId(),
        product,
        quantity: 1,
        totalPrice: product.basePrice,
      };
      updateOrder(activeOrderId, (order) => ({
        ...order,
        items: [...order.items, newItem],
      }));
    }
  };

  const handleConfirmCustomization = (item: Omit<OrderItem, "id">) => {
    const newItem: OrderItem = {
      ...item,
      id: generateId(),
    };
    updateOrder(activeOrderId, (order) => ({
      ...order,
      items: [...order.items, newItem],
    }));
    setSelectedProduct(null);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    updateOrder(activeOrderId, (order) => ({
      ...order,
      items: order.items
        .map((item) => {
          if (item.id !== itemId) return item;
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        })
        .filter(Boolean) as OrderItem[],
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    updateOrder(activeOrderId, (order) => ({
      ...order,
      items: order.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleClearOrder = () => {
    updateOrder(activeOrderId, (order) => ({
      ...order,
      items: [],
    }));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header with tabs */}
      <OrderTabs
        orders={orders}
        activeOrderId={activeOrderId}
        onSelectOrder={setActiveOrderId}
        onAddOrder={handleAddOrder}
        onRemoveOrder={handleRemoveOrder}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category sidebar */}
        <CategorySidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Central area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Products and Order Summary (mobile: stacked, desktop: side by side) */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Order Summary (mobile: top, desktop: left) */}
            <div className="h-48 lg:h-auto lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-border bg-muted/30 flex flex-col order-1 lg:order-1">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">
                  {activeOrder.name}
                </h3>
              </div>
              <OrderSummary
                items={activeOrder.items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Right: Product Grid */}
            <div className="flex-1 bg-background overflow-hidden flex flex-col order-2 lg:order-2">
              <ProductGrid
                category={activeCategory}
                onSelectProduct={handleSelectProduct}
              />
            </div>
          </div>

          {/* Right sidebar - Order total */}
          <aside className="w-full lg:w-64 xl:w-72 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col">
            <div className="flex-1 hidden lg:block" />
            <OrderTotal
              total={activeOrder.total}
              itemCount={activeOrder.items.reduce((sum, i) => sum + i.quantity, 0)}
              onClearOrder={handleClearOrder}
            />
          </aside>
        </main>
      </div>

      {/* Customization Modal */}
      {selectedProduct && (
        <CustomizationModal
          product={selectedProduct}
          onConfirm={handleConfirmCustomization}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

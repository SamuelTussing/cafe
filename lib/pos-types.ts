export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductCustomization {
  sizes: ProductOption[];
  coffeeTypes?: ProductOption[];
  extras?: ProductOption[];
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  customization?: ProductCustomization;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: ProductOption;
  selectedCoffeeType?: ProductOption;
  selectedExtras?: ProductOption[];
  totalPrice: number;
}

export interface Order {
  id: string;
  name: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

export type Category = "cafe" | "breakfast" | "lunch" | "soft";

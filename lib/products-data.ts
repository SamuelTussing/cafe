import type { Product, Category } from "./pos-types";

const coffeeCustomization = {
  sizes: [
    { id: "small", name: "Small", price: 0 },
    { id: "medium", name: "Medium", price: 0.5 },
    { id: "large", name: "Large", price: 1 },
  ],
  coffeeTypes: [
    { id: "regular", name: "Regular", price: 0 },
    { id: "decaf", name: "Décaféiné", price: 0 },
    { id: "organic", name: "Bio", price: 0.5 },
  ],
  extras: [
    { id: "none", name: "Aucun", price: 0 },
    { id: "extra-shot", name: "Shot extra", price: 0.8 },
    { id: "oat-milk", name: "Lait d'avoine", price: 0.6 },
    { id: "almond-milk", name: "Lait d'amande", price: 0.6 },
    { id: "vanilla", name: "Sirop vanille", price: 0.5 },
    { id: "caramel", name: "Sirop caramel", price: 0.5 },
  ],
};

const softCustomization = {
  sizes: [
    { id: "small", name: "33cl", price: 0 },
    { id: "large", name: "50cl", price: 1 },
  ],
};

export const products: Record<Category, Product[]> = {
  cafe: [
    { id: "espresso", name: "Espresso", basePrice: 2.5, category: "cafe", customization: coffeeCustomization },
    { id: "long-black", name: "Long Black", basePrice: 3.0, category: "cafe", customization: coffeeCustomization },
    { id: "cappuccino", name: "Cappuccino", basePrice: 4.0, category: "cafe", customization: coffeeCustomization },
    { id: "latte", name: "Latte", basePrice: 4.0, category: "cafe", customization: coffeeCustomization },
    { id: "mocha", name: "Mocha", basePrice: 4.5, category: "cafe", customization: coffeeCustomization },
    { id: "flat-white", name: "Flat White", basePrice: 4.0, category: "cafe", customization: coffeeCustomization },
    { id: "americano", name: "Americano", basePrice: 3.0, category: "cafe", customization: coffeeCustomization },
    { id: "macchiato", name: "Macchiato", basePrice: 3.5, category: "cafe", customization: coffeeCustomization },
  ],
  breakfast: [
    { id: "croissant", name: "Croissant", basePrice: 2.5, category: "breakfast" },
    { id: "pain-chocolat", name: "Pain au chocolat", basePrice: 2.8, category: "breakfast" },
    { id: "toast-avocado", name: "Toast Avocat", basePrice: 8.5, category: "breakfast" },
    { id: "eggs-benedict", name: "Oeufs Bénédicte", basePrice: 12.0, category: "breakfast" },
    { id: "pancakes", name: "Pancakes", basePrice: 9.5, category: "breakfast" },
    { id: "granola", name: "Granola Bowl", basePrice: 7.5, category: "breakfast" },
    { id: "omelette", name: "Omelette", basePrice: 10.0, category: "breakfast" },
    { id: "french-toast", name: "Pain Perdu", basePrice: 8.0, category: "breakfast" },
  ],
  lunch: [
    { id: "club-sandwich", name: "Club Sandwich", basePrice: 12.0, category: "lunch" },
    { id: "caesar-salad", name: "Salade César", basePrice: 11.0, category: "lunch" },
    { id: "quiche", name: "Quiche du jour", basePrice: 9.5, category: "lunch" },
    { id: "soup", name: "Soupe du jour", basePrice: 6.5, category: "lunch" },
    { id: "croque-monsieur", name: "Croque Monsieur", basePrice: 8.5, category: "lunch" },
    { id: "burger", name: "Burger Maison", basePrice: 14.0, category: "lunch" },
    { id: "poke-bowl", name: "Poké Bowl", basePrice: 13.5, category: "lunch" },
    { id: "wrap", name: "Wrap Poulet", basePrice: 10.0, category: "lunch" },
  ],
  soft: [
    { id: "eau", name: "Eau minérale", basePrice: 2.5, category: "soft", customization: softCustomization },
    { id: "coca", name: "Coca-Cola", basePrice: 3.5, category: "soft", customization: softCustomization },
    { id: "orangina", name: "Orangina", basePrice: 3.5, category: "soft", customization: softCustomization },
    { id: "jus-orange", name: "Jus d'orange", basePrice: 4.0, category: "soft" },
    { id: "jus-pomme", name: "Jus de pomme", basePrice: 4.0, category: "soft" },
    { id: "limonade", name: "Limonade", basePrice: 4.5, category: "soft" },
    { id: "the-glace", name: "Thé glacé", basePrice: 4.0, category: "soft" },
    { id: "smoothie", name: "Smoothie", basePrice: 6.0, category: "soft" },
  ],
};

export const categoryLabels: Record<Category, string> = {
  cafe: "Café",
  breakfast: "Breakfast",
  lunch: "Lunch",
  soft: "Soft",
};

export const categoryIcons: Record<Category, string> = {
  cafe: "☕",
  breakfast: "🥐",
  lunch: "🥗",
  soft: "🥤",
};

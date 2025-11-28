import { Product, Aisle } from '../types';

export const AISLES: Aisle[] = [
  // Left Column
  { id: 1, name: "Produce", categories: ["Fruit", "Vegetables"], coordinates: { x: 5, y: 10, w: 20, h: 35 } },
  { id: 2, name: "Bakery & Deli", categories: ["Bread", "Deli Meat", "Cheese"], coordinates: { x: 5, y: 55, w: 20, h: 35 } },
  
  // Center Column
  { id: 3, name: "Pantry Staples", categories: ["Pasta", "Rice", "Canned"], coordinates: { x: 40, y: 10, w: 20, h: 35 } },
  { id: 4, name: "Snacks & Drinks", categories: ["Chips", "Soda", "Juice"], coordinates: { x: 40, y: 55, w: 20, h: 35 } },
  
  // Right Column
  { id: 5, name: "Dairy & Frozen", categories: ["Milk", "Eggs", "Ice Cream"], coordinates: { x: 75, y: 10, w: 20, h: 35 } },
  { id: 6, name: "Meat & Seafood", categories: ["Beef", "Chicken", "Fish"], coordinates: { x: 75, y: 55, w: 20, h: 35 } },
];

export const PRODUCTS: Product[] = [
  // Aisle 1: Produce
  { id: 'p1', name: "Bananas", category: "Fruit", aisle: 1, shelf: "A1", price: 0.69, image: "🍌", coordinates: { x: 10, y: 15 } },
  { id: 'p2', name: "Avocados", category: "Vegetables", aisle: 1, shelf: "A2", price: 1.50, image: "🥑", coordinates: { x: 12, y: 20 } },
  { id: 'p3', name: "Tomatoes", category: "Vegetables", aisle: 1, shelf: "B1", price: 2.99, image: "🍅", coordinates: { x: 15, y: 25 } },
  { id: 'p4', name: "Lettuce", category: "Vegetables", aisle: 1, shelf: "C1", price: 1.99, image: "🥬", coordinates: { x: 18, y: 30 } },
  { id: 'p5', name: "Onions", category: "Vegetables", aisle: 1, shelf: "C2", price: 0.99, image: "🧅", coordinates: { x: 20, y: 35 } },
  { id: 'p6', name: "Apples", category: "Fruit", aisle: 1, shelf: "A3", price: 3.99, image: "🍎", coordinates: { x: 10, y: 35 } },

  // Aisle 2: Bakery
  { id: 'b1', name: "Sourdough Bread", category: "Bread", aisle: 2, shelf: "A1", price: 4.50, image: "🍞", coordinates: { x: 10, y: 60 } },
  { id: 'b2', name: "Bagels", category: "Bread", aisle: 2, shelf: "B2", price: 3.99, image: "🥯", coordinates: { x: 15, y: 65 } },
  { id: 'b3', name: "Turkey Slices", category: "Deli Meat", aisle: 2, shelf: "C1", price: 5.99, image: "🍖", coordinates: { x: 20, y: 70 } },
  { id: 'b4', name: "Cheddar Cheese", category: "Cheese", aisle: 2, shelf: "C2", price: 4.99, image: "🧀", coordinates: { x: 22, y: 75 } },
  { id: 'b5', name: "Tortillas", category: "Bread", aisle: 2, shelf: "A3", price: 2.50, image: "🌮", coordinates: { x: 12, y: 80 } },

  // Aisle 3: Pantry
  { id: 'pa1', name: "Spaghetti", category: "Pasta", aisle: 3, shelf: "A1", price: 1.29, image: "🍝", coordinates: { x: 45, y: 15 } },
  { id: 'pa2', name: "Marinara Sauce", category: "Canned", aisle: 3, shelf: "A2", price: 3.49, image: "🥫", coordinates: { x: 50, y: 20 } },
  { id: 'pa3', name: "Black Beans", category: "Canned", aisle: 3, shelf: "B1", price: 0.99, image: "🫘", coordinates: { x: 55, y: 25 } },
  { id: 'pa4', name: "Rice", category: "Rice", aisle: 3, shelf: "C1", price: 5.99, image: "🍚", coordinates: { x: 45, y: 35 } },
  { id: 'pa5', name: "Taco Shells", category: "Pantry", aisle: 3, shelf: "B2", price: 2.99, image: "🌮", coordinates: { x: 50, y: 30 } },
  { id: 'pa6', name: "Salsa", category: "Pantry", aisle: 3, shelf: "B3", price: 3.50, image: "💃", coordinates: { x: 52, y: 32 } },

  // Aisle 4: Snacks
  { id: 's1', name: "Potato Chips", category: "Chips", aisle: 4, shelf: "A1", price: 3.99, image: "🥔", coordinates: { x: 45, y: 60 } },
  { id: 's2', name: "Cola", category: "Soda", aisle: 4, shelf: "B1", price: 1.99, image: "🥤", coordinates: { x: 50, y: 70 } },
  { id: 's3', name: "Orange Juice", category: "Juice", aisle: 4, shelf: "C1", price: 4.50, image: "🍊", coordinates: { x: 55, y: 80 } },
  { id: 's4', name: "Cookies", category: "Snacks", aisle: 4, shelf: "A2", price: 3.99, image: "🍪", coordinates: { x: 48, y: 65 } },

  // Aisle 5: Dairy & Frozen
  { id: 'd1', name: "Whole Milk", category: "Milk", aisle: 5, shelf: "A1", price: 3.29, image: "🥛", coordinates: { x: 80, y: 15 } },
  { id: 'd2', name: "Eggs (12ct)", category: "Eggs", aisle: 5, shelf: "A2", price: 4.99, image: "🥚", coordinates: { x: 85, y: 20 } },
  { id: 'd3', name: "Vanilla Ice Cream", category: "Ice Cream", aisle: 5, shelf: "Frozen", price: 5.99, image: "🍦", coordinates: { x: 90, y: 30 } },
  { id: 'd4', name: "Greek Yogurt", category: "Yogurt", aisle: 5, shelf: "B1", price: 1.20, image: "🥣", coordinates: { x: 82, y: 25 } },

  // Aisle 6: Meat
  { id: 'm1', name: "Ground Beef", category: "Beef", aisle: 6, shelf: "A1", price: 6.99, image: "🥩", coordinates: { x: 80, y: 60 } },
  { id: 'm2', name: "Chicken Breast", category: "Chicken", aisle: 6, shelf: "B1", price: 8.99, image: "🍗", coordinates: { x: 85, y: 70 } },
  { id: 'm3', name: "Salmon Fillet", category: "Fish", aisle: 6, shelf: "C1", price: 12.99, image: "🐟", coordinates: { x: 90, y: 80 } },
];

// Helper to fuzzy search products
export const findProduct = (query: string): Product | undefined => {
  const q = query.toLowerCase();
  // Exact match
  const exact = PRODUCTS.find(p => p.name.toLowerCase() === q);
  if (exact) return exact;
  
  // Partial match
  return PRODUCTS.find(p => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
};

export const getProductById = (id: string) => PRODUCTS.find(p => p.id === id);

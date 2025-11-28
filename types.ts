export interface Product {
  id: string;
  name: string;
  category: string;
  aisle: number;
  shelf?: string;
  price: number;
  image: string;
  coordinates: { x: number; y: number }; // 0-100 scale relative to map
}

export interface ShoppingItem extends Product {
  uniqueId: string; // To handle duplicates
  checked: boolean;
  quantity: number;
  isSuggestion?: boolean; // If added by AI as a suggestion
}

export interface Aisle {
  id: number;
  name: string;
  categories: string[];
  coordinates: { x: number; y: number; w: number; h: number };
}

export interface AIParseResult {
  items: {
    name: string;
    category?: string;
    suggested?: boolean;
    reason?: string;
  }[];
}

export type ViewState = 'HOME' | 'REVIEW' | 'LIST' | 'MAP' | 'SEARCH' | 'DETAILS' | 'HISTORY';

export interface AppState {
  view: ViewState;
  shoppingList: ShoppingItem[];
  history: ShoppingItem[][]; // Simple history of lists
  searchQuery: string;
  selectedProduct: Product | null;
  isProcessing: boolean;
}

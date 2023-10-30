import { type AppSliceCreator } from '../store';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number, quantity: number) => void;
  clearCart: (id: number) => void;
  getTotal: () => number;
  clearAll: () => void;
}

export const createCartSlice: AppSliceCreator<CartSlice> = (set, get) => {
  return {
    items: [],

    addItem: (item: CartItem) => {
      set((state) => {
        const prev = [...state.items];
        const existingItem = prev.find((x) => x.id === item.id);
        const itemList = prev.filter((x) => x.id !== item.id);
        const existing = { ...existingItem } as CartItem;
        if (existing.id) {
          existing.quantity += item.quantity;
          state.items = [...itemList, existing].sort((a, b) => a.id - b.id);
        } else {
          state.items = [...state.items, item].sort((a, b) => a.id - b.id);
        }
      });
    },

    removeItem: (itemId: number, stock: number) => {
      set((state) => {
        const prev = [...state.items];
        const existingItem = prev.find((x) => x.id === itemId);
        const itemList = prev.filter((x) => x.id !== itemId);
        const existing = { ...existingItem } as CartItem;
        if (existing.id && existing.quantity > 1) {
          existing.quantity = existing.quantity - 1;
          state.items = [...itemList, existing].sort((a, b) => a.id - b.id);
          return;
        }
        if (existing.quantity <= 1 || stock <= 0) {
          state.items = itemList;
          return;
        }
      });
    },

    clearCart: (id: number) => {
      set((state) => {
        const existingItem = state.items.filter((x) => x.id !== id);
        state.items = existingItem;
      });
    },
    clearAll: () => {
      set((state) => {
        state.items = [];
      });
    },

    getTotal: () => {
      const total = get().items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      return total;
    },
  };
};

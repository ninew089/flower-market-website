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
  clearCart: () => void;
  getTotal: () => void;
}

export const createCartSlice: AppSliceCreator<CartSlice> = (set, get) => {
  return {
    items: [],

    addItem: (item: CartItem) => {
      set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          state.items.push(item);
        }
      });
    },

    removeItem: (itemId: number, quantity: number) => {
      set((state) => {
        const existingItem = state.items.find((item) => item.id === itemId);
        if (existingItem) {
          if (quantity >= existingItem.quantity) {
            state.items = state.items.filter((item) => item.id !== itemId);
          } else {
            existingItem.quantity -= quantity;
          }
        }
      });
    },

    clearCart: () => {
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

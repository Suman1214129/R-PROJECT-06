import { create } from "zustand";

interface CartItem {
     listingId: string;
     quantity: number;
}

interface CartState {
     items: CartItem[];
     addItem: (listingId: string) => void;
     removeItem: (listingId: string) => void;
     clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
     items: [],

     addItem: (listingId: string) => {
          set((state) => {
               const exists = state.items.find((i) => i.listingId === listingId);
               if (exists) return state;
               return { items: [...state.items, { listingId, quantity: 1 }] };
          });
     },

     removeItem: (listingId: string) => {
          set((state) => ({
               items: state.items.filter((i) => i.listingId !== listingId),
          }));
     },

     clearCart: () => set({ items: [] }),
}));

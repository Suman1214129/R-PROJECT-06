import { create } from "zustand";

interface UIState {
     messagesOpen: boolean;
     setMessagesOpen: (open: boolean) => void;
     toggleMessages: () => void;
}

export const useUIStore = create<UIState>((set) => ({
     messagesOpen: false,
     setMessagesOpen: (open) => set({ messagesOpen: open }),
     toggleMessages: () => set((state) => ({ messagesOpen: !state.messagesOpen })),
}));

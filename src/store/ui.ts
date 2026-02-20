import { create } from "zustand";

interface UIState {
     messagesOpen: boolean;
     hasUnreadMessages: boolean;
     setMessagesOpen: (open: boolean) => void;
     toggleMessages: () => void;
     markMessagesAsRead: () => void;
}

export const useUIStore = create<UIState>((set) => ({
     messagesOpen: false,
     hasUnreadMessages: true,
     setMessagesOpen: (open) => set({ messagesOpen: open }),
     toggleMessages: () => set((state) => ({ messagesOpen: !state.messagesOpen, hasUnreadMessages: state.messagesOpen ? state.hasUnreadMessages : false })),
     markMessagesAsRead: () => set({ hasUnreadMessages: false }),
}));

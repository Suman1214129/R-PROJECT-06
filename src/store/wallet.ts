import { create } from "zustand";

interface WalletState {
     isConnected: boolean;
     isConnecting: boolean;
     address: string | null;
     balance: number;
     walletType: string | null;
     showConnectModal: boolean;
     connect: (walletType: string) => void;
     disconnect: () => void;
     setShowConnectModal: (show: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
     isConnected: false,
     isConnecting: false,
     address: null,
     balance: 0,
     walletType: null,
     showConnectModal: false,

     connect: (walletType: string) => {
          set({ isConnecting: true, showConnectModal: false });
          // Simulate wallet connection
          setTimeout(() => {
               set({
                    isConnected: true,
                    isConnecting: false,
                    address: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
                    balance: 2847.5,
                    walletType,
               });
          }, 2000);
     },

     disconnect: () => {
          set({
               isConnected: false,
               isConnecting: false,
               address: null,
               balance: 0,
               walletType: null,
          });
     },

     setShowConnectModal: (show: boolean) => {
          set({ showConnectModal: show });
     },
}));

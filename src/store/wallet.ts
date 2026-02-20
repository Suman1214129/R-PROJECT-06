import { create } from "zustand";

interface WalletState {
     isConnected: boolean;
     isConnecting: boolean;
     address: string | null;
     balance: number;
     walletType: string | null;
     showConnectModal: boolean;
     showWalletQR: boolean;
     connectPera: () => Promise<void>;
     reconnectSession: () => Promise<void>;
     disconnectPera: () => Promise<void>;
     setShowConnectModal: (show: boolean) => void;
     setShowWalletQR: (show: boolean) => void;
}

/**
 * Fetch real ALGO balance from Algorand TestNet.
 * Returns balance in ALGO (not microALGO).
 */
async function fetchAlgoBalance(address: string): Promise<number> {
     try {
          const res = await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${address}`);
          if (!res.ok) return 0;
          const data = await res.json();
          // amount is in microALGO — convert to ALGO
          return (data.amount ?? 0) / 1_000_000;
     } catch {
          return 0;
     }
}

export const useWalletStore = create<WalletState>((set) => ({
     isConnected: false,
     isConnecting: false,
     address: null,
     balance: 0,
     walletType: null,
     showConnectModal: false,
     showWalletQR: false,

     /**
      * Open Pera Wallet QR modal and connect.
      * Fetches real ALGO balance after connecting.
      */
     connectPera: async () => {
          // Dynamically import to avoid SSR issues
          const { getPeraWallet } = await import("@/backend/pera");
          const peraWallet = getPeraWallet();

          set({ isConnecting: true, showConnectModal: false });
          try {
               const accounts = await peraWallet.connect();
               if (!accounts.length) {
                    set({ isConnecting: false });
                    return;
               }

               const address = accounts[0];

               // Listen for disconnect from wallet side
               peraWallet.connector?.on("disconnect", () => {
                    set({ isConnected: false, address: null, balance: 0, walletType: null });
               });

               const balance = await fetchAlgoBalance(address);

               set({
                    isConnected: true,
                    isConnecting: false,
                    address,
                    balance,
                    walletType: "pera",
               });
          } catch (err: unknown) {
               const error = err as { data?: { type?: string } };
               // Ignore "user closed modal" errors
               if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                    console.error("Pera Wallet connect error:", err);
               }
               set({ isConnecting: false });
          }
     },

     /**
      * Reconnect an existing Pera Wallet session (call on app mount).
      * Restores address and balance if session is still active.
      */
     reconnectSession: async () => {
          const { getPeraWallet } = await import("@/backend/pera");
          const peraWallet = getPeraWallet();

          try {
               const accounts = await peraWallet.reconnectSession();
               if (!accounts.length) return;

               const address = accounts[0];

               // Listen for disconnect from wallet side
               peraWallet.connector?.on("disconnect", () => {
                    set({ isConnected: false, address: null, balance: 0, walletType: null });
               });

               const balance = await fetchAlgoBalance(address);

               set({
                    isConnected: true,
                    address,
                    balance,
                    walletType: "pera",
               });
          } catch {
               // No active session — this is expected, not an error
          }
     },

     /**
      * Disconnect from Pera Wallet and clear state.
      */
     disconnectPera: async () => {
          const { getPeraWallet } = await import("@/backend/pera");
          const peraWallet = getPeraWallet();

          try {
               await peraWallet.disconnect();
          } catch {
               // Ignore disconnect errors
          }
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

     setShowWalletQR: (show: boolean) => {
          set({ showWalletQR: show });
     },
}));

import { PeraWalletConnect } from "@perawallet/connect";

/**
 * Singleton Pera Wallet instance shared across the app.
 * chainId 416001 = TestNet. Change to 416001 for MainNet.
 *
 * Switch your Pera Wallet app to TestNet:
 *   Settings → Node Settings → TestNet
 */
let peraWalletInstance: PeraWalletConnect | null = null;

export function getPeraWallet(): PeraWalletConnect {
     if (!peraWalletInstance) {
          peraWalletInstance = new PeraWalletConnect({
               chainId: 416001, // TestNet
               shouldShowSignTxnToast: true,
          });
     }
     return peraWalletInstance;
}

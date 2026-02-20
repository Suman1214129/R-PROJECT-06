"use client";

import { Wallet, Shield, HandCoins } from "lucide-react";
import { useWalletStore } from "@/store/wallet";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import Link from "next/link";

interface CheckoutBoxProps {
     listingId: string;
     price: number;
}

export function CheckoutBox({ listingId, price }: CheckoutBoxProps) {
     const { isConnected, setShowConnectModal } = useWalletStore();

     return (
          <div className="rounded-2xl border border-border bg-white p-5">
               <CryptoAmount amount={price} size="xl" className="mb-5" />

               {isConnected ? (
                    <div className="space-y-3">
                         <Link
                              href={`/checkout/${listingId}`}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97]"
                         >
                              <Wallet className="w-4 h-4" />
                              Buy Now with ALGO
                         </Link>
                         <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-all active:scale-[0.97]">
                              <HandCoins className="w-4 h-4" />
                              Make an Offer
                         </button>
                    </div>
               ) : (
                    <button
                         onClick={() => setShowConnectModal(true)}
                         className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97]"
                    >
                         <Wallet className="w-4 h-4" />
                         Connect Wallet to Purchase
                    </button>
               )}

               <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-700">Payment held in escrow until delivery confirmed</p>
               </div>
          </div>
     );
}

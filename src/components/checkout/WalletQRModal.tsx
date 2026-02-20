"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Share2, Copy, Check, Wallet } from "lucide-react";
import QRCodeSVG from "react-qr-code";
import { useWalletStore } from "@/store/wallet";
import { useState } from "react";

/**
 * WalletQRModal — persistent modal showing the user's Algorand wallet address as a QR code.
 * Can be opened and closed at any time via showWalletQR in the wallet store.
 */
export function WalletQRModal() {
     const { showWalletQR, setShowWalletQR, address } = useWalletStore();
     const [copied, setCopied] = useState(false);

     const copyAddress = () => {
          if (!address) return;
          navigator.clipboard.writeText(address);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     };

     if (!address) return null;

     // Encode the Algorand address as a simple ALGO URI so it's compatible with standard wallet scanners too
     const qrValue = `algorand://${address}`;

     return (
          <AnimatePresence>
               {showWalletQR && (
                    <>
                         {/* Backdrop */}
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setShowWalletQR(false)}
                              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
                         />

                         {/* Modal */}
                         <motion.div
                              initial={{ opacity: 0, scale: 0.92, y: 16 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: 16 }}
                              transition={{ type: "spring", damping: 24, stiffness: 320 }}
                              className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs mx-4"
                         >
                              <div className="bg-white rounded-3xl border border-border shadow-2xl overflow-hidden">
                                   {/* Top gradient bar */}
                                   <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-emerald-500" />

                                   {/* Header */}
                                   <div className="flex items-center justify-between px-5 pt-5 pb-0">
                                        <div className="flex items-center gap-2">
                                             <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                                  <Wallet className="w-4 h-4 text-primary" />
                                             </div>
                                             <div>
                                                  <h2 className="text-sm font-semibold text-text-primary">My Wallet QR</h2>
                                                  <p className="text-[10px] text-text-muted">Algorand · TestNet</p>
                                             </div>
                                        </div>
                                        <button
                                             onClick={() => setShowWalletQR(false)}
                                             className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted transition-colors"
                                        >
                                             <X className="w-4 h-4" />
                                        </button>
                                   </div>

                                   {/* QR Code */}
                                   <div className="flex flex-col items-center px-6 pt-5 pb-4">
                                        <div className="relative">
                                             {/* Decorative ring */}
                                             <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-emerald-500/10 blur-sm" />
                                             <div className="relative bg-white p-4 rounded-2xl border border-border shadow-sm">
                                                  <QRCodeSVG
                                                       value={qrValue}
                                                       size={180}
                                                       level="M"
                                                       fgColor="#1A1A1A"
                                                  />
                                             </div>
                                        </div>

                                        {/* Scan hint */}
                                        <div className="flex items-center gap-1.5 mt-4 mb-1">
                                             <QrCode className="w-3.5 h-3.5 text-primary" />
                                             <p className="text-xs font-medium text-text-primary">
                                                  Scan to send ALGO to this wallet
                                             </p>
                                        </div>
                                        <p className="text-[10px] text-text-muted text-center leading-relaxed mb-4">
                                             Shows your Algorand address. At delivery, the buyer scans<br />
                                             the <strong>payment release QR</strong> shown on the order page.
                                        </p>

                                        {/* Address + copy */}
                                        <button
                                             onClick={copyAddress}
                                             className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-surface-2 border border-border hover:bg-surface hover:border-primary/30 transition-all group"
                                        >
                                             <span className="font-mono text-[11px] text-text-muted truncate">
                                                  {address}
                                             </span>
                                             {copied ? (
                                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                             ) : (
                                                  <Copy className="w-3.5 h-3.5 text-text-light group-hover:text-primary shrink-0 transition-colors" />
                                             )}
                                        </button>
                                   </div>

                                   {/* Footer action */}
                                   <div className="px-5 pb-5">
                                        <button
                                             onClick={() => {
                                                  if (navigator.share) {
                                                       navigator.share({ title: "My Algorand Wallet", text: address });
                                                  } else {
                                                       copyAddress();
                                                  }
                                             }}
                                             className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-surface-2 text-sm text-text-muted hover:text-text-primary transition-all"
                                        >
                                             <Share2 className="w-3.5 h-3.5" />
                                             Share Address
                                        </button>
                                   </div>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

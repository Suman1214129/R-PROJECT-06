"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, ChevronRight, HelpCircle, ExternalLink, Loader2 } from "lucide-react";
import { useWalletStore } from "@/store/wallet";
import { useState } from "react";

export function ConnectWalletModal() {
     const { showConnectModal, setShowConnectModal, connectPera, isConnecting } = useWalletStore();
     const [showHelp, setShowHelp] = useState(false);

     const handleConnectPera = async () => {
          await connectPera();
     };

     return (
          <AnimatePresence>
               {showConnectModal && (
                    <>
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setShowConnectModal(false)}
                              className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm"
                         />
                         <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              transition={{ type: "spring", damping: 25, stiffness: 300 }}
                              className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm"
                         >
                              <div className="bg-white rounded-2xl border border-border shadow-xl mx-4">
                                   {/* Header */}
                                   <div className="flex items-center justify-between px-5 pt-5 pb-0">
                                        <h2 className="text-lg font-semibold text-text-primary">Connect Wallet</h2>
                                        <button onClick={() => setShowConnectModal(false)} className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted transition-colors">
                                             <X className="w-5 h-5" />
                                        </button>
                                   </div>
                                   <p className="text-sm text-text-muted px-5 mt-1">Connect your Algorand wallet to buy and sell</p>

                                   {/* Pera Wallet Option */}
                                   <div className="p-5">
                                        <button
                                             onClick={handleConnectPera}
                                             disabled={isConnecting}
                                             className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-accent/20 bg-accent/5 hover:border-accent/40 hover:bg-accent/10 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                             <div className="flex items-center gap-3">
                                                  {/* Pera logo SVG */}
                                                  <div className="w-10 h-10 rounded-xl bg-[#FFEE55] flex items-center justify-center shrink-0 shadow-sm">
                                                       <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                                                            <rect width="40" height="40" rx="10" fill="#FFEE55" />
                                                            <path d="M10 28L20 12L30 28" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M14 22H26" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
                                                       </svg>
                                                  </div>
                                                  <div className="text-left">
                                                       <div className="text-sm font-semibold text-text-primary">Pera Wallet</div>
                                                       <div className="text-xs text-text-muted">Mobile & Web · Most popular</div>
                                                  </div>
                                             </div>
                                             {isConnecting ? (
                                                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                                             ) : (
                                                  <ChevronRight className="w-4 h-4 text-text-light group-hover:text-accent transition-colors" />
                                             )}
                                        </button>

                                        {isConnecting && (
                                             <p className="text-center text-xs text-text-muted mt-3 animate-pulse">
                                                  Waiting for Pera Wallet confirmation...
                                             </p>
                                        )}
                                   </div>

                                   {/* Install / Help */}
                                   <div className="px-5 pb-5 space-y-3">
                                        <a
                                             href="https://perawallet.app"
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                                        >
                                             <Wallet className="w-3.5 h-3.5" />
                                             Download Pera Wallet
                                             <ExternalLink className="w-3 h-3" />
                                        </a>

                                        <button
                                             onClick={() => setShowHelp(!showHelp)}
                                             className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                                        >
                                             <HelpCircle className="w-3.5 h-3.5" />
                                             What is a crypto wallet?
                                        </button>

                                        <AnimatePresence>
                                             {showHelp && (
                                                  <motion.div
                                                       initial={{ height: 0, opacity: 0 }}
                                                       animate={{ height: "auto", opacity: 1 }}
                                                       exit={{ height: 0, opacity: 0 }}
                                                       className="overflow-hidden"
                                                  >
                                                       <div className="p-3 rounded-xl bg-surface-2 border border-border">
                                                            <p className="text-xs text-text-muted leading-relaxed">
                                                                 A crypto wallet stores your Algorand (ALGO) and lets you send and receive payments on the blockchain. Pera Wallet is the official Algorand mobile wallet.
                                                            </p>
                                                            <a href="https://perawallet.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline">
                                                                 Learn more <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                       </div>
                                                  </motion.div>
                                             )}
                                        </AnimatePresence>

                                        {/* TestNet notice */}
                                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                                             <span className="text-amber-500 text-xs mt-0.5">⚠</span>
                                             <p className="text-[11px] text-amber-700 leading-snug">
                                                  Connected to <strong>TestNet</strong>. Switch your Pera Wallet to TestNet in Settings → Node Settings.
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

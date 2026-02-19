"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, ChevronRight, HelpCircle, ExternalLink } from "lucide-react";
import { useWalletStore } from "@/store/wallet";
import { useState } from "react";

const wallets = [
     { id: "pera", name: "Pera Wallet", desc: "Most popular mobile wallet", icon: "🟢" },
     { id: "myalgo", name: "MyAlgo", desc: "Browser-based wallet", icon: "🔵" },
     { id: "defly", name: "Defly", desc: "DeFi-focused wallet", icon: "🟣" },
];

export function ConnectWalletModal() {
     const { showConnectModal, setShowConnectModal, connect, isConnecting } = useWalletStore();
     const [showHelp, setShowHelp] = useState(false);

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

                                   <p className="text-sm text-text-muted px-5 mt-1">Choose your preferred Algorand wallet</p>

                                   {/* Wallet Options */}
                                   <div className="p-5 space-y-2">
                                        {wallets.map((w) => (
                                             <button
                                                  key={w.id}
                                                  onClick={() => connect(w.id)}
                                                  disabled={isConnecting}
                                                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light/50 transition-all group disabled:opacity-50"
                                             >
                                                  <div className="flex items-center gap-3">
                                                       <span className="text-xl">{w.icon}</span>
                                                       <div className="text-left">
                                                            <div className="text-sm font-medium text-text-primary">{w.name}</div>
                                                            <div className="text-xs text-text-muted">{w.desc}</div>
                                                       </div>
                                                  </div>
                                                  <ChevronRight className="w-4 h-4 text-text-light group-hover:text-primary transition-colors" />
                                             </button>
                                        ))}
                                   </div>

                                   {/* Help */}
                                   <div className="px-5 pb-5">
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
                                                       <div className="mt-3 p-3 rounded-xl bg-surface-2 border border-border">
                                                            <p className="text-xs text-text-muted leading-relaxed">
                                                                 A crypto wallet stores your digital assets and lets you send and receive payments on the Algorand blockchain.
                                                            </p>
                                                            <a href="#" className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                                                                 Learn more <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                       </div>
                                                  </motion.div>
                                             )}
                                        </AnimatePresence>
                                   </div>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

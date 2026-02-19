"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Shield, Copy, ArrowRight, MessageCircle, Package } from "lucide-react";
import Link from "next/link";
import { getListingById, getSellerById } from "@/lib/mock-data";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { WalletAddress } from "@/components/ui/WalletAddress";
import { useWalletStore } from "@/store/wallet";
import { truncateAddress } from "@/lib/utils";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const listing = getListingById(id);
     const seller = listing ? getSellerById(listing.sellerId) : undefined;
     const { isConnected, address, balance, setShowConnectModal } = useWalletStore();

     const [step, setStep] = useState(1);
     const [showSigningModal, setShowSigningModal] = useState(false);
     const [txStatus, setTxStatus] = useState<"idle" | "signing" | "broadcasting" | "confirmed">("idle");
     const txHash = "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456";

     if (!listing || !seller) {
          return (
               <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-2xl text-text-primary italic mb-4">Listing not found</h1>
                    <Link href="/" className="text-accent hover:underline">Back to marketplace</Link>
               </div>
          );
     }

     const networkFee = 0.001;
     const total = listing.price + networkFee;

     const handleConfirmPayment = () => {
          setShowSigningModal(true);
          setTxStatus("signing");
          setTimeout(() => setTxStatus("broadcasting"), 1500);
          setTimeout(() => {
               setTxStatus("confirmed");
               setTimeout(() => { setShowSigningModal(false); setStep(3); }, 2000);
          }, 3500);
     };

     return (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
               {/* Progress */}
               <div className="flex items-center gap-3 mb-10">
                    {[{ num: 1, label: "Review" }, { num: 2, label: "Payment" }, { num: 3, label: "Confirmation" }].map((s) => (
                         <div key={s.num} className="flex items-center gap-3 flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s.num < step ? "bg-emerald-100 text-emerald-700" : s.num === step ? "bg-primary text-white" : "bg-surface-2 border border-border text-text-light"
                                   }`}>
                                   {s.num < step ? <Check className="w-4 h-4" /> : s.num}
                              </div>
                              <span className={`text-xs hidden sm:block ${s.num === step ? "text-text-primary font-medium" : "text-text-muted"}`}>{s.label}</span>
                              {s.num < 3 && <div className={`flex-1 h-px ${s.num < step ? "bg-emerald-300" : "bg-border"}`} />}
                         </div>
                    ))}
               </div>

               <AnimatePresence mode="wait">
                    {step === 1 && (
                         <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="rounded-2xl border border-border bg-white p-6">
                                   <h2 className="font-serif text-lg text-text-primary italic mb-4">Order Summary</h2>
                                   <div className="flex gap-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={listing.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover" />
                                        <div className="flex-1">
                                             <h3 className="text-sm font-medium text-text-primary">{listing.title}</h3>
                                             <p className="text-xs text-text-muted mt-1">Sold by {seller.name}</p>
                                             <CryptoAmount amount={listing.price} size="md" className="mt-2" />
                                        </div>
                                   </div>
                              </div>
                              <button onClick={() => isConnected ? setStep(2) : setShowConnectModal(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97]">
                                   Continue to Payment <ArrowRight className="w-4 h-4" />
                              </button>
                         </motion.div>
                    )}

                    {step === 2 && (
                         <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="rounded-2xl border border-border bg-white p-6">
                                   <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Connected Wallet</h3>
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                             <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                             <WalletAddress address={address || ""} />
                                        </div>
                                        <span className="text-sm font-mono text-text-muted">{balance.toLocaleString()} ALGO</span>
                                   </div>
                              </div>
                              <div className="rounded-2xl border border-border bg-white p-6">
                                   <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Transaction Details</h3>
                                   <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-text-muted">Item Price</span><span className="font-mono text-text-primary">{listing.price} ALGO</span></div>
                                        <div className="flex justify-between"><span className="text-text-muted">Network Fee</span><span className="font-mono text-text-primary">{networkFee} ALGO</span></div>
                                        <div className="flex justify-between"><span className="text-text-muted">Platform Fee</span><span className="font-mono text-emerald-600">Free</span></div>
                                        <div className="flex justify-between pt-3 border-t border-border"><span className="font-semibold text-text-primary">Total</span><span className="font-mono font-bold text-primary">{total} ALGO</span></div>
                                   </div>
                              </div>
                              <button onClick={handleConfirmPayment} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97]">
                                   <Shield className="w-4 h-4" /> Confirm & Pay
                              </button>
                         </motion.div>
                    )}

                    {step === 3 && (
                         <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 mx-auto flex items-center justify-center">
                                   <Check className="w-10 h-10 text-emerald-600" />
                              </motion.div>
                              <div>
                                   <h2 className="font-serif text-2xl text-text-primary italic mb-2">Transaction Confirmed!</h2>
                                   <p className="text-text-muted">Your payment is held in escrow</p>
                              </div>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border">
                                   <span className="text-xs text-text-muted">Tx Hash:</span>
                                   <span className="text-xs font-mono text-text-primary truncate max-w-[180px]">{txHash}</span>
                                   <button onClick={() => navigator.clipboard.writeText(txHash)} className="p-1 hover:bg-white rounded"><Copy className="w-3.5 h-3.5 text-text-light" /></button>
                              </div>
                              <div className="flex items-center justify-center gap-4 pt-4">
                                   <Link href="/orders" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-[0.97]"><Package className="w-4 h-4" /> Track Order</Link>
                                   <Link href="/" className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border text-text-muted hover:text-text-primary transition-all active:scale-[0.97]"><MessageCircle className="w-4 h-4" /> Message Seller</Link>
                              </div>
                         </motion.div>
                    )}
               </AnimatePresence>

               {/* Signing Modal */}
               <AnimatePresence>
                    {showSigningModal && (
                         <>
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" />
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
                                   <div className="bg-white border border-border rounded-2xl shadow-xl p-6 mx-4 text-center">
                                        {txStatus === "signing" && (
                                             <>
                                                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                                  <h3 className="font-serif text-lg text-text-primary italic mb-1">Confirm Transaction</h3>
                                                  <p className="text-sm text-text-muted mb-4">Check your wallet to approve</p>
                                                  <div className="space-y-2 text-xs text-left">
                                                       <div className="flex justify-between"><span className="text-text-muted">From</span><span className="font-mono text-text-primary">{truncateAddress(address || "")}</span></div>
                                                       <div className="flex justify-between"><span className="text-text-muted">Amount</span><span className="font-mono text-primary">{total} ALGO</span></div>
                                                  </div>
                                             </>
                                        )}
                                        {txStatus === "broadcasting" && (
                                             <>
                                                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                                                  <h3 className="font-serif text-lg text-text-primary italic mb-1">Broadcasting...</h3>
                                                  <p className="text-sm text-text-muted">Sending to Algorand network</p>
                                             </>
                                        )}
                                        {txStatus === "confirmed" && (
                                             <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 mx-auto flex items-center justify-center mb-4">
                                                       <Check className="w-8 h-8 text-emerald-600" />
                                                  </div>
                                                  <h3 className="font-serif text-lg text-text-primary italic">Confirmed!</h3>
                                             </motion.div>
                                        )}
                                   </div>
                              </motion.div>
                         </>
                    )}
               </AnimatePresence>
          </div>
     );
}

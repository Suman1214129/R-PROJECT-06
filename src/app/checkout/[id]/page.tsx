"use client";

import { use, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
     Check,
     Loader2,
     Shield,
     ArrowRight,
     Package,
     Lock,
     AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getListingById, getSellerById } from "@/lib/mock-data";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { WalletAddress } from "@/components/ui/WalletAddress";
import { useWalletStore } from "@/store/wallet";
import { useAuthStore } from "@/store/auth";
import { truncateAddress } from "@/lib/utils";
import { initEscrowOrder } from "@/backend/escrow";
import { updateOrderPaymentTx } from "@/backend/firestore";
import { getPeraWallet } from "@/backend/pera";
import algosdk from "algosdk";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const listing = getListingById(id);
     const seller = listing ? getSellerById(listing.sellerId) : undefined;
     const { isConnected, address, balance, setShowConnectModal } = useWalletStore();
     const { user } = useAuthStore();

     const [step, setStep] = useState(1);
     const [isProcessing, setIsProcessing] = useState(false);
     const [txStatus, setTxStatus] = useState<"idle" | "preparing" | "signing" | "broadcasting" | "confirmed">("idle");
     const [txId, setTxId] = useState("");
     const [orderId, setOrderId] = useState("");
     const [error, setError] = useState("");

     if (!listing || !seller) {
          return (
               <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-2xl text-text-primary italic mb-4">Listing not found</h1>
                    <Link href="/" className="text-accent hover:underline">Back to marketplace</Link>
               </div>
          );
     }

     const networkFee = 0.002; // 2000 microALGO for escrow release
     const total = listing.price + networkFee;

     const handleConfirmPayment = useCallback(async () => {
          if (!address || !user?.uid) return;
          setError("");
          setIsProcessing(true);
          setTxStatus("preparing");

          try {
               // 1. Build escrow — compiles TEAL, creates order in Firestore
               setTxStatus("preparing");
               const escrow = await initEscrowOrder({
                    listingId: listing.id,
                    listingTitle: listing.title,
                    listingImage: listing.images[0],
                    buyerUid: user.uid,
                    buyerAddress: address,
                    sellerAddress: seller.walletAddress,
                    amount: total,
               });

               // 2. Decode the unsigned txn and sign it with Pera Wallet
               setTxStatus("signing");
               const txnBytes = new Uint8Array(Buffer.from(escrow.unsignedTxnBase64, "base64"));
               const txn = algosdk.decodeUnsignedTransaction(txnBytes);
               const peraWallet = getPeraWallet();

               const signedTxns = await peraWallet.signTransaction([[{ txn }]]);

               // 3. Broadcast to Algorand TestNet
               setTxStatus("broadcasting");
               const { default: algosdk2 } = await import("algosdk");
               const { getAlgodClient } = await import("@/backend/algorand");
               const client = getAlgodClient();
               const { txid } = await client.sendRawTransaction(signedTxns[0]).do();
               await algosdk2.waitForConfirmation(client, txid, 6);


               // 4. Update Firestore with real tx id
               await updateOrderPaymentTx(escrow.orderId, txid);

               // --- NOTIFICATIONS ---
               const { createNotification } = await import("@/backend/notifications");

               // 1. Notify Seller
               await createNotification(
                    seller.id,
                    "order_placed",
                    "New Order Received!",
                    `You have a new order for ${listing.title}. Check your Orders page.`,
                    `/orders`
               );

               // 2. Notify Buyer
               await createNotification(
                    user.uid,
                    "payment_received",
                    "Order Confirmed!",
                    `Your payment for ${listing.title} was successful.`,
                    `/orders`
               );
               // ---------------------

               // 5. Done
               setTxId(txid);
               setOrderId(escrow.orderId);
               setTxStatus("confirmed");
               setTimeout(() => {
                    setIsProcessing(false);
                    setStep(3);
               }, 1500);

          } catch (err: unknown) {
               const msg = err instanceof Error ? err.message : "Transaction failed";
               // User rejected from Pera is not an error to show
               if (!msg.includes("cancelled") && !msg.includes("rejected")) {
                    setError(msg);
               }
               setIsProcessing(false);
               setTxStatus("idle");
          }
     }, [address, user, listing, seller, total]);

     return (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
               {/* Progress */}
               <div className="flex items-center gap-3 mb-10">
                    {[
                         { num: 1, label: "Review" },
                         { num: 2, label: "Payment" },
                         { num: 3, label: "Confirmation" },
                    ].map((s) => (
                         <div key={s.num} className="flex items-center gap-3 flex-1">
                              <div
                                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s.num < step
                                        ? "bg-emerald-100 text-emerald-700"
                                        : s.num === step
                                             ? "bg-primary text-white"
                                             : "bg-surface-2 border border-border text-text-light"
                                        }`}
                              >
                                   {s.num < step ? <Check className="w-4 h-4" /> : s.num}
                              </div>
                              <span
                                   className={`text-xs hidden sm:block ${s.num === step ? "text-text-primary font-medium" : "text-text-muted"
                                        }`}
                              >
                                   {s.label}
                              </span>
                              {s.num < 3 && (
                                   <div
                                        className={`flex-1 h-px ${s.num < step ? "bg-emerald-300" : "bg-border"}`}
                                   />
                              )}
                         </div>
                    ))}
               </div>

               <AnimatePresence mode="wait">
                    {/* Step 1: Review */}
                    {step === 1 && (
                         <motion.div
                              key="s1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6"
                         >
                              <div className="rounded-2xl border border-border bg-white p-6">
                                   <h2 className="font-serif text-lg text-text-primary italic mb-4">Order Summary</h2>
                                   <div className="flex gap-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                             src={listing.images[0]}
                                             alt=""
                                             className="w-20 h-20 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                             <h3 className="text-sm font-medium text-text-primary">{listing.title}</h3>
                                             <p className="text-xs text-text-muted mt-1">Sold by {seller.name}</p>
                                             <CryptoAmount amount={listing.price} size="md" className="mt-2" />
                                        </div>
                                   </div>
                              </div>

                              {/* Escrow explanation */}
                              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                   <Lock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                   <div>
                                        <p className="text-xs font-semibold text-blue-800 mb-1">Protected by Algorand Escrow</p>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                             Your ALGO is locked in a blockchain smart contract. It only releases to the seller
                                             when you scan the QR code at delivery — you stay protected until then.
                                        </p>
                                   </div>
                              </div>

                              <button
                                   onClick={() => (isConnected ? setStep(2) : setShowConnectModal(true))}
                                   className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97]"
                              >
                                   {isConnected ? "Continue to Payment" : "Connect Wallet First"}
                                   <ArrowRight className="w-4 h-4" />
                              </button>
                         </motion.div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                         <motion.div
                              key="s2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6"
                         >
                              <div className="rounded-2xl border border-border bg-white p-6">
                                   <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                        Connected Wallet
                                   </h3>
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                             <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                             <WalletAddress address={address || ""} />
                                        </div>
                                        <span className="text-sm font-mono text-text-muted">
                                             {balance.toFixed(4)} ALGO
                                        </span>
                                   </div>
                              </div>

                              <div className="rounded-2xl border border-border bg-white p-6">
                                   <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                                        Transaction Details
                                   </h3>
                                   <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                             <span className="text-text-muted">Item Price</span>
                                             <span className="font-mono text-text-primary">{listing.price} ALGO</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-text-muted">Network Fee</span>
                                             <span className="font-mono text-text-primary">{networkFee} ALGO</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-text-muted">Platform Fee</span>
                                             <span className="font-mono text-emerald-600">Free</span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-border">
                                             <span className="font-semibold text-text-primary">Total → Escrow</span>
                                             <span className="font-mono font-bold text-primary">{total} ALGO</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Escrow destination note */}
                              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                                   <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                   <p className="text-xs text-amber-700">
                                        ALGO goes to a smart contract escrow — <strong>not directly to the seller</strong>.
                                        It releases only when you scan the delivery QR code.
                                   </p>
                              </div>

                              {error && (
                                   <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                        <p className="text-xs text-red-700">{error}</p>
                                   </div>
                              )}

                              <button
                                   onClick={handleConfirmPayment}
                                   disabled={isProcessing}
                                   className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                   {isProcessing ? (
                                        <>
                                             <Loader2 className="w-4 h-4 animate-spin" />
                                             {txStatus === "preparing" && "Preparing escrow..."}
                                             {txStatus === "signing" && "Check Pera Wallet..."}
                                             {txStatus === "broadcasting" && "Broadcasting..."}
                                             {txStatus === "confirmed" && "Confirmed!"}
                                        </>
                                   ) : (
                                        <>
                                             <Shield className="w-4 h-4" /> Pay & Lock in Escrow
                                        </>
                                   )}
                              </button>
                         </motion.div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                         <motion.div
                              key="s3"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-12 space-y-6"
                         >
                              <motion.div
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   transition={{ type: "spring", delay: 0.2 }}
                                   className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 mx-auto flex items-center justify-center"
                              >
                                   <Check className="w-10 h-10 text-emerald-600" />
                              </motion.div>

                              <div>
                                   <h2 className="font-serif text-2xl text-text-primary italic mb-2">
                                        Payment Locked in Escrow!
                                   </h2>
                                   <p className="text-text-muted text-sm">
                                        Your ALGO is safe. Scan the seller&apos;s QR at delivery to release it.
                                   </p>
                              </div>

                              {txId && (
                                   <a
                                        href={`https://testnet.algoexplorer.io/tx/${txId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border text-xs font-mono text-text-muted hover:text-primary transition-colors"
                                   >
                                        Tx: {truncateAddress(txId)}
                                   </a>
                              )}

                              <div className="flex items-center justify-center gap-4 pt-4">
                                   <Link
                                        href={orderId ? `/orders/${orderId}` : "/orders"}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-[0.97]"
                                   >
                                        <Package className="w-4 h-4" /> View Order & QR Code
                                   </Link>
                              </div>
                         </motion.div>
                    )}
               </AnimatePresence>
          </div>
     );
}

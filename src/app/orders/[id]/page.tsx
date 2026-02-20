"use client";

import { use, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
     ChevronLeft,
     CheckCircle2,
     Clock,
     Shield,
     Loader2,
     Copy,
     Check,
     ExternalLink,
     QrCode,
     Wallet,
     XCircle,
     AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import QRCodeSVG from "react-qr-code";
import { QRScanner } from "@/components/orders/QRScanner";
import { getOrder, type EscrowOrder } from "@/backend/firestore";
import {
     parseQRPayload,
     parsePaymentQRPayload,
     confirmAndRelease,
     cancelAndRefund,
     buildQRPayload,
     buildPaymentQRPayload,
} from "@/backend/escrow";
import { useWalletStore } from "@/store/wallet";
import { useAuthStore } from "@/store/auth";
import { truncateAddress, formatDate } from "@/lib/utils";
import { CryptoAmount } from "@/components/ui/CryptoAmount";

type Role = "buyer" | "seller" | "unknown";

const STATUS_STEPS = [
     { key: "pending", label: "Order Placed" },
     { key: "paid", label: "ALGO Locked in Escrow" },
     { key: "completed", label: "Delivered & Funds Released" },
];

function StatusDot({ active, done }: { active: boolean; done: boolean }) {
     return (
          <div
               className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${done ? "bg-emerald-100 text-emerald-600" : active ? "bg-primary text-white" : "bg-surface-2 text-text-light border border-border"
                    }`}
          >
               {done ? <Check className="w-3.5 h-3.5" /> : active ? <div className="w-2 h-2 rounded-full bg-white" /> : <div className="w-2 h-2 rounded-full bg-border" />}
          </div>
     );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const { address } = useWalletStore();
     const { user } = useAuthStore();

     const [order, setOrder] = useState<EscrowOrder | null>(null);
     const [loading, setLoading] = useState(true);
     const [role, setRole] = useState<Role>("unknown");
     const [copied, setCopied] = useState(false);

     // Release (buyer scans seller QR)
     const [releasing, setReleasing] = useState(false);
     const [releaseError, setReleaseError] = useState("");
     const [releaseTxId, setReleaseTxId] = useState("");

     // Cancel/refund (buyer cancels)
     const [cancelling, setCancelling] = useState(false);
     const [cancelError, setCancelError] = useState("");
     const [showCancelConfirm, setShowCancelConfirm] = useState(false);

     // Which seller QR tab is active
     const [sellerQRTab, setSellerQRTab] = useState<"delivery" | "payment">("delivery");

     const loadOrder = useCallback(async () => {
          const o = await getOrder(id);
          setOrder(o);
          if (o) {
               if (o.buyerUid === user?.uid) setRole("buyer");
               else if (o.sellerAddress && address && o.sellerAddress === address) setRole("seller");
               else setRole("unknown");
          }
          setLoading(false);
     }, [id, user?.uid, address]);

     useEffect(() => {
          loadOrder();
     }, [loadOrder]);

     const deliveryQRPayload = order ? buildQRPayload(order.id, order.deliveryCode) : "";
     const paymentQRPayload = order ? buildPaymentQRPayload(order.id, order.sellerAddress) : "";

     const copyCode = () => {
          if (!order) return;
          navigator.clipboard.writeText(order.deliveryCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     };

     // Buyer scans either the delivery QR or the payment release QR — both trigger escrow release
     const handleQRScan = async (data: string) => {
          setReleaseError("");

          // Try payment QR first
          const paymentParsed = parsePaymentQRPayload(data);
          if (paymentParsed) {
               if (paymentParsed.orderId !== id) {
                    setReleaseError("QR code doesn't match this order.");
                    return;
               }
               setReleasing(true);
               try {
                    const txId = await confirmAndRelease(id);
                    setReleaseTxId(txId);
                    await loadOrder();
               } catch (err) {
                    setReleaseError(err instanceof Error ? err.message : "Failed to release escrow");
               } finally {
                    setReleasing(false);
               }
               return;
          }

          // Try delivery QR fallback
          const deliveryParsed = parseQRPayload(data);
          if (!deliveryParsed) {
               setReleaseError("Invalid QR code — make sure the seller shows you the correct code.");
               return;
          }
          if (deliveryParsed.orderId !== id) {
               setReleaseError("QR code doesn't match this order.");
               return;
          }
          if (deliveryParsed.deliveryCode !== order?.deliveryCode) {
               setReleaseError("QR delivery code doesn't match.");
               return;
          }

          setReleasing(true);
          try {
               const txId = await confirmAndRelease(id);
               setReleaseTxId(txId);
               await loadOrder();
          } catch (err) {
               setReleaseError(err instanceof Error ? err.message : "Failed to release escrow");
          } finally {
               setReleasing(false);
          }
     };

     const handleCancel = async () => {
          setCancelError("");
          setCancelling(true);
          try {
               await cancelAndRefund(id);
               setShowCancelConfirm(false);
               await loadOrder();
          } catch (err) {
               setCancelError(err instanceof Error ? err.message : "Failed to cancel order");
          } finally {
               setCancelling(false);
          }
     };

     const currentStepIndex = order
          ? STATUS_STEPS.findIndex((s) => s.key === order.status)
          : -1;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-text-light" />
               </div>
          );
     }

     if (!order) {
          return (
               <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-2xl text-text-primary italic mb-4">Order not found</h1>
                    <Link href="/orders" className="text-accent hover:underline">Back to orders</Link>
               </div>
          );
     }

     return (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
               <Link
                    href="/orders"
                    className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
               >
                    <ChevronLeft className="w-4 h-4" /> Back to Orders
               </Link>

               {/* Header */}
               <div className="flex items-start justify-between mb-8">
                    <div>
                         <h1 className="font-serif text-2xl text-text-primary italic">
                              Order #{order.id.slice(-6).toUpperCase()}
                         </h1>
                         <p className="text-xs text-text-muted mt-1">
                              Placed {typeof order.createdAt === "string" ? order.createdAt : formatDate(new Date().toISOString())}
                         </p>
                    </div>
                    <span
                         className={`text-xs font-semibold px-3 py-1 rounded-full ${order.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "paid"
                                   ? "bg-blue-100 text-blue-700"
                                   : order.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                              }`}
                    >
                         {order.status === "paid" ? "Escrow Locked" : order.status === "completed" ? "Completed" : order.status === "cancelled" ? "Cancelled" : "Pending"}
                    </span>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                         {/* Timeline */}
                         <div className="rounded-2xl border border-border bg-white p-6">
                              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-5">
                                   Order Progress
                              </h3>
                              {order.status === "cancelled" ? (
                                   <div className="flex items-center gap-3 py-2">
                                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                             <XCircle className="w-4 h-4 text-red-500" />
                                        </div>
                                        <div>
                                             <p className="text-sm font-medium text-text-primary">Order Cancelled</p>
                                             <p className="text-xs text-text-muted mt-0.5">ALGO refunded to your wallet</p>
                                             {order.refundTxId && (
                                                  <a
                                                       href={`https://testnet.algoexplorer.io/tx/${order.refundTxId}`}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"
                                                  >
                                                       View refund tx <ExternalLink className="w-3 h-3" />
                                                  </a>
                                             )}
                                        </div>
                                   </div>
                              ) : (
                                   <div className="relative pl-4">
                                        <div className="absolute left-[13px] top-4 bottom-4 w-px bg-border" />
                                        {STATUS_STEPS.map((step, i) => (
                                             <motion.div
                                                  key={step.key}
                                                  initial={{ opacity: 0, x: -10 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{ delay: i * 0.1 }}
                                                  className="relative flex items-start gap-4 pb-8 last:pb-0"
                                             >
                                                  <StatusDot
                                                       done={i < currentStepIndex}
                                                       active={i === currentStepIndex}
                                                  />
                                                  <div>
                                                       <p
                                                            className={`text-sm font-medium ${i <= currentStepIndex ? "text-text-primary" : "text-text-light"
                                                                 }`}
                                                       >
                                                            {step.label}
                                                       </p>
                                                       {i === 1 && order.status === "paid" && (
                                                            <p className="text-xs text-text-muted mt-1">
                                                                 ALGO held safely in Algorand escrow contract
                                                            </p>
                                                       )}
                                                       {i === 2 && order.status === "completed" && order.releaseTxId && (
                                                            <a
                                                                 href={`https://testnet.algoexplorer.io/tx/${order.releaseTxId}`}
                                                                 target="_blank"
                                                                 rel="noopener noreferrer"
                                                                 className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"
                                                            >
                                                                 View release tx <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                       )}
                                                  </div>
                                             </motion.div>
                                        ))}
                                   </div>
                              )}
                         </div>

                         {/* Blockchain Details */}
                         <div className="rounded-2xl border border-border bg-white p-6">
                              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                                   Blockchain Details
                              </h3>
                              <div className="space-y-3 text-sm">
                                   <div className="flex items-center justify-between">
                                        <span className="text-text-muted">Escrow Address</span>
                                        <div className="flex items-center gap-1.5">
                                             <span className="font-mono text-xs text-text-primary">
                                                  {truncateAddress(order.escrowAddress)}
                                             </span>
                                             <a
                                                  href={`https://testnet.algoexplorer.io/address/${order.escrowAddress}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                             >
                                                  <ExternalLink className="w-3 h-3 text-text-light hover:text-accent" />
                                             </a>
                                        </div>
                                   </div>
                                   {order.paymentTxId && (
                                        <div className="flex items-center justify-between">
                                             <span className="text-text-muted">Payment Tx</span>
                                             <a
                                                  href={`https://testnet.algoexplorer.io/tx/${order.paymentTxId}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-1 font-mono text-xs text-accent hover:underline"
                                             >
                                                  {truncateAddress(order.paymentTxId)} <ExternalLink className="w-3 h-3" />
                                             </a>
                                        </div>
                                   )}
                                   <div className="flex items-center justify-between">
                                        <span className="text-text-muted">Amount</span>
                                        <CryptoAmount amount={order.amount} size="sm" showUsd={false} />
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Right panel */}
                    <div className="lg:col-span-2 space-y-6">
                         {/* Product */}
                         <div className="rounded-2xl border border-border bg-white p-5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                   src={order.listingImage}
                                   alt={order.listingTitle}
                                   className="w-full h-32 object-cover rounded-xl mb-3"
                              />
                              <p className="text-sm font-medium text-text-primary">{order.listingTitle}</p>
                              <CryptoAmount amount={order.amount} size="sm" showUsd={false} className="mt-1" />
                         </div>

                         {/* ─── SELLER VIEW: Dual QR ─── */}
                         {role === "seller" && order.status === "paid" && (
                              <motion.div
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="rounded-2xl border-2 border-primary/20 bg-white p-5"
                              >
                                   <div className="flex items-center gap-2 mb-4">
                                        <QrCode className="w-4 h-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-text-primary">Show QR Codes to Buyer</h3>
                                   </div>

                                   {/* Tab selector */}
                                   <div className="flex rounded-xl bg-surface-2 p-1 mb-4">
                                        <button
                                             onClick={() => setSellerQRTab("delivery")}
                                             className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${sellerQRTab === "delivery" ? "bg-white shadow-sm text-text-primary" : "text-text-muted"
                                                  }`}
                                        >
                                             <QrCode className="w-3 h-3" />
                                             Delivery QR
                                        </button>
                                        <button
                                             onClick={() => setSellerQRTab("payment")}
                                             className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${sellerQRTab === "payment" ? "bg-white shadow-sm text-text-primary" : "text-text-muted"
                                                  }`}
                                        >
                                             <Wallet className="w-3 h-3" />
                                             Payment QR
                                        </button>
                                   </div>

                                   <AnimatePresence mode="wait">
                                        {/* Delivery QR */}
                                        {sellerQRTab === "delivery" && (
                                             <motion.div
                                                  key="delivery-qr"
                                                  initial={{ opacity: 0, x: -8 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  exit={{ opacity: 0, x: 8 }}
                                                  className="text-center"
                                             >
                                                  <p className="text-[11px] text-text-muted mb-3">
                                                       Buyer scans to confirm delivery receipt
                                                  </p>
                                                  <div className="bg-surface-2 p-3 rounded-xl inline-block border border-border">
                                                       <QRCodeSVG value={deliveryQRPayload} size={150} />
                                                  </div>
                                                  <p className="text-xs text-text-muted mt-3 mb-1">9-digit code:</p>
                                                  <div className="flex items-center justify-center gap-2">
                                                       <span className="font-mono text-lg font-bold tracking-[0.2em] text-text-primary">
                                                            {order.deliveryCode}
                                                       </span>
                                                       <button onClick={copyCode} className="p-1.5 rounded-lg hover:bg-surface-2">
                                                            {copied ? (
                                                                 <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                 <Copy className="w-4 h-4 text-text-light" />
                                                            )}
                                                       </button>
                                                  </div>
                                             </motion.div>
                                        )}

                                        {/* Payment release QR */}
                                        {sellerQRTab === "payment" && (
                                             <motion.div
                                                  key="payment-qr"
                                                  initial={{ opacity: 0, x: 8 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  exit={{ opacity: 0, x: -8 }}
                                                  className="text-center"
                                             >
                                                  <div className="flex items-center gap-1.5 justify-center mb-3">
                                                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                       <p className="text-[11px] text-text-muted">
                                                            Buyer scans → ALGO auto-released to your wallet
                                                       </p>
                                                  </div>
                                                  <div className="bg-primary/5 p-3 rounded-xl inline-block border-2 border-primary/20">
                                                       <QRCodeSVG value={paymentQRPayload} size={150} fgColor="#1A1A1A" />
                                                  </div>
                                                  <p className="text-[10px] text-text-light mt-2 leading-snug">
                                                       Payment release QR — tied to order #{order.id.slice(-6).toUpperCase()}<br />
                                                       and your wallet address
                                                  </p>
                                             </motion.div>
                                        )}
                                   </AnimatePresence>
                              </motion.div>
                         )}

                         {/* ─── BUYER VIEW: Scan QR + Cancel ─── */}
                         {role === "buyer" && order.status === "paid" && (
                              <motion.div
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="rounded-2xl border border-border bg-white p-5 space-y-4"
                              >
                                   <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-text-primary">Confirm Delivery</h3>
                                   </div>
                                   <p className="text-xs text-text-muted">
                                        At delivery, scan the seller&apos;s <strong>Delivery QR</strong> or <strong>Payment Release QR</strong>. Either one releases the ALGO to the seller.
                                   </p>

                                   <QRScanner onScan={handleQRScan} />

                                   {releasing && (
                                        <div className="flex items-center gap-2 text-sm text-primary">
                                             <Loader2 className="w-4 h-4 animate-spin" />
                                             Releasing escrow to seller...
                                        </div>
                                   )}

                                   {releaseError && (
                                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                                             {releaseError}
                                        </div>
                                   )}

                                   {/* Cancel & Refund */}
                                   <div className="pt-1 border-t border-border">
                                        {!showCancelConfirm ? (
                                             <button
                                                  onClick={() => setShowCancelConfirm(true)}
                                                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                                             >
                                                  <XCircle className="w-3.5 h-3.5" />
                                                  Cancel Order &amp; Get Refund
                                             </button>
                                        ) : (
                                             <motion.div
                                                  initial={{ opacity: 0, y: 4 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  className="space-y-2"
                                             >
                                                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                                                       <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                                       <p className="text-[11px] text-amber-700">
                                                            This will close the escrow and refund <strong>{order.amount} ALGO</strong> back to your wallet.
                                                       </p>
                                                  </div>
                                                  {cancelError && (
                                                       <p className="text-xs text-red-600">{cancelError}</p>
                                                  )}
                                                  <div className="flex gap-2">
                                                       <button
                                                            onClick={() => setShowCancelConfirm(false)}
                                                            className="flex-1 py-2 rounded-xl border border-border text-xs text-text-muted hover:text-text-primary transition-colors"
                                                       >
                                                            Keep Order
                                                       </button>
                                                       <button
                                                            onClick={handleCancel}
                                                            disabled={cancelling}
                                                            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all disabled:opacity-60"
                                                       >
                                                            {cancelling ? (
                                                                 <span className="flex items-center justify-center gap-1">
                                                                      <Loader2 className="w-3 h-3 animate-spin" /> Refunding...
                                                                 </span>
                                                            ) : "Confirm Cancel"}
                                                       </button>
                                                  </div>
                                             </motion.div>
                                        )}
                                   </div>
                              </motion.div>
                         )}

                         {/* ─── COMPLETED ─── */}
                         {order.status === "completed" && (
                              <motion.div
                                   initial={{ opacity: 0, scale: 0.95 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
                              >
                                   <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                   <p className="text-sm font-semibold text-emerald-800">Delivery Confirmed!</p>
                                   <p className="text-xs text-emerald-700 mt-1">ALGO released to seller on-chain</p>
                                   {(releaseTxId || order.releaseTxId) && (
                                        <a
                                             href={`https://testnet.algoexplorer.io/tx/${releaseTxId || order.releaseTxId}`}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="text-xs text-accent hover:underline flex items-center gap-1 justify-center mt-2"
                                        >
                                             View on AlgoExplorer <ExternalLink className="w-3 h-3" />
                                        </a>
                                   )}
                              </motion.div>
                         )}

                         {/* ─── CANCELLED ─── */}
                         {order.status === "cancelled" && (
                              <motion.div
                                   initial={{ opacity: 0, scale: 0.95 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center"
                              >
                                   <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                                   <p className="text-sm font-semibold text-red-800">Order Cancelled</p>
                                   <p className="text-xs text-red-700 mt-1">ALGO refunded to buyer wallet</p>
                                   {order.refundTxId && (
                                        <a
                                             href={`https://testnet.algoexplorer.io/tx/${order.refundTxId}`}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="text-xs text-accent hover:underline flex items-center gap-1 justify-center mt-2"
                                        >
                                             View refund tx <ExternalLink className="w-3 h-3" />
                                        </a>
                                   )}
                              </motion.div>
                         )}

                         {/* Waiting for buyer (seller pending) */}
                         {role === "seller" && order.status === "pending" && (
                              <div className="rounded-2xl border border-border bg-white p-5 flex items-center gap-3 text-sm text-text-muted">
                                   <Clock className="w-4 h-4 shrink-0" />
                                   Waiting for buyer to complete payment...
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}

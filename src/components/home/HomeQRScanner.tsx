"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, QrCode, CheckCircle2, AlertCircle, Loader2, Package, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { confirmAndRelease, parsePaymentQRPayload, parseListingQRPayload, parseQRPayload } from "@/backend/escrow";
import { getOrder } from "@/backend/firestore";
import { CryptoAmount } from "@/components/ui/CryptoAmount";

type ScanState = "idle" | "scanning" | "processing" | "success" | "error";
type ScanResult =
     | { type: "payment"; orderId: string; sellerAddress: string }
     | { type: "listing"; listingId: string }
     | { type: "delivery"; orderId: string; deliveryCode: string }
     | null;

/**
 * HomeQRScanner — floating QR scanner button on the home page.
 * Handles three QR payload types:
 *  1. campusswap:pay:{orderId}:{sellerAddress}   → payment release
 *  2. campusswap:listing:{listingId}             → navigate to listing
 *  3. campusswap:confirm:{orderId}:{code}        → delivery confirmation (redirect to order)
 */
export function HomeQRScanner() {
     const router = useRouter();
     const [open, setOpen] = useState(false);
     const [scanState, setScanState] = useState<ScanState>("idle");
     const [errorMsg, setErrorMsg] = useState("");
     const [scanResult, setScanResult] = useState<ScanResult>(null);
     const [orderTitle, setOrderTitle] = useState("");
     const [orderAmount, setOrderAmount] = useState(0);
     const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
     const containerId = "home-qr-scanner-container";

     const stopScanner = useCallback(async () => {
          if (scannerRef.current) {
               try {
                    await scannerRef.current.stop();
               } catch {
                    // ignore
               }
               scannerRef.current = null;
          }
     }, []);

     const handleClose = useCallback(async () => {
          await stopScanner();
          setOpen(false);
          setScanState("idle");
          setScanResult(null);
          setErrorMsg("");
          setOrderTitle("");
          setOrderAmount(0);
     }, [stopScanner]);

     const startScanner = useCallback(async () => {
          setScanState("scanning");
          setErrorMsg("");
          setScanResult(null);

          try {
               const { Html5Qrcode } = await import("html5-qrcode");
               const scanner = new Html5Qrcode(containerId);
               scannerRef.current = scanner;

               await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 220, height: 220 } },
                    async (decodedText) => {
                         await scanner.stop();
                         scannerRef.current = null;
                         setScanState("processing");

                         // Try to identify which payload type this is
                         const paymentParsed = parsePaymentQRPayload(decodedText);
                         const listingParsed = parseListingQRPayload(decodedText);
                         const deliveryParsed = parseQRPayload(decodedText);

                         if (paymentParsed) {
                              // Fetch order info to show confirmation
                              try {
                                   const order = await getOrder(paymentParsed.orderId);
                                   if (order) {
                                        setOrderTitle(order.listingTitle);
                                        setOrderAmount(order.amount);
                                   }
                                   setScanResult({ type: "payment", ...paymentParsed });
                                   setScanState("success");
                              } catch {
                                   setErrorMsg("Could not load order details.");
                                   setScanState("error");
                              }
                         } else if (listingParsed) {
                              setScanResult({ type: "listing", ...listingParsed });
                              setScanState("success");
                         } else if (deliveryParsed) {
                              setScanResult({ type: "delivery", ...deliveryParsed });
                              setScanState("success");
                         } else {
                              setErrorMsg("Unrecognised QR code. Please scan a CampusSwap QR.");
                              setScanState("error");
                         }
                    },
                    () => { /* scan attempt — not an error */ }
               );
          } catch (err) {
               const msg = err instanceof Error ? err.message : "Camera access denied";
               setErrorMsg(msg);
               setScanState("error");
          }
     }, []);

     // Auto-start scanner when modal opens
     useEffect(() => {
          if (open && scanState === "idle") {
               startScanner();
          }
     }, [open, scanState, startScanner]);

     // Cleanup on unmount
     useEffect(() => {
          return () => {
               stopScanner();
          };
     }, [stopScanner]);

     const handlePaymentConfirm = async () => {
          if (!scanResult || scanResult.type !== "payment") return;
          setScanState("processing");
          try {
               await confirmAndRelease(scanResult.orderId);
               setScanState("success");
               setTimeout(() => {
                    handleClose();
                    router.push(`/orders/${scanResult.orderId}`);
               }, 1200);
          } catch (err) {
               const msg = err instanceof Error ? err.message : "Failed to release payment";
               setErrorMsg(msg);
               setScanState("error");
          }
     };

     const handleListingNavigate = () => {
          if (!scanResult || scanResult.type !== "listing") return;
          handleClose();
          router.push(`/listing/${scanResult.listingId}`);
     };

     const handleDeliveryNavigate = () => {
          if (!scanResult || scanResult.type !== "delivery") return;
          handleClose();
          router.push(`/orders/${scanResult.orderId}`);
     };

     return (
          <>
               {/* Floating trigger button */}
               <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(true)}
                    className="fixed bottom-24 right-4 z-40 w-13 h-13 flex items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors sm:bottom-6 sm:right-6"
                    aria-label="Scan QR Code"
                    style={{ width: 52, height: 52 }}
               >
                    <QrCode className="w-5 h-5 text-white" />
               </motion.button>

               {/* Scanner overlay */}
               <AnimatePresence>
                    {open && (
                         <>
                              {/* Backdrop */}
                              <motion.div
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   exit={{ opacity: 0 }}
                                   onClick={handleClose}
                                   className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
                              />

                              {/* Scanner sheet */}
                              <motion.div
                                   initial={{ opacity: 0, y: 40 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   exit={{ opacity: 0, y: 40 }}
                                   transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                   className="fixed z-[81] inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm"
                              >
                                   <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden">
                                        {/* Top bar */}
                                        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-emerald-500" />

                                        {/* Header */}
                                        <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                             <div className="flex items-center gap-2">
                                                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                                       <QrCode className="w-3.5 h-3.5 text-primary" />
                                                  </div>
                                                  <h2 className="text-sm font-semibold text-text-primary">Scan QR Code</h2>
                                             </div>
                                             <button
                                                  onClick={handleClose}
                                                  className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted transition-colors"
                                             >
                                                  <X className="w-4 h-4" />
                                             </button>
                                        </div>

                                        <div className="px-5 pb-6">
                                             <AnimatePresence mode="wait">
                                                  {/* Scanning view */}
                                                  {scanState === "scanning" && (
                                                       <motion.div
                                                            key="scanning"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="space-y-3"
                                                       >
                                                            <p className="text-xs text-text-muted mb-2">
                                                                 Point at a CampusSwap QR code — product, order, or payment
                                                            </p>
                                                            <div className="relative rounded-2xl overflow-hidden bg-black">
                                                                 <div id={containerId} className="w-full" style={{ minHeight: 260 }} />
                                                                 {/* Corner overlay */}
                                                                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                                                      <div className="relative w-44 h-44">
                                                                           <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl" />
                                                                           <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr" />
                                                                           <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl" />
                                                                           <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br" />
                                                                           <motion.div
                                                                                className="absolute left-0 right-0 h-0.5 bg-primary/70"
                                                                                animate={{ y: [0, 160, 0] }}
                                                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                                           />
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </motion.div>
                                                  )}

                                                  {/* Processing */}
                                                  {scanState === "processing" && (
                                                       <motion.div
                                                            key="processing"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="py-10 flex flex-col items-center gap-3"
                                                       >
                                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                            <p className="text-sm text-text-muted">Processing...</p>
                                                       </motion.div>
                                                  )}

                                                  {/* Success — payment QR */}
                                                  {scanState === "success" && scanResult?.type === "payment" && (
                                                       <motion.div
                                                            key="confirm-payment"
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="space-y-4 pt-2"
                                                       >
                                                            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                                                                 <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                                                                 <div>
                                                                      <p className="text-xs font-semibold text-emerald-800">Payment Release QR Detected</p>
                                                                      <p className="text-[11px] text-emerald-700 mt-0.5">
                                                                           Confirming will release ALGO from escrow to the seller.
                                                                      </p>
                                                                 </div>
                                                            </div>
                                                            {orderTitle && (
                                                                 <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border">
                                                                      <div className="flex items-center gap-2">
                                                                           <Package className="w-4 h-4 text-text-light" />
                                                                           <span className="text-sm text-text-primary truncate max-w-[140px]">{orderTitle}</span>
                                                                      </div>
                                                                      <CryptoAmount amount={orderAmount} size="sm" showUsd={false} />
                                                                 </div>
                                                            )}
                                                            <button
                                                                 onClick={handlePaymentConfirm}
                                                                 className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all active:scale-[0.98]"
                                                            >
                                                                 Confirm & Release ALGO
                                                            </button>
                                                            <button
                                                                 onClick={() => { setScanState("idle"); setScanResult(null); }}
                                                                 className="w-full py-2.5 rounded-xl border border-border text-sm text-text-muted hover:text-text-primary transition-colors"
                                                            >
                                                                 Cancel
                                                            </button>
                                                       </motion.div>
                                                  )}

                                                  {/* Success — listing QR */}
                                                  {scanState === "success" && scanResult?.type === "listing" && (
                                                       <motion.div
                                                            key="listing"
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="space-y-4 pt-2"
                                                       >
                                                            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                                                                 <Package className="w-5 h-5 text-blue-600 shrink-0" />
                                                                 <div>
                                                                      <p className="text-xs font-semibold text-blue-800">Listing QR Detected</p>
                                                                      <p className="text-[11px] text-blue-700 mt-0.5">Open this listing in the marketplace.</p>
                                                                 </div>
                                                            </div>
                                                            <button
                                                                 onClick={handleListingNavigate}
                                                                 className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all active:scale-[0.98]"
                                                            >
                                                                 View Listing
                                                            </button>
                                                       </motion.div>
                                                  )}

                                                  {/* Success — delivery QR (redirect to order) */}
                                                  {scanState === "success" && scanResult?.type === "delivery" && (
                                                       <motion.div
                                                            key="delivery"
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="space-y-4 pt-2"
                                                       >
                                                            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                                                                 <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                                                                 <div>
                                                                      <p className="text-xs font-semibold text-amber-800">Delivery QR Detected</p>
                                                                      <p className="text-[11px] text-amber-700 mt-0.5">Go to the order page to confirm delivery.</p>
                                                                 </div>
                                                            </div>
                                                            <button
                                                                 onClick={handleDeliveryNavigate}
                                                                 className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all active:scale-[0.98]"
                                                            >
                                                                 Go to Order
                                                            </button>
                                                       </motion.div>
                                                  )}

                                                  {/* Confirmed (after payment release) */}
                                                  {scanState === "success" && scanResult === null && (
                                                       <motion.div
                                                            key="confirmed"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="py-8 flex flex-col items-center gap-3"
                                                       >
                                                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                                            <p className="text-sm font-semibold text-text-primary">ALGO Released!</p>
                                                       </motion.div>
                                                  )}

                                                  {/* Error */}
                                                  {scanState === "error" && (
                                                       <motion.div
                                                            key="error"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="space-y-3 pt-2"
                                                       >
                                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                                                                 <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                                                 <p className="text-xs text-red-700">{errorMsg || "Unknown error"}</p>
                                                            </div>
                                                            <button
                                                                 onClick={() => setScanState("idle")}
                                                                 className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
                                                            >
                                                                 Try Again
                                                            </button>
                                                       </motion.div>
                                                  )}
                                             </AnimatePresence>
                                        </div>
                                   </div>
                              </motion.div>
                         </>
                    )}
               </AnimatePresence>
          </>
     );
}

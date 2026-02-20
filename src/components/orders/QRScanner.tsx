"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRScannerProps {
     onScan: (data: string) => void;
     onError?: (err: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
     const [scanning, setScanning] = useState(false);
     const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
     const [errorMsg, setErrorMsg] = useState("");
     const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
     const containerId = "qr-scanner-container";

     const startScan = async () => {
          setStatus("scanning");
          setScanning(true);
          setErrorMsg("");

          try {
               const { Html5Qrcode } = await import("html5-qrcode");
               const scanner = new Html5Qrcode(containerId);
               scannerRef.current = scanner;

               await scanner.start(
                    { facingMode: "environment" }, // Back camera
                    { fps: 10, qrbox: { width: 240, height: 240 } },
                    (decodedText) => {
                         // Success
                         scanner.stop();
                         setStatus("success");
                         setScanning(false);
                         onScan(decodedText);
                    },
                    () => {
                         // Scan attempt failed — not an error, just trying
                    }
               );
          } catch (err) {
               const msg = err instanceof Error ? err.message : "Camera access denied";
               setStatus("error");
               setErrorMsg(msg);
               setScanning(false);
               onError?.(msg);
          }
     };

     const stopScan = async () => {
          if (scannerRef.current) {
               try {
                    await scannerRef.current.stop();
               } catch {
                    // ignore
               }
               scannerRef.current = null;
          }
          setScanning(false);
          setStatus("idle");
     };

     useEffect(() => {
          return () => {
               if (scannerRef.current) {
                    scannerRef.current.stop().catch(() => { });
               }
          };
     }, []);

     return (
          <div className="space-y-4">
               <AnimatePresence mode="wait">
                    {status === "idle" && (
                         <motion.div
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-center"
                         >
                              <button
                                   onClick={startScan}
                                   className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.98]"
                              >
                                   <Camera className="w-5 h-5" />
                                   Scan QR Code
                              </button>
                              <p className="text-xs text-text-light mt-2">
                                   Point your camera at the QR code the seller shows you
                              </p>
                         </motion.div>
                    )}

                    {status === "scanning" && (
                         <motion.div
                              key="scanning"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-3"
                         >
                              {/* Camera viewfinder */}
                              <div className="relative rounded-2xl overflow-hidden bg-black">
                                   <div id={containerId} className="w-full" style={{ minHeight: 280 }} />
                                   {/* Overlay corners */}
                                   <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className="relative w-48 h-48">
                                             <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl" />
                                             <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr" />
                                             <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl" />
                                             <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br" />
                                             {/* Scan line animation */}
                                             <motion.div
                                                  className="absolute left-0 right-0 h-0.5 bg-accent/80"
                                                  animate={{ y: [0, 176, 0] }}
                                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                             />
                                        </div>
                                   </div>
                              </div>
                              <button
                                   onClick={stopScan}
                                   className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-primary hover:bg-surface transition-colors text-sm"
                              >
                                   <X className="w-4 h-4" /> Cancel
                              </button>
                         </motion.div>
                    )}

                    {status === "success" && (
                         <motion.div
                              key="success"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center gap-2 py-6"
                         >
                              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                              <p className="text-sm font-medium text-text-primary">QR Code Scanned!</p>
                         </motion.div>
                    )}

                    {status === "error" && (
                         <motion.div
                              key="error"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3"
                         >
                              <div className="flex items-center gap-2 text-red-500 text-sm">
                                   <AlertCircle className="w-4 h-4 shrink-0" />
                                   <span>{errorMsg || "Could not access camera"}</span>
                              </div>
                              <button
                                   onClick={startScan}
                                   className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
                              >
                                   Try Again
                              </button>
                         </motion.div>
                    )}
               </AnimatePresence>
          </div>
     );
}

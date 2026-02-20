"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
     isOpen: boolean;
     onClose: () => void;
     onConfirm: () => void;
     title: string;
     message: string;
     confirmText?: string;
     cancelText?: string;
}

export function ConfirmDialog({
     isOpen,
     onClose,
     onConfirm,
     title,
     message,
     confirmText = "Delete",
     cancelText = "Cancel",
}: ConfirmDialogProps) {
     return (
          <AnimatePresence>
               {isOpen && (
                    <>
                         {/* Backdrop with blur */}
                         <motion.div
                              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                              transition={{ duration: 0.2 }}
                              className="fixed inset-0 bg-black/20 z-50"
                              onClick={onClose}
                         />

                         {/* Dialog */}
                         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                              <motion.div
                                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                   transition={{ duration: 0.2, ease: "easeOut" }}
                                   className="bg-white rounded-2xl shadow-2xl border border-border max-w-md w-full pointer-events-auto overflow-hidden"
                              >
                                   {/* Icon */}
                                   <div className="flex items-center justify-center pt-8 pb-4">
                                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                                             <AlertTriangle className="w-7 h-7 text-red-500" />
                                        </div>
                                   </div>

                                   {/* Content */}
                                   <div className="px-6 pb-6 text-center">
                                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                                             {title}
                                        </h3>
                                        <p className="text-sm text-text-muted leading-relaxed">
                                             {message}
                                        </p>
                                   </div>

                                   {/* Actions */}
                                   <div className="flex gap-3 px-6 pb-6">
                                        <button
                                             onClick={onClose}
                                             className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface transition-all"
                                        >
                                             {cancelText}
                                        </button>
                                        <button
                                             onClick={() => {
                                                  onConfirm();
                                                  onClose();
                                             }}
                                             className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition-all active:scale-[0.97]"
                                        >
                                             {confirmText}
                                        </button>
                                   </div>
                              </motion.div>
                         </div>
                    </>
               )}
          </AnimatePresence>
     );
}

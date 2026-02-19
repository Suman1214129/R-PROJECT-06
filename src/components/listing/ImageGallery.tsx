"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
     images: string[];
     title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
     const [activeIndex, setActiveIndex] = useState(0);
     const [lightboxOpen, setLightboxOpen] = useState(false);

     return (
          <>
               <div className="space-y-3">
                    {/* Main Image */}
                    <div
                         className="relative aspect-square rounded-2xl overflow-hidden bg-surface-2 cursor-pointer group"
                         onClick={() => setLightboxOpen(true)}
                    >
                         <motion.img
                              key={activeIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              src={images[activeIndex]}
                              alt={title}
                              className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                         <div className="flex gap-2 overflow-x-auto pb-1">
                              {images.map((img, i) => (
                                   <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeIndex === i ? "border-primary" : "border-transparent hover:border-border"
                                             }`}
                                   >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
                                   </button>
                              ))}
                         </div>
                    )}
               </div>

               {/* Lightbox */}
               <AnimatePresence>
                    {lightboxOpen && (
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                         >
                              <button
                                   onClick={() => setLightboxOpen(false)}
                                   className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                              >
                                   <X className="w-6 h-6 text-white" />
                              </button>

                              {images.length > 1 && (
                                   <>
                                        <button
                                             onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                                             className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                             <ChevronLeft className="w-6 h-6 text-white" />
                                        </button>
                                        <button
                                             onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                                             className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                             <ChevronRight className="w-6 h-6 text-white" />
                                        </button>
                                   </>
                              )}

                              <motion.img
                                   key={activeIndex}
                                   initial={{ opacity: 0, scale: 0.9 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   src={images[activeIndex]}
                                   alt={title}
                                   className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                              />
                         </motion.div>
                    )}
               </AnimatePresence>
          </>
     );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Image, Search, ArrowLeft } from "lucide-react";
import { conversations, sellers, getListingById } from "@/lib/mock-data";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { timeAgo } from "@/lib/utils";

interface MessagesDialogProps {
     isOpen: boolean;
     onClose: () => void;
}

export function MessagesDialog({ isOpen, onClose }: MessagesDialogProps) {
     const [activeConversation, setActiveConversation] = useState<typeof conversations[0] | null>(null);
     const [newMessage, setNewMessage] = useState("");

     const getParticipantName = (conv: typeof conversations[0]) => {
          const sellerId = conv.participantIds.find((id) => id.startsWith("seller"));
          return sellers.find((s) => s.id === sellerId)?.name || "Unknown";
     };

     const getParticipantAvatar = (conv: typeof conversations[0]) => {
          const sellerId = conv.participantIds.find((id) => id.startsWith("seller"));
          return sellers.find((s) => s.id === sellerId)?.avatar || "";
     };

     const listing = activeConversation ? getListingById(activeConversation.listingId) : null;

     return (
          <AnimatePresence>
               {isOpen && (
                    <>
                         {/* Overlay */}
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={onClose}
                              className="fixed inset-0 z-[80] bg-black/20 backdrop-blur-sm"
                         />

                         {/* Dialog */}
                         <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 20, scale: 0.97 }}
                              transition={{ type: "spring", damping: 25, stiffness: 300 }}
                              className="fixed z-[81] right-4 sm:right-6 bottom-4 sm:bottom-6 w-[calc(100%-2rem)] sm:w-[420px] h-[70vh] max-h-[600px] bg-white rounded-2xl border border-border shadow-2xl shadow-black/10 flex flex-col overflow-hidden"
                         >
                              {activeConversation ? (
                                   /* Chat View */
                                   <>
                                        {/* Chat Header */}
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                                             <button
                                                  onClick={() => setActiveConversation(null)}
                                                  className="p-1 rounded-lg hover:bg-surface-2 text-text-muted transition-colors"
                                             >
                                                  <ArrowLeft className="w-4 h-4" />
                                             </button>
                                             {/* eslint-disable-next-line @next/next/no-img-element */}
                                             <img src={getParticipantAvatar(activeConversation)} alt="" className="w-8 h-8 rounded-full" />
                                             <div className="flex-1 min-w-0">
                                                  <h3 className="text-sm font-medium text-text-primary">{getParticipantName(activeConversation)}</h3>
                                                  <span className="text-[10px] text-success">Active now</span>
                                             </div>
                                             <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-2 text-text-muted transition-colors">
                                                  <X className="w-4 h-4" />
                                             </button>
                                        </div>

                                        {/* Item Context */}
                                        {listing && (
                                             <div className="px-4 py-2 border-b border-border bg-surface">
                                                  <div className="flex items-center gap-2">
                                                       {/* eslint-disable-next-line @next/next/no-img-element */}
                                                       <img src={listing.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                                       <div className="flex-1 min-w-0">
                                                            <h4 className="text-[11px] font-medium text-text-primary truncate">{listing.title}</h4>
                                                            <CryptoAmount amount={listing.price} size="sm" showUsd={false} />
                                                       </div>
                                                  </div>
                                             </div>
                                        )}

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                             {activeConversation.messages.map((msg, i) => {
                                                  const isSender = msg.senderId.startsWith("buyer");
                                                  if (msg.type === "system") {
                                                       return (
                                                            <div key={msg.id} className="flex justify-center">
                                                                 <span className="px-3 py-1 rounded-full bg-surface-2 text-[10px] text-text-muted">{msg.text}</span>
                                                            </div>
                                                       );
                                                  }
                                                  return (
                                                       <motion.div
                                                            key={msg.id}
                                                            initial={{ opacity: 0, y: 4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                                                       >
                                                            <div className={`max-w-[80%] px-3.5 py-2 text-[13px] ${isSender
                                                                      ? "bg-primary text-white rounded-2xl rounded-br-md"
                                                                      : "bg-surface-2 text-text-primary rounded-2xl rounded-bl-md"
                                                                 }`}>
                                                                 <p>{msg.text}</p>
                                                                 <p className={`text-[9px] mt-1 ${isSender ? "text-white/50" : "text-text-light"}`}>{timeAgo(msg.timestamp)}</p>
                                                            </div>
                                                       </motion.div>
                                                  );
                                             })}
                                        </div>

                                        {/* Input */}
                                        <div className="border-t border-border p-3">
                                             <div className="flex items-center gap-2">
                                                  <button className="p-2 rounded-lg hover:bg-surface-2 text-text-light transition-colors">
                                                       <Image className="w-4 h-4" />
                                                  </button>
                                                  <input
                                                       type="text"
                                                       value={newMessage}
                                                       onChange={(e) => setNewMessage(e.target.value)}
                                                       placeholder="Type a message..."
                                                       className="flex-1 px-3 py-2 rounded-xl bg-surface-2 border border-border text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-border-hover transition-all"
                                                       onKeyDown={(e) => { if (e.key === "Enter" && newMessage.trim()) setNewMessage(""); }}
                                                  />
                                                  <button
                                                       className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all active:scale-95"
                                                       onClick={() => { if (newMessage.trim()) setNewMessage(""); }}
                                                  >
                                                       <Send className="w-4 h-4" />
                                                  </button>
                                             </div>
                                        </div>
                                   </>
                              ) : (
                                   /* Conversations List */
                                   <>
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                             <h2 className="font-serif text-lg text-text-primary italic">Messages</h2>
                                             <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-2 text-text-muted transition-colors">
                                                  <X className="w-4 h-4" />
                                             </button>
                                        </div>

                                        {/* Search */}
                                        <div className="px-4 py-2 border-b border-border">
                                             <div className="relative">
                                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light" />
                                                  <input
                                                       type="text"
                                                       placeholder="Search conversations..."
                                                       className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-2 border border-border text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-border-hover transition-all"
                                                  />
                                             </div>
                                        </div>

                                        {/* List */}
                                        <div className="flex-1 overflow-y-auto divide-y divide-border">
                                             {conversations.map((conv) => (
                                                  <button
                                                       key={conv.id}
                                                       onClick={() => setActiveConversation(conv)}
                                                       className="w-full flex items-start gap-3 p-4 text-left hover:bg-surface transition-colors"
                                                  >
                                                       <div className="relative shrink-0">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={getParticipantAvatar(conv)} alt="" className="w-10 h-10 rounded-full" />
                                                            {conv.unreadCount > 0 && (
                                                                 <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                                                                      {conv.unreadCount}
                                                                 </span>
                                                            )}
                                                       </div>
                                                       <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                 <h4 className="text-sm font-medium text-text-primary truncate">{getParticipantName(conv)}</h4>
                                                                 <span className="text-[10px] text-text-light shrink-0 ml-2">{timeAgo(conv.lastMessageTime)}</span>
                                                            </div>
                                                            <p className="text-xs text-text-muted truncate mt-0.5">{conv.lastMessage}</p>
                                                       </div>
                                                  </button>
                                             ))}
                                        </div>
                                   </>
                              )}
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

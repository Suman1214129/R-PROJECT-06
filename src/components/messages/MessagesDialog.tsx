"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Image, Search, ArrowLeft, Loader2 } from "lucide-react";
import { getListingById, sellers } from "@/lib/mock-data";
import { CryptoAmount } from "@/components/ui/CryptoAmount";
import { timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useSocket } from "@/components/providers/SocketProvider";
import {
     subscribeToConversations,
     subscribeToMessages,
     sendMessage,
     type Conversation,
     type Message
} from "@/backend/chat";

interface MessagesDialogProps {
     isOpen: boolean;
     onClose: () => void;
}

export function MessagesDialog({ isOpen, onClose }: MessagesDialogProps) {
     const { user } = useAuthStore();
     const { socket } = useSocket();

     const [conversations, setConversations] = useState<Conversation[]>([]);
     const [activeId, setActiveId] = useState<string | null>(null);
     const [messages, setMessages] = useState<Message[]>([]);
     const [newMessage, setNewMessage] = useState("");
     const [loading, setLoading] = useState(true);

     const scrollRef = useRef<HTMLDivElement>(null);

     // Subscribe to conversations list
     useEffect(() => {
          if (!user?.uid || !isOpen) return;

          const unsubscribe = subscribeToConversations(user.uid, (data) => {
               setConversations(data);
               setLoading(false);
          });

          return () => unsubscribe();
     }, [user, isOpen]);

     // Subscribe to messages when active conversation changes
     useEffect(() => {
          if (!activeId) return;

          // Join socket room
          if (socket) {
               socket.emit("join-room", activeId);
          }

          const unsubscribe = subscribeToMessages(activeId, (data) => {
               setMessages(data);
               // Scroll to bottom
               setTimeout(() => {
                    if (scrollRef.current) {
                         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
               }, 100);
          });

          return () => unsubscribe();
     }, [activeId, socket]);

     // Listen for socket messages (real-time appendage if not using firestore subscription? 
     // Actually Firestore subscription handles it, but socket can be faster/optimistic.
     // For simplicity and robustness, we rely on the Firestore snapshot listener which is inherently real-time.)

     const handleSendMessage = async () => {
          if (!newMessage.trim() || !activeId || !user) return;

          const text = newMessage;
          setNewMessage(""); // Optimistic clear

          try {
               await sendMessage(activeId, user.uid, text);

               // Emit socket event for other user notification (optional since Firestore listener handles UI)
               if (socket) {
                    socket.emit("send-message", {
                         conversationId: activeId,
                         text,
                         senderId: user.uid
                    });
               }
          } catch (error) {
               console.error("Failed to send", error);
          }
     };

     const activeConversation = conversations.find(c => c.id === activeId);

     // Helper to get other participant details (mock based since we don't have real user profiles for everyone yet)
     const getOtherParticipant = (conv: Conversation) => {
          if (!user) return { name: "Unknown", avatar: "" };
          const otherId = conv.participantIds.find(id => id !== user.uid);
          // Try to find in mock sellers (for demo) or return generic
          const mockSeller = sellers.find(s => s.id === otherId);
          return {
               name: mockSeller ? mockSeller.name : "User",
               avatar: mockSeller?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherId}`
          };
     };

     const listing = activeConversation?.listingId ? getListingById(activeConversation.listingId) : null;

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
                              initial={{ x: "100%" }}
                              animate={{ x: 0 }}
                              exit={{ x: "100%" }}
                              transition={{ type: "spring", damping: 30, stiffness: 300 }}
                              className="fixed z-[81] right-0 top-0 bottom-0 w-[calc(100%-2rem)] sm:w-[420px] my-4 mr-4 bg-white rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
                         >
                              {activeConversation ? (
                                   /* Chat View */
                                   <>
                                        {/* Chat Header */}
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                                             <button
                                                  onClick={() => setActiveId(null)}
                                                  className="p-1 rounded-lg hover:bg-surface-2 text-text-muted transition-colors"
                                             >
                                                  <ArrowLeft className="w-4 h-4" />
                                             </button>
                                             {/* eslint-disable-next-line @next/next/no-img-element */}
                                             <img src={getOtherParticipant(activeConversation).avatar} alt="" className="w-8 h-8 rounded-full" />
                                             <div className="flex-1 min-w-0">
                                                  <h3 className="text-sm font-medium text-text-primary">{getOtherParticipant(activeConversation).name}</h3>
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
                                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                                             {messages.length === 0 && (
                                                  <div className="text-center py-10 text-xs text-text-muted">
                                                       No messages yet. Say hi!
                                                  </div>
                                             )}
                                             {messages.map((msg, i) => {
                                                  const isSender = msg.senderId === user?.uid;
                                                  return (
                                                       <motion.div
                                                            key={msg.id}
                                                            initial={{ opacity: 0, y: 4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                                                       >
                                                            <div className={`max-w-[80%] px-3.5 py-2 text-[13px] ${isSender
                                                                 ? "bg-accent text-white rounded-2xl rounded-br-md"
                                                                 : "bg-surface-2 text-text-primary rounded-2xl rounded-bl-md"
                                                                 }`}>
                                                                 <p>{msg.text}</p>
                                                                 <p className={`text-[9px] mt-1 ${isSender ? "text-white/50" : "text-text-light"}`}>
                                                                      {msg.createdAt ? timeAgo(msg.createdAt.seconds ? new Date(msg.createdAt.seconds * 1000).toISOString() : new Date().toISOString()) : "Just now"}
                                                                 </p>
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
                                                       className="flex-1 px-3 py-2 rounded-xl bg-surface-2 border border-border text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-accent transition-all"
                                                       onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                                                  />
                                                  <button
                                                       className="p-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50"
                                                       onClick={handleSendMessage}
                                                       disabled={!newMessage.trim()}
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
                                             <div className="flex items-center gap-2">
                                                  <h2 className="font-serif text-lg text-text-primary">Messages</h2>
                                                  {loading && <Loader2 className="w-3 h-3 animate-spin text-text-muted" />}
                                             </div>
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
                                                       className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-2 border border-border text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-accent transition-all"
                                                  />
                                             </div>
                                        </div>

                                        {/* List */}
                                        <div className="flex-1 overflow-y-auto divide-y divide-border">
                                             {conversations.length === 0 && !loading && (
                                                  <div className="p-8 text-center text-sm text-text-muted">
                                                       No conversations yet.
                                                  </div>
                                             )}
                                             {conversations.map((conv) => {
                                                  const otherParams = getOtherParticipant(conv);
                                                  return (
                                                       <button
                                                            key={conv.id}
                                                            onClick={() => setActiveId(conv.id)}
                                                            className="w-full flex items-start gap-3 p-4 text-left hover:bg-surface transition-colors"
                                                       >
                                                            <div className="relative shrink-0">
                                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                 <img src={otherParams.avatar} alt="" className="w-10 h-10 rounded-full" />
                                                                 {conv.unreadCount && conv.unreadCount > 0 ? (
                                                                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                                                                           {conv.unreadCount}
                                                                      </span>
                                                                 ) : null}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                 <div className="flex items-center justify-between">
                                                                      <h4 className="text-sm font-medium text-text-primary truncate">{otherParams.name}</h4>
                                                                      <span className="text-[10px] text-text-light shrink-0 ml-2">
                                                                           {conv.lastMessageAt?.seconds ? timeAgo(new Date(conv.lastMessageAt.seconds * 1000).toISOString()) : "Just now"}
                                                                      </span>
                                                                 </div>
                                                                 <p className="text-xs text-text-muted truncate mt-0.5">{conv.lastMessage || "Started a conversation"}</p>
                                                            </div>
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </>
                              )}
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}

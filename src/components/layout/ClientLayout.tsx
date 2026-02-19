"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./Navbar";
import { ConnectWalletModal } from "@/components/checkout/WalletModal";
import { MessagesDialog } from "@/components/messages/MessagesDialog";
import { useUIStore } from "@/store/ui";

export function ClientLayout({ children }: { children: React.ReactNode }) {
     const pathname = usePathname();
     const { messagesOpen, setMessagesOpen } = useUIStore();

     return (
          <>
               <Navbar />
               <AnimatePresence mode="wait">
                    <motion.main
                         key={pathname}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ duration: 0.2 }}
                         className="min-h-screen"
                    >
                         {children}
                    </motion.main>
               </AnimatePresence>
               <ConnectWalletModal />
               <MessagesDialog isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} />
          </>
     );
}

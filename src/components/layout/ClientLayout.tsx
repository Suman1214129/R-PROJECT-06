"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./Navbar";
import { ConnectWalletModal } from "@/components/checkout/WalletModal";
import { MessagesDialog } from "@/components/messages/MessagesDialog";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { onAuthChange, mapFirebaseUser, signOutUser } from "@/backend/auth";
import { isEmailSignupAccount } from "@/backend/firestore";

const authPages = ["/login", "/signup"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
     const pathname = usePathname();
     const router = useRouter();
     const { messagesOpen, setMessagesOpen } = useUIStore();
     const { isAuthenticated, setUser, loading } = useAuthStore();
     const { reconnectSession } = useWalletStore();
     const [hydrated, setHydrated] = useState(false);

     // Restore Pera Wallet session on mount (survives page refresh)
     useEffect(() => {
          reconnectSession();
     }, [reconnectSession]);

     // Listen for Firebase auth state changes
     useEffect(() => {
          const unsubscribe = onAuthChange(async (firebaseUser) => {
               if (firebaseUser) {
                    const email = firebaseUser.email || "";
                    const isGoogleOnly = firebaseUser.providerData.every(
                         (p) => p.providerId === "google.com"
                    );

                    // Block Google sign-in if account was created with email/password
                    if (isGoogleOnly) {
                         const isEmailAccount = await isEmailSignupAccount(email);
                         if (isEmailAccount) {
                              await signOutUser();
                              setUser(null);
                              setHydrated(true);
                              return;
                         }
                    }

                    setUser(mapFirebaseUser(firebaseUser));
               } else {
                    setUser(null);
               }
               setHydrated(true);
          });

          return () => unsubscribe();
     }, [setUser]);

     const isAuthPage = authPages.includes(pathname);

     useEffect(() => {
          if (!hydrated) return;

          if (!isAuthenticated && !isAuthPage) {
               router.replace("/login");
          } else if (isAuthenticated && isAuthPage) {
               router.replace("/");
          }
     }, [hydrated, isAuthenticated, isAuthPage, router]);

     // Show loading while Firebase checks auth
     if (!hydrated) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="animate-pulse text-text-light text-sm">Loading...</div>
               </div>
          );
     }

     // Auth pages — no navbar, no modals
     if (isAuthPage) {
          return <>{children}</>;
     }

     // Redirect to login if not authenticated
     if (!isAuthenticated) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="animate-pulse text-text-light text-sm">Redirecting...</div>
               </div>
          );
     }

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

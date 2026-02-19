"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, isValidEmail } from "@/store/auth";
import { signUpWithEmail, signInWithGoogleAndCreateProfile, signOutUser, mapFirebaseUser } from "@/backend/auth";
import { isEmailSignupAccount } from "@/backend/firestore";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
     useEffect(() => {
          const timer = setTimeout(onClose, 5000);
          return () => clearTimeout(timer);
     }, [onClose]);

     return (
          <motion.div
               initial={{ opacity: 0, y: 20, x: 0 }}
               animate={{ opacity: 1, y: 0, x: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30 max-w-[360px]"
          >
               <AlertCircle className="w-4 h-4 shrink-0" />
               <p className="text-[13px] font-medium leading-snug">{message}</p>
               <button onClick={onClose} className="shrink-0 hover:bg-red-500 rounded p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
               </button>
          </motion.div>
     );
}

export default function SignupPage() {
     const router = useRouter();
     const { signup } = useAuthStore();
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [showPassword, setShowPassword] = useState(false);
     const [error, setError] = useState("");
     const [loading, setLoading] = useState(false);
     const [toast, setToast] = useState("");

     const handleSignup = async (e: React.FormEvent) => {
          e.preventDefault();
          setError("");

          if (!name.trim()) {
               setError("Please enter your name.");
               return;
          }

          if (!email.trim()) {
               setError("Please enter your email address.");
               return;
          }

          if (!isValidEmail(email)) {
               setError("Please enter a valid email address.");
               return;
          }

          if (!password.trim() || password.length < 6) {
               setError("Password must be at least 6 characters.");
               return;
          }

          setLoading(true);
          try {
               const firebaseUser = await signUpWithEmail(email, password, name.trim());
               signup(mapFirebaseUser(firebaseUser));
               router.replace("/");
          } catch (err: unknown) {
               const errorCode = (err as { code?: string }).code;
               switch (errorCode) {
                    case "auth/email-already-in-use":
                         setError("An account with this email already exists. Please sign in with your password instead.");
                         break;
                    case "auth/weak-password":
                         setError("Password is too weak. Use at least 6 characters.");
                         break;
                    case "auth/invalid-email":
                         setError("Invalid email address.");
                         break;
                    default:
                         setError("Something went wrong. Please try again.");
               }
          } finally {
               setLoading(false);
          }
     };

     const handleGoogleSignUp = async () => {
          setError("");
          setLoading(true);
          try {
               const firebaseUser = await signInWithGoogleAndCreateProfile();

               // Check if this email was already registered with email/password
               const userEmail = firebaseUser.email || "";
               const emailExists = await isEmailSignupAccount(userEmail);
               if (emailExists) {
                    await signOutUser();
                    setToast("Account already exists");
                    setLoading(false);
                    return;
               }

               signup(mapFirebaseUser(firebaseUser));
               router.replace("/");
          } catch (err: unknown) {
               const errorCode = (err as { code?: string }).code;
               if (errorCode === "auth/account-exists-with-different-credential") {
                    setToast("Account already exists");
               } else if (errorCode !== "auth/popup-closed-by-user") {
                    setError("Google sign-up failed. Please try again.");
               }
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
               {/* Logo */}
               <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
               >
                    <Link href="/" className="block text-center">
                         <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">CampusSwap</h1>
                    </Link>
               </motion.div>

               {/* Card */}
               <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-[380px]"
               >
                    <div className="text-center mb-8">
                         <h2 className="text-[22px] font-medium text-text-primary">Create your account</h2>
                         <p className="text-sm text-text-muted mt-2">
                              Start buying and selling on your campus
                         </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                         {/* Name */}
                         <div>
                              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Full name</label>
                              <input
                                   type="text"
                                   value={name}
                                   onChange={(e) => { setName(e.target.value); setError(""); }}
                                   placeholder="John Doe"
                                   className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-text-secondary focus:ring-1 focus:ring-text-secondary/10 transition-all"
                                   autoComplete="name"
                              />
                         </div>

                         {/* Email */}
                         <div>
                              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Email</label>
                              <input
                                   type="email"
                                   value={email}
                                   onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                   placeholder="name@example.com"
                                   className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-text-secondary focus:ring-1 focus:ring-text-secondary/10 transition-all"
                                   autoComplete="email"
                              />
                         </div>

                         {/* Password */}
                         <div>
                              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Password</label>
                              <div className="relative">
                                   <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                        placeholder="At least 6 characters"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-text-secondary focus:ring-1 focus:ring-text-secondary/10 transition-all pr-10"
                                        autoComplete="new-password"
                                   />
                                   <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition-colors"
                                   >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                   </button>
                              </div>
                         </div>

                         {/* Error */}
                         {error && (
                              <motion.div
                                   initial={{ opacity: 0, height: 0 }}
                                   animate={{ opacity: 1, height: "auto" }}
                                   className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100"
                              >
                                   <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                   <p className="text-[12px] text-red-600">{error}</p>
                              </motion.div>
                         )}

                         {/* Terms */}
                         <p className="text-[11px] text-text-light leading-relaxed">
                              By creating an account, you agree to our{" "}
                              <span className="text-text-muted hover:underline cursor-pointer">Terms of Service</span> and{" "}
                              <span className="text-text-muted hover:underline cursor-pointer">Privacy Policy</span>.
                         </p>

                         {/* Submit */}
                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full py-2.5 rounded-lg bg-text-primary hover:bg-text-secondary text-white text-sm font-medium transition-all active:scale-[0.99] disabled:opacity-50"
                         >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create account"}
                         </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                         <div className="flex-1 h-px bg-border" />
                         <span className="text-[11px] text-text-light uppercase tracking-wider">or</span>
                         <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Google sign up */}
                    <button
                         onClick={handleGoogleSignUp}
                         disabled={loading}
                         className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-border bg-white hover:bg-surface text-sm font-medium text-text-primary transition-all disabled:opacity-50"
                    >
                         <svg viewBox="0 0 24 24" className="w-4 h-4">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                         </svg>
                         Continue with Google
                    </button>

                    {/* Footer */}
                    <p className="text-center text-[13px] text-text-muted mt-8">
                         Already have an account?{" "}
                         <Link href="/login" className="text-text-primary font-medium hover:underline underline-offset-2">
                              Sign in
                         </Link>
                    </p>
               </motion.div>

               {/* Toast notification */}
               <AnimatePresence>
                    {toast && <Toast message={toast} onClose={() => setToast("")} />}
               </AnimatePresence>
          </div>
     );
}

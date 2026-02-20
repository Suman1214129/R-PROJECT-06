"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
     const router = useRouter();
     const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
     const [showPassword, setShowPassword] = useState(false);
     const [formData, setFormData] = useState({
          name: "",
          email: "",
          password: "",
     });

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          console.log(activeTab === "login" ? "Logging in..." : "Signing up...", formData);
          router.push("/");
     };

     return (
          <div className="min-h-screen bg-surface-warm flex items-center justify-center px-4 py-8">
               <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
               >
                    {/* Logo */}
                    <div className="text-center mb-8">
                         <Link href="/" className="inline-block">
                              <h1 className="font-serif text-3xl italic text-text-primary">CampusSwap</h1>
                         </Link>
                         <p className="text-sm text-text-muted mt-2">Buy and sell on campus</p>
                    </div>

                    {/* Auth Card */}
                    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                         {/* Tabs */}
                         <div className="flex border-b border-border">
                              <button
                                   onClick={() => setActiveTab("login")}
                                   className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                                        activeTab === "login" ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                                   }`}
                              >
                                   Login
                                   {activeTab === "login" && (
                                        <motion.div
                                             layoutId="authTab"
                                             className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                   )}
                              </button>
                              <button
                                   onClick={() => setActiveTab("signup")}
                                   className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                                        activeTab === "signup" ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                                   }`}
                              >
                                   Sign Up
                                   {activeTab === "signup" && (
                                        <motion.div
                                             layoutId="authTab"
                                             className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                   )}
                              </button>
                         </div>

                         {/* Form */}
                         <form onSubmit={handleSubmit} className="p-6 space-y-4">
                              {activeTab === "signup" && (
                                   <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                   >
                                        <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                                        <div className="relative">
                                             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                             <input
                                                  type="text"
                                                  value={formData.name}
                                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                  placeholder="Enter your name"
                                                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                  required
                                             />
                                        </div>
                                   </motion.div>
                              )}

                              <div>
                                   <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                                   <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                             type="email"
                                             value={formData.email}
                                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                             placeholder="Enter your email"
                                             className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                             required
                                        />
                                   </div>
                              </div>

                              <div>
                                   <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                             type={showPassword ? "text" : "password"}
                                             value={formData.password}
                                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                             placeholder="Enter your password"
                                             className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                             required
                                        />
                                        <button
                                             type="button"
                                             onClick={() => setShowPassword(!showPassword)}
                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                             {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                   </div>
                              </div>

                              {activeTab === "login" && (
                                   <div className="flex items-center justify-between text-xs">
                                        <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                                             <input type="checkbox" className="rounded border-border" />
                                             Remember me
                                        </label>
                                        <Link href="#" className="text-primary hover:underline">
                                             Forgot password?
                                        </Link>
                                   </div>
                              )}

                              <button
                                   type="submit"
                                   className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97] mt-6"
                              >
                                   {activeTab === "login" ? "Login" : "Create Account"}
                                   <ArrowRight className="w-4 h-4" />
                              </button>
                         </form>

                         {/* Footer */}
                         <div className="px-6 pb-6 text-center">
                              <p className="text-xs text-text-muted">
                                   {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                                   <button
                                        onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                                        className="text-primary hover:underline font-medium"
                                   >
                                        {activeTab === "login" ? "Sign up" : "Login"}
                                   </button>
                              </p>
                         </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                         <Link href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                              ← Back to marketplace
                         </Link>
                    </div>
               </motion.div>
          </div>
     );
}

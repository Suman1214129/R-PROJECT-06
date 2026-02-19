"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, LogOut, Package, Heart, Edit2, Camera, Wallet, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/wallet";
import { useAuthStore } from "@/store/auth";
import { signOutUser } from "@/backend/auth";
import { getUserProfile, getSavedListingIds, type UserProfile } from "@/backend/firestore";
import { truncateAddress, formatDate } from "@/lib/utils";

export default function PersonalProfilePage() {
     const router = useRouter();
     const { isConnected, address, balance } = useWalletStore();
     const { user, logout } = useAuthStore();
     const [activeTab, setActiveTab] = useState("overview");
     const [profile, setProfile] = useState<UserProfile | null>(null);
     const [savedCount, setSavedCount] = useState(0);
     const [loading, setLoading] = useState(true);

     // Fetch profile from Firestore
     useEffect(() => {
          async function fetchProfile() {
               if (!user?.uid) return;
               try {
                    const data = await getUserProfile(user.uid);
                    setProfile(data);
                    const savedIds = await getSavedListingIds(user.uid);
                    setSavedCount(savedIds.length);
               } catch (err) {
                    console.error("Failed to fetch profile:", err);
               } finally {
                    setLoading(false);
               }
          }
          fetchProfile();
     }, [user?.uid]);

     const handleLogout = async () => {
          await signOutUser();
          logout();
          router.push("/login");
     };

     const tabs = [
          { id: "overview", label: "Overview" },
          { id: "purchases", label: "Purchases" },
          { id: "settings", label: "Settings" },
     ];

     // Use Firestore data, fallback to auth store data
     const displayName = profile?.name || user?.name || "User";
     const displayEmail = profile?.email || user?.email || "";
     const displayUniversity = profile?.university || user?.university || "";
     const displayAvatar = profile?.avatar || user?.avatar || "";
     const displayBio = profile?.bio || "";
     const displayMemberSince = profile?.memberSince
          ? typeof profile.memberSince === "string"
               ? profile.memberSince
               : profile.memberSince.toDate?.()?.toISOString?.() || ""
          : "";

     if (loading) {
          return (
               <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    <div className="animate-pulse space-y-4">
                         <div className="h-36 bg-surface-2 rounded-2xl" />
                         <div className="grid grid-cols-3 gap-3">
                              <div className="h-20 bg-surface-2 rounded-xl" />
                              <div className="h-20 bg-surface-2 rounded-xl" />
                              <div className="h-20 bg-surface-2 rounded-xl" />
                         </div>
                    </div>
               </div>
          );
     }

     return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
               {/* Profile Header */}
               <div className="relative rounded-2xl overflow-hidden mb-8">
                    <div className="h-28 sm:h-36 bg-gradient-to-r from-accent/10 via-accent/5 to-surface-2 relative">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.06)_0%,transparent_50%)]" />
                    </div>
                    <div className="bg-white border border-border border-t-0 rounded-b-2xl px-6 pb-6">
                         <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                              <div className="relative group">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src={displayAvatar} alt={displayName} className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm bg-surface-2" />
                                   <button className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                                        <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </button>
                              </div>
                              <div className="flex-1">
                                   <div className="flex items-center gap-2">
                                        <h1 className="font-serif text-xl font-semibold text-text-primary">{displayName}</h1>
                                   </div>
                                   <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{displayUniversity}</span>
                                        {displayMemberSince && (
                                             <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Since {formatDate(displayMemberSince)}</span>
                                        )}
                                   </div>
                              </div>
                              <div className="flex items-center gap-2">
                                   <Link href="/profile/edit" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-[13px] font-medium transition-all active:scale-[0.97] hover:bg-primary-hover">
                                        <Edit2 className="w-3.5 h-3.5" />Edit Profile
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="rounded-xl border border-border bg-white p-4 text-center">
                         <Package className="w-5 h-5 text-accent mx-auto mb-2" />
                         <p className="text-lg font-bold text-text-primary">0</p>
                         <p className="text-[11px] text-text-muted">Purchases</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-4 text-center">
                         <Heart className="w-5 h-5 text-rose-500 mx-auto mb-2" />
                         <p className="text-lg font-bold text-text-primary">{savedCount}</p>
                         <p className="text-[11px] text-text-muted">Wishlist</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-4 text-center">
                         <Wallet className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                         <p className="text-lg font-bold text-text-primary">0 ALGO</p>
                         <p className="text-[11px] text-text-muted">Total Spent</p>
                    </div>
               </div>

               {/* Wallet Card */}
               {isConnected && address && (
                    <div className="rounded-xl border border-border bg-white p-5 mb-8">
                         <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-accent" />
                                   </div>
                                   <div>
                                        <p className="text-[11px] text-text-light uppercase tracking-wider font-medium">Algorand Wallet</p>
                                        <p className="text-sm font-mono text-text-primary mt-0.5">{truncateAddress(address)}</p>
                                   </div>
                              </div>
                              <div className="text-right">
                                   <p className="text-lg font-bold text-text-primary">{balance.toLocaleString()} ALGO</p>
                                   <div className="flex items-center gap-1 mt-1">
                                        <button onClick={() => navigator.clipboard.writeText(address)} className="p-1 rounded hover:bg-surface-2 text-text-light"><Copy className="w-3 h-3" /></button>
                                        <a href={`https://allo.info/account/${address}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-surface-2 text-text-light"><ExternalLink className="w-3 h-3" /></a>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}

               {/* Tabs */}
               <div className="flex items-center gap-1 mb-6 border-b border-border">
                    {tabs.map((tab) => (
                         <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-5 py-3 text-[13px] font-medium transition-colors ${activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-primary"}`}>
                              {tab.label}
                              {activeTab === tab.id && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                         </button>
                    ))}
               </div>

               {activeTab === "overview" && (
                    <div className="space-y-6">
                         <div className="rounded-xl border border-border bg-white p-5">
                              <h3 className="text-[11px] font-semibold text-text-light uppercase tracking-wider mb-2">About</h3>
                              <p className="text-sm text-text-muted leading-relaxed">{displayBio || "No bio yet. Edit your profile to add one!"}</p>
                         </div>
                         <div>
                              <h3 className="font-serif text-lg text-text-primary mb-4">Recent Purchases</h3>
                              <div className="text-sm text-text-muted text-center py-8 rounded-xl border border-dashed border-border">
                                   No purchases yet. Start browsing the marketplace!
                              </div>
                         </div>
                    </div>
               )}

               {activeTab === "purchases" && (
                    <div className="text-sm text-text-muted text-center py-12 rounded-xl border border-dashed border-border">
                         No purchases yet. Your order history will appear here.
                    </div>
               )}

               {activeTab === "settings" && (
                    <div className="space-y-3">
                         <div className="rounded-xl border border-border bg-white p-5">
                              <h3 className="text-[11px] font-semibold text-text-light uppercase tracking-wider mb-3">Account</h3>
                              <div className="space-y-3">
                                   <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-text-muted">Email</span>
                                        <span className="text-sm text-text-primary">{displayEmail}</span>
                                   </div>
                                   <div className="flex items-center justify-between py-2 border-t border-border">
                                        <span className="text-sm text-text-muted">University</span>
                                        <span className="text-sm text-text-primary">{displayUniversity}</span>
                                   </div>
                              </div>
                         </div>
                         <div className="rounded-xl border border-border bg-white p-5">
                              <h3 className="text-[11px] font-semibold text-text-light uppercase tracking-wider mb-3">Preferences</h3>
                              <div className="space-y-3">
                                   <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-text-muted">Notifications</span>
                                        <span className="text-sm text-accent">Enabled</span>
                                   </div>
                                   <div className="flex items-center justify-between py-2 border-t border-border">
                                        <span className="text-sm text-text-muted">Currency</span>
                                        <span className="text-sm text-text-primary">ALGO (Algorand)</span>
                                   </div>
                              </div>
                         </div>
                         <button
                              onClick={handleLogout}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 text-[13px] font-medium hover:bg-red-50 transition-all active:scale-[0.99]"
                         >
                              <LogOut className="w-4 h-4" />Sign Out
                         </button>
                    </div>
               )}
          </div>
     );
}

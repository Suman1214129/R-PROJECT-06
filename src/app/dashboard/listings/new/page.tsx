"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X, Check, Image, Tag, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/mock-data";
import { Sidebar } from "@/components/layout/Sidebar";

export default function CreateListingPage() {
     const [step, setStep] = useState(1);
     const [form, setForm] = useState({
          title: "",
          description: "",
          category: "",
          condition: "Like New",
          price: "",
          images: [] as string[],
          tags: "",
     });

     const steps = [
          { num: 1, label: "Details", icon: FileText },
          { num: 2, label: "Photos & Pricing", icon: Image },
          { num: 3, label: "Review", icon: Check },
     ];

     return (
          <div className="flex">
               <Sidebar />
               <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link href="/dashboard/listings" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-8">
                         <ArrowLeft className="w-4 h-4" /> Back to Listings
                    </Link>

                    <h1 className="text-2xl font-bold text-text-primary mb-8">Create Listing</h1>

                    {/* Progress */}
                    <div className="flex items-center gap-3 mb-10">
                         {steps.map((s, i) => (
                              <div key={s.num} className="flex items-center gap-3 flex-1">
                                   <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${s.num < step ? "bg-emerald-100 text-emerald-700" : s.num === step ? "bg-primary text-white" : "bg-surface-2 text-text-light border border-border"
                                        }`}>
                                        {s.num < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                                   </div>
                                   <span className={`text-xs hidden sm:block ${s.num === step ? "text-text-primary font-medium" : "text-text-muted"}`}>{s.label}</span>
                                   {i < steps.length - 1 && <div className={`flex-1 h-px ${s.num < step ? "bg-emerald-300" : "bg-border"}`} />}
                              </div>
                         ))}
                    </div>

                    <AnimatePresence mode="wait">
                         {step === 1 && (
                              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                   <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
                                        <div>
                                             <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Title</label>
                                             <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder='e.g. "MacBook Air M2 — Like New"' className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-primary/50 transition-all" />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Description</label>
                                             <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your item in detail..." rows={4} className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-primary/50 transition-all resize-none" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                             <div>
                                                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Category</label>
                                                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all">
                                                       <option value="">Select category</option>
                                                       {categories.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                  </select>
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Condition</label>
                                                  <div className="flex gap-2">
                                                       {["Like New", "Good", "Fair"].map((c) => (
                                                            <button key={c} onClick={() => setForm({ ...form, condition: c })} className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${form.condition === c ? "bg-primary-light text-primary border border-primary/20 font-medium" : "bg-surface border border-border text-text-muted"}`}>
                                                                 {c}
                                                            </button>
                                                       ))}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <button onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all active:scale-[0.97]">
                                        Continue <ArrowRight className="w-4 h-4" />
                                   </button>
                              </motion.div>
                         )}

                         {step === 2 && (
                              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                   <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
                                        <div>
                                             <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Photos</label>
                                             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                  <button className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center text-text-light hover:text-primary transition-all">
                                                       <Upload className="w-6 h-6" />
                                                       <span className="text-xs mt-1">Upload</span>
                                                  </button>
                                                  {[1, 2, 3].map((i) => (
                                                       <div key={i} className="aspect-square rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-light">
                                                            <Image className="w-6 h-6" />
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Price (ALGO)</label>
                                             <div className="relative">
                                                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                                                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-sm font-mono text-text-primary placeholder:text-text-light focus:outline-none focus:border-primary/50 transition-all" />
                                             </div>
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tags</label>
                                             <div className="relative">
                                                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                                                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. laptop, apple, macbook" className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-primary/50 transition-all" />
                                             </div>
                                        </div>
                                   </div>
                                   <div className="flex gap-3">
                                        <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-border text-sm text-text-muted hover:text-text-primary transition-all"><ArrowLeft className="w-4 h-4 inline mr-2" />Back</button>
                                        <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-[0.97]">Review <ArrowRight className="w-4 h-4 inline ml-2" /></button>
                                   </div>
                              </motion.div>
                         )}

                         {step === 3 && (
                              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                   <div className="rounded-2xl border border-border bg-white p-6">
                                        <h3 className="text-sm font-semibold text-text-primary mb-4">Review Your Listing</h3>
                                        <div className="space-y-4 text-sm">
                                             <div className="flex justify-between"><span className="text-text-muted">Title</span><span className="text-text-primary font-medium">{form.title || "—"}</span></div>
                                             <div className="flex justify-between"><span className="text-text-muted">Category</span><span className="text-text-primary capitalize">{form.category || "—"}</span></div>
                                             <div className="flex justify-between"><span className="text-text-muted">Condition</span><span className="text-text-primary">{form.condition}</span></div>
                                             <div className="flex justify-between"><span className="text-text-muted">Price</span><span className="text-text-primary font-mono">{form.price || "0"} ALGO</span></div>
                                             {form.description && (
                                                  <div className="pt-3 border-t border-border">
                                                       <span className="text-text-muted block mb-1">Description</span>
                                                       <p className="text-text-primary leading-relaxed">{form.description}</p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                                   <div className="flex gap-3">
                                        <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-border text-sm text-text-muted hover:text-text-primary transition-all"><ArrowLeft className="w-4 h-4 inline mr-2" />Back</button>
                                        <button className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-[0.97]">Publish Listing</button>
                                   </div>
                              </motion.div>
                         )}
                    </AnimatePresence>
               </div>
          </div>
     );
}

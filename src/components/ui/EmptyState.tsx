"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
     icon: React.ElementType;
     title: string;
     description: string;
     actionLabel?: string;
     actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
     return (
          <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center py-16 px-6"
          >
               <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-text-light" />
               </div>
               <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
               <p className="text-sm text-text-muted max-w-sm mx-auto">{description}</p>
               {actionLabel && actionHref && (
                    <Link
                         href={actionHref}
                         className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-[0.97]"
                    >
                         {actionLabel}
                    </Link>
               )}
          </motion.div>
     );
}

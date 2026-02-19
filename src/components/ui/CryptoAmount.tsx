"use client";

import { cn, formatALGO, algoToUsd } from "@/lib/utils";

interface CryptoAmountProps {
     amount: number;
     size?: "sm" | "md" | "lg" | "xl";
     showUsd?: boolean;
     className?: string;
}

export function CryptoAmount({ amount, size = "md", showUsd = true, className }: CryptoAmountProps) {
     const sizeStyles = {
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg",
          xl: "text-2xl",
     };

     return (
          <div className={cn("flex items-baseline gap-1.5", className)}>
               <span className={cn("font-semibold font-mono text-text-primary", sizeStyles[size])}>
                    {formatALGO(amount)}
               </span>
               {showUsd && (
                    <span className="text-xs text-text-light font-mono">
                         ≈ ${algoToUsd(amount)}
                    </span>
               )}
          </div>
     );
}

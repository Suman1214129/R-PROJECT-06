"use client";

import { cn, truncateAddress } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface WalletAddressProps {
     address: string;
     className?: string;
}

export function WalletAddress({ address, className }: WalletAddressProps) {
     const [copied, setCopied] = useState(false);

     const handleCopy = async () => {
          await navigator.clipboard.writeText(address);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     };

     return (
          <button
               onClick={handleCopy}
               className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs font-mono text-text-secondary hover:border-border-hover transition-all",
                    className
               )}
               title="Click to copy"
          >
               <span>{truncateAddress(address)}</span>
               {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-text-light" />}
          </button>
     );
}

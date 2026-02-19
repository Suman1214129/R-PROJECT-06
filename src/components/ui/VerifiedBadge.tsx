"use client";

import { CheckCircle } from "lucide-react";

export function VerifiedBadge() {
     return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-light text-primary text-[10px] font-medium">
               <CheckCircle className="w-3 h-3" />
               Verified
          </span>
     );
}

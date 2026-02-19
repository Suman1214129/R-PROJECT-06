"use client";

export function SkeletonCard() {
     return (
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
               <div className="aspect-[4/3] animate-shimmer" />
               <div className="p-3.5 space-y-2.5">
                    <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
                    <div className="h-3.5 w-1/3 rounded-lg animate-shimmer" />
                    <div className="h-px bg-border mt-3" />
                    <div className="flex items-center justify-between pt-1">
                         <div className="h-3 w-20 rounded-lg animate-shimmer" />
                         <div className="h-3 w-12 rounded-lg animate-shimmer" />
                    </div>
               </div>
          </div>
     );
}

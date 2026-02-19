"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";

export default function MessagesPage() {
     const { setMessagesOpen } = useUIStore();

     useEffect(() => {
          setMessagesOpen(true);
     }, [setMessagesOpen]);

     return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
               <h1 className="font-serif text-3xl text-text-primary italic mb-4">Messages</h1>
               <p className="text-text-muted">Your conversations appear in the popup dialog.</p>
               <p className="text-sm text-text-light mt-2">Click the message icon in the navigation bar to open messages anytime.</p>
          </div>
     );
}

import {
     collection,
     addDoc,
     query,
     where,
     getDocs,
     serverTimestamp,
     orderBy,
     onSnapshot,
     doc,
     setDoc,
     getDoc,
     updateDoc,
     limit,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Message {
     id: string;
     conversationId: string;
     senderId: string;
     text: string;
     createdAt: any;
     readBy: string[];
}

export interface Conversation {
     id: string;
     participantIds: string[];
     listingId?: string;
     lastMessage: string;
     lastMessageAt: any;
     updatedAt: any;
     unreadCount?: number; // Calculated client-side usually
}

// Create or Get a conversation between buyer and seller for a listing
export async function getOrCreateConversation(
     buyerId: string,
     sellerId: string,
     listingId?: string
): Promise<string> {
     const convRef = collection(db, "conversations");

     // Simple query method (in production, might need composite index or Array-contains logic)
     // For MPV: Check if exists by participant pair + listing
     // Note: Firestore array-contains-any is tricky for exact pairs. 
     // We will just query by participantIds containing buyerId, then filter manually for sellerId & listingId

     const q = query(convRef, where("participantIds", "array-contains", buyerId));
     const snap = await getDocs(q);

     const existing = snap.docs.find(doc => {
          const data = doc.data();
          const hasSeller = data.participantIds.includes(sellerId);
          // Only match listingId if provided (optional for general chat)
          const matchesListing = listingId ? data.listingId === listingId : true;
          return hasSeller && matchesListing;
     });

     if (existing) {
          return existing.id;
     }

     // Create new
     const newDoc = await addDoc(convRef, {
          participantIds: [buyerId, sellerId],
          listingId: listingId || null,
          lastMessage: "",
          lastMessageAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
     });

     return newDoc.id;
}

export async function sendMessage(conversationId: string, senderId: string, text: string) {
     const messagesRef = collection(db, "conversations", conversationId, "messages");
     const convRef = doc(db, "conversations", conversationId);

     // 1. Add message
     await addDoc(messagesRef, {
          conversationId,
          senderId,
          text,
          createdAt: serverTimestamp(),
          readBy: [senderId],
     });

     // 2. Update conversation summary
     await updateDoc(convRef, {
          lastMessage: text,
          lastMessageAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
     });

     // 3. Notify Recipient
     // We need to fetch the conversation to know participants
     if (conversationId) {
          const snap = await getDoc(convRef);
          if (snap.exists()) {
               const data = snap.data() as Conversation;
               const recipientId = data.participantIds.find(id => id !== senderId);

               if (recipientId) {
                    const { createNotification } = await import("./notifications");
                    // We might want to throttle this or only notify if offline/away, 
                    // but for now, notify every message for "Instagram-like" feel
                    await createNotification(
                         recipientId,
                         "new_message",
                         "New Message",
                         text.substring(0, 50) + (text.length > 50 ? "..." : ""),
                         `/messages` // Open messages dialog
                    );
               }
          }
     }
}

export function subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
     const messagesRef = collection(db, "conversations", conversationId, "messages");
     const q = query(messagesRef, orderBy("createdAt", "asc"), limit(100));

     return onSnapshot(q, (snapshot) => {
          const msgs = snapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data()
          } as Message));
          callback(msgs);
     });
}

export function subscribeToConversations(userId: string, callback: (convs: Conversation[]) => void) {
     const convRef = collection(db, "conversations");
     const q = query(convRef, where("participantIds", "array-contains", userId), orderBy("updatedAt", "desc"));

     return onSnapshot(q, (snapshot) => {
          const convs = snapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data()
          } as Conversation));
          callback(convs);
     });
}

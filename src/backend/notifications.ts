import {
     collection,
     addDoc,
     query,
     where,
     orderBy,
     onSnapshot,
     doc,
     updateDoc,
     deleteDoc,
     serverTimestamp,
     limit,
     getDocs,
     writeBatch,
     type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Notification {
     id: string;
     userId: string;
     type: "order_placed" | "payment_received" | "order_shipped" | "order_delivered" | "new_message";
     title: string;
     message: string;
     link: string;
     read: boolean;
     createdAt: Timestamp | any;
}

/**
 * Create a new notification for a user.
 */
export async function createNotification(
     userId: string,
     type: Notification["type"],
     title: string,
     message: string,
     link: string
) {
     const colRef = collection(db, "notifications");
     await addDoc(colRef, {
          userId,
          type,
          title,
          message,
          link,
          read: false,
          createdAt: serverTimestamp(),
     });
}

/**
 * Mark a notification as read.
 */
export async function markAsRead(notificationId: string) {
     const ref = doc(db, "notifications", notificationId);
     await updateDoc(ref, { read: true });
}

/**
 * Mark all notifications for a user as read.
 */
export async function markAllAsRead(userId: string) {
     const colRef = collection(db, "notifications");
     const q = query(
          colRef,
          where("userId", "==", userId),
          where("read", "==", false)
     );

     const snapshot = await getDocs(q);
     if (snapshot.empty) return;

     const batch = writeBatch(db);
     snapshot.docs.forEach((doc) => {
          batch.update(doc.ref, { read: true });
     });

     await batch.commit();
}

/**
 * Delete a notification.
 */
export async function deleteNotification(notificationId: string) {
     const ref = doc(db, "notifications", notificationId);
     await deleteDoc(ref);
}

/**
 * Subscribe to user's notifications (real-time).
 * Ordered by newest first.
 */
export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
     const colRef = collection(db, "notifications");
     const q = query(
          colRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(50)
     );

     return onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
          } as Notification));
          callback(items);
     });
}

/**
 * Subscribes to just the unread count (for the badge).
 * Firestore doesn't have a cheap "count" listener, so we just listen to unread items.
 */
export function subscribeToUnreadCount(userId: string, callback: (count: number) => void) {
     const colRef = collection(db, "notifications");
     const q = query(
          colRef,
          where("userId", "==", userId),
          where("read", "==", false)
     );

     return onSnapshot(q, (snapshot) => {
          callback(snapshot.size);
     });
}

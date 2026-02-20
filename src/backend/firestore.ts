import {
     doc,
     setDoc,
     getDoc,
     updateDoc,
     deleteDoc,
     collection,
     getDocs,
     query,
     where,
     serverTimestamp,
     type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Types ──────────────────────────────────────────────────────────────

export interface UserProfile {
     name: string;
     email: string;
     university: string;
     avatar: string;
     bio: string;
     memberSince: Timestamp | string;
     signupMethod: "email" | "google";
}

// ── User Profile ───────────────────────────────────────────────────────

/**
 * Create a user profile document in Firestore.
 * Called on first signup (email/password or Google).
 * Uses the Firebase Auth UID as the document ID.
 */
export async function createUserProfile(
     uid: string,
     data: {
          name: string;
          email: string;
          university: string;
          avatar: string;
          signupMethod: "email" | "google";
     }
) {
     const ref = doc(db, "users", uid);

     // Don't overwrite if the profile already exists
     const existing = await getDoc(ref);
     if (existing.exists()) return existing.data() as UserProfile;

     const profile: UserProfile = {
          name: data.name,
          email: data.email,
          university: data.university,
          avatar: data.avatar,
          bio: "",
          memberSince: serverTimestamp() as unknown as Timestamp,
          signupMethod: data.signupMethod,
     };

     await setDoc(ref, profile);
     return profile;
}

/**
 * Get a user profile from Firestore by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
     const ref = doc(db, "users", uid);
     const snap = await getDoc(ref);
     return snap.exists() ? (snap.data() as UserProfile) : null;
}

/**
 * Update specific fields of a user profile.
 */
export async function updateUserProfile(
     uid: string,
     data: Partial<Pick<UserProfile, "name" | "bio" | "avatar" | "university">>
) {
     const ref = doc(db, "users", uid);
     await updateDoc(ref, data);
}

/**
 * Check if an email was registered via email/password signup.
 * Used to block Google sign-in for duplicate emails.
 */
export async function isEmailSignupAccount(email: string): Promise<boolean> {
     // We search all users — in production you'd use a query, but for a small app
     // we can check by iterating. For better perf, we'll use a dedicated collection.
     const usersRef = collection(db, "users");
     const snapshot = await getDocs(usersRef);

     for (const userDoc of snapshot.docs) {
          const data = userDoc.data() as UserProfile;
          if (
               data.email.toLowerCase() === email.toLowerCase() &&
               data.signupMethod === "email"
          ) {
               return true;
          }
     }
     return false;
}

// ── Saved / Liked Listings ─────────────────────────────────────────────

/**
 * Save (like) a listing for a user.
 */
export async function saveListing(uid: string, listingId: string) {
     const ref = doc(db, "users", uid, "savedListings", listingId);
     await setDoc(ref, { savedAt: serverTimestamp() });
}

/**
 * Unsave (unlike) a listing for a user.
 */
export async function unsaveListing(uid: string, listingId: string) {
     const ref = doc(db, "users", uid, "savedListings", listingId);
     await deleteDoc(ref);
}

/**
 * Get all saved listing IDs for a user.
 */
export async function getSavedListingIds(uid: string): Promise<string[]> {
     const colRef = collection(db, "users", uid, "savedListings");
     const snapshot = await getDocs(colRef);
     return snapshot.docs.map((d) => d.id);
}

/**
 * Check if a specific listing is saved by the user.
 */
export async function isListingSaved(
     uid: string,
     listingId: string
): Promise<boolean> {
     const ref = doc(db, "users", uid, "savedListings", listingId);
     const snap = await getDoc(ref);
     return snap.exists();
}

// ── Search History ─────────────────────────────────────────────────────

export interface SearchHistoryItem {
     id: string;
     query: string;
     searchedAt: Timestamp | string;
     hiddenFromUI: boolean;
}

/**
 * Save a search query to the user's search history in Firestore.
 * Avoids duplicates — if same query exists (not hidden), updates timestamp.
 */
export async function saveSearch(uid: string, query: string) {
     const trimmed = query.trim();
     if (!trimmed) return;

     // Use query as a slug-based ID to avoid duplicates
     const id = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 80);
     const ref = doc(db, "users", uid, "searchHistory", id);

     await setDoc(ref, {
          query: trimmed,
          searchedAt: serverTimestamp(),
          hiddenFromUI: false,
     }, { merge: true });
}

/**
 * Get all visible search history items for a user (hiddenFromUI = false).
 * Returns newest first, max 10.
 */
export async function getVisibleSearchHistory(uid: string): Promise<SearchHistoryItem[]> {
     const colRef = collection(db, "users", uid, "searchHistory");
     const snapshot = await getDocs(colRef);

     const items: SearchHistoryItem[] = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() } as SearchHistoryItem))
          .filter((item) => !item.hiddenFromUI)
          .sort((a, b) => {
               const aTime = typeof a.searchedAt === "string" ? new Date(a.searchedAt).getTime() : (a.searchedAt as Timestamp).toMillis();
               const bTime = typeof b.searchedAt === "string" ? new Date(b.searchedAt).getTime() : (b.searchedAt as Timestamp).toMillis();
               return bTime - aTime;
          })
          .slice(0, 10);

     return items;
}

/**
 * Hide a single search history item from the UI.
 * Data stays in Firestore — only hiddenFromUI flag is set to true.
 */
export async function hideSearchItem(uid: string, itemId: string) {
     const ref = doc(db, "users", uid, "searchHistory", itemId);
     await updateDoc(ref, { hiddenFromUI: true });
}

/**
 * Hide ALL search history from the UI.
 * Data stays in Firestore — only hiddenFromUI flags are set to true.
 */
export async function hideAllSearchHistory(uid: string) {
     const colRef = collection(db, "users", uid, "searchHistory");
     const snapshot = await getDocs(colRef);

     const updates = snapshot.docs
          .filter((d) => !d.data().hiddenFromUI)
          .map((d) => updateDoc(d.ref, { hiddenFromUI: true }));

     await Promise.all(updates);
}

// ── Listings ───────────────────────────────────────────────────────────

export interface ListingData {
     id: string;
     title: string;
     description: string;
     price: number;
     category: string;
     condition: "Like New" | "Good" | "Fair";
     images: string[];
     sellerId: string;
     tags: string[];
     views: number;
     status: "Active" | "Paused" | "Sold";
     createdAt: Timestamp | string;
}

// ── Escrow Orders ──────────────────────────────────────────────────────

export interface EscrowOrder {
     id: string;
     listingId: string;
     listingTitle: string;
     listingImage: string;
     buyerUid: string;
     buyerAddress: string;
     sellerAddress: string;
     amount: number; // ALGO
     escrowAddress: string;
     escrowProgram: string; // base64 compiled TEAL
     deliveryCode: string; // 9-digit string
     paymentTxId: string;
     releaseTxId?: string;
     refundTxId?: string;
     status: "pending" | "paid" | "completed" | "cancelled";
     createdAt: Timestamp | string;
}

/**
 * Create a new listing in Firestore.
 */
export async function createListing(
     uid: string,
     data: {
          title: string;
          description: string;
          price: number;
          category: string;
          condition: "Like New" | "Good" | "Fair";
          images: string[];
          tags: string[];
     }
): Promise<string> {
     const listingsRef = collection(db, "listings");
     const newListingRef = doc(listingsRef);

     const listing: Omit<ListingData, "id"> = {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          images: data.images,
          sellerId: uid,
          tags: data.tags,
          views: 0,
          status: "Active",
          createdAt: serverTimestamp() as unknown as Timestamp,
     };

     await setDoc(newListingRef, listing);
     return newListingRef.id;
}

/**
 * Get all listings for a specific seller.
 */
export async function getListingsBySeller(uid: string): Promise<ListingData[]> {
     const listingsRef = collection(db, "listings");
     const q = query(listingsRef, where("sellerId", "==", uid));
     const snapshot = await getDocs(q);

     return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
     })) as ListingData[];
}

/**
 * Get a single listing by ID.
 */
export async function getListingById(listingId: string): Promise<ListingData | null> {
     const ref = doc(db, "listings", listingId);
     const snap = await getDoc(ref);
     return snap.exists() ? ({ id: snap.id, ...snap.data() } as ListingData) : null;
}

/**
 * Update listing status (Active, Paused, Sold).
 */
export async function updateListingStatus(
     listingId: string,
     status: "Active" | "Paused" | "Sold"
) {
     const ref = doc(db, "listings", listingId);
     await updateDoc(ref, { status });
}

/**
 * Delete a listing.
 */
export async function deleteListing(listingId: string) {
     const ref = doc(db, "listings", listingId);
     await deleteDoc(ref);
}

/**
 * Create an escrow order in Firestore.
 * Returns the generated order document ID.
 */
export async function createOrder(data: Omit<EscrowOrder, "id" | "paymentTxId" | "status" | "createdAt">): Promise<string> {
     const colRef = collection(db, "orders");
     const ref = doc(colRef);
     await setDoc(ref, {
          ...data,
          paymentTxId: "",
          status: "pending",
          createdAt: serverTimestamp(),
     });
     return ref.id;
}

/** Get a single order by ID. */
export async function getOrder(orderId: string): Promise<EscrowOrder | null> {
     const ref = doc(db, "orders", orderId);
     const snap = await getDoc(ref);
     if (!snap.exists()) return null;
     return { id: snap.id, ...snap.data() } as EscrowOrder;
}

/** Update order with the payment transaction ID (called after buyer signs with Pera Wallet). */
export async function updateOrderPaymentTx(orderId: string, paymentTxId: string): Promise<void> {
     const ref = doc(db, "orders", orderId);
     await updateDoc(ref, { paymentTxId, status: "paid" });
}

/** Mark order as completed with the escrow release tx ID. */
export async function setOrderCompleted(orderId: string, releaseTxId: string): Promise<void> {
     const ref = doc(db, "orders", orderId);
     await updateDoc(ref, { releaseTxId, status: "completed" });
}

/** Cancel an order and record the refund tx ID. */
export async function cancelOrder(orderId: string, refundTxId: string): Promise<void> {
     const ref = doc(db, "orders", orderId);
     await updateDoc(ref, { refundTxId, status: "cancelled" });
}

/** Get all orders where user is the buyer. */
export async function getBuyerOrders(buyerUid: string): Promise<EscrowOrder[]> {
     const colRef = collection(db, "orders");
     const snap = await getDocs(colRef);
     return snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as EscrowOrder))
          .filter((o) => o.buyerUid === buyerUid)
          .sort((a, b) => {
               const aT = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt as Timestamp).toMillis();
               const bT = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt as Timestamp).toMillis();
               return bT - aT;
          });
}

/** Get all orders where seller's Algorand address matches. */
export async function getSellerOrders(sellerAddress: string): Promise<EscrowOrder[]> {
     const colRef = collection(db, "orders");
     const snap = await getDocs(colRef);
     return snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as EscrowOrder))
          .filter((o) => o.sellerAddress === sellerAddress)
          .sort((a, b) => {
               const aT = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt as Timestamp).toMillis();
               const bT = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt as Timestamp).toMillis();
               return bT - aT;
          });
}

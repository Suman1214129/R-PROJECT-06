import {
     createUserWithEmailAndPassword,
     signInWithEmailAndPassword,
     signInWithPopup,
     GoogleAuthProvider,
     signOut,
     deleteUser,
     unlink,
     onAuthStateChanged,
     updateProfile,
     type User,
     type Unsubscribe,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./firestore";

const googleProvider = new GoogleAuthProvider();

// Force account selection every time
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * Sign up with email and password.
 * Creates a Firestore user profile tied to the user's UID.
 */
export async function signUpWithEmail(email: string, password: string, displayName?: string) {
     const result = await createUserWithEmailAndPassword(auth, email, password);

     if (displayName) {
          await updateProfile(result.user, { displayName });
     }

     // Create Firestore profile
     const domain = email.split("@")[1] || "";
     const universityName = domain
          .replace(".edu.in", "")
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

     await createUserProfile(result.user.uid, {
          name: displayName || email.split("@")[0],
          email,
          university: universityName ? `${universityName} University` : "Unknown University",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          signupMethod: "email",
     });

     return result.user;
}

/**
 * Sign in with email and password.
 */
export async function signInWithEmail(email: string, password: string) {
     const result = await signInWithEmailAndPassword(auth, email, password);
     return result.user;
}

/**
 * Sign in with Google popup.
 */
export async function signInWithGoogle() {
     const result = await signInWithPopup(auth, googleProvider);
     return result.user;
}

/**
 * Sign in with Google and create Firestore profile if new user.
 * Returns the Firebase user.
 */
export async function signInWithGoogleAndCreateProfile() {
     const result = await signInWithPopup(auth, googleProvider);
     const user = result.user;

     // Create Firestore profile (won't overwrite if exists)
     const email = user.email || "";
     const domain = email.split("@")[1] || "";
     const universityName = domain
          .replace(".edu.in", "")
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

     await createUserProfile(user.uid, {
          name: user.displayName || email.split("@")[0],
          email,
          university: universityName ? `${universityName} University` : "Unknown University",
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          signupMethod: "google",
     });

     return user;
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
     await signOut(auth);
}

/**
 * Unlink the Google provider from the current user and sign out.
 */
export async function unlinkGoogleProvider() {
     const user = auth.currentUser;
     if (user) {
          try {
               await unlink(user, "google.com");
          } catch {
               // Provider may not be linked; ignore
          }
          await signOut(auth);
     }
}

/**
 * Delete the currently signed-in Firebase user entirely.
 */
export async function deleteCurrentUser() {
     const user = auth.currentUser;
     if (user) {
          await deleteUser(user);
     }
}

/**
 * Listen for auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
     return onAuthStateChanged(auth, callback);
}

/**
 * Map a Firebase user to our app's user shape.
 */
export function mapFirebaseUser(user: User) {
     const email = user.email || "";
     const domain = email.split("@")[1] || "";
     const universityName = domain
          .replace(".edu.in", "")
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

     return {
          uid: user.uid,
          name: user.displayName || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          university: universityName ? `${universityName} University` : "Unknown University",
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
     };
}


import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
     uid: string;
     name: string;
     email: string;
     university: string;
     avatar: string;
}

interface AuthState {
     isAuthenticated: boolean;
     user: User | null;
     loading: boolean;
     setUser: (user: User | null) => void;
     login: (user: User) => void;
     signup: (user: User) => void;
     logout: () => void;
     setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
     persist(
          (set) => ({
               isAuthenticated: false,
               user: null,
               loading: true,
               setUser: (user) =>
                    set({
                         isAuthenticated: !!user,
                         user,
                         loading: false,
                    }),
               login: (user) => set({ isAuthenticated: true, user, loading: false }),
               signup: (user) => set({ isAuthenticated: true, user, loading: false }),
               logout: () => set({ isAuthenticated: false, user: null, loading: false }),
               setLoading: (loading) => set({ loading }),
          }),
          { name: "campusswap-auth" }
     )
);

export function isValidEmail(email: string): boolean {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

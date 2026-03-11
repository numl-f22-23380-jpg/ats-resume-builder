// authStore.js
// Global state for authentication
// Stores user info and login status
// Any page can read from this store

import { create } from 'zustand'

const useAuthStore = create((set) => ({

  // ─── STATE ──────────────────────────────
  user:     null,   // logged in user object
  token:    null,   // JWT token from backend
  isLoggedIn: false, // is user logged in?

  // ─── ACTIONS ────────────────────────────

  // Called after successful login
  login: (userData, token) => set({
    user:       userData,
    token:      token,
    isLoggedIn: true,
  }),

  // Called after logout
  logout: () => set({
    user:       null,
    token:      null,
    isLoggedIn: false,
  }),

  // Called when user updates their profile
  updateUser: (userData) => set({
    user: userData,
  }),

}))

export default useAuthStore
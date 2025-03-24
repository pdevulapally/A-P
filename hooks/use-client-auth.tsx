"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { useFirebase } from "@/components/firebase-provider"
import { createClientProfile } from "@/lib/firebase"

const ClientAuthContext = createContext(null)

export function ClientAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { auth, isInitialized } = useFirebase()

  useEffect(() => {
    if (!auth || !isInitialized) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth, isInitialized])

  const login = async (email, password) => {
    if (!auth) throw new Error("Auth not initialized")
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email, password, userData) => {
    if (!auth) throw new Error("Auth not initialized")

    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update the user profile with display name
    await updateProfile(userCredential.user, {
      displayName: userData.name,
    })

    // Create the client profile in Firestore
    await createClientProfile(userCredential.user.uid, {
      name: userData.name,
      email,
      companyName: userData.companyName || "",
      createdAt: new Date().toISOString(),
    })

    return userCredential
  }

  const logout = async () => {
    if (!auth) throw new Error("Auth not initialized")
    return signOut(auth)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  }

  return <ClientAuthContext.Provider value={value}>{children}</ClientAuthContext.Provider>
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // Return a default value for server-side rendering
    return {
      user: null,
      loading: true,
      login: async () => {
        throw new Error("Cannot call login during SSR")
      },
      signup: async () => {
        throw new Error("Cannot call signup during SSR")
      },
      logout: async () => {
        throw new Error("Cannot call logout during SSR")
      },
    }
  }

  if (!context) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider")
  }
  return context
}


"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { useFirebase } from "@/components/firebase-provider"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
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

  const logout = async () => {
    if (!auth) throw new Error("Auth not initialized")
    return signOut(auth)
  }

  const value = {
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


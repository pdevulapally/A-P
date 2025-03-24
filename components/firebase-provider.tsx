"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAObe4TGNbvy63mkaK1F75703CWaBugATY",
  authDomain: "arjun-and-preetham.firebaseapp.com",
  projectId: "arjun-and-preetham",
  storageBucket: "arjun-and-preetham.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "234923795312",
  appId: "1:234923795312:web:922ccd131c6aa542d6a5b5",
  measurementId: "G-VPD056V2Z0",
}

// Create a context for Firebase
const FirebaseContext = createContext(null)

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

export default function FirebaseProvider({ children }) {
  const [firebaseApp, setFirebaseApp] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [db, setDb] = useState(null)
  const [storage, setStorage] = useState(null)
  const [auth, setAuth] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

  // Monitor online status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  useEffect(() => {
    // Initialize Firebase only on the client side
    if (typeof window !== "undefined") {
      try {
        // Check if Firebase is already initialized
        const apps = getApps()
        const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]
        setFirebaseApp(app)

        // Initialize services
        try {
          // Analytics only works in browser
          if (typeof window !== "undefined") {
            isSupported()
              .then((supported) => {
                if (supported) {
                  const analyticsInstance = getAnalytics(app)
                  setAnalytics(analyticsInstance)
                }
              })
              .catch((err) => {
                console.warn("Analytics not supported:", err)
              })
          }

          const firestoreInstance = getFirestore(app)
          setDb(firestoreInstance)

          // Enable offline persistence when possible
          if (typeof window !== "undefined") {
            enableIndexedDbPersistence(firestoreInstance).catch((err) => {
              if (err.code === "failed-precondition") {
                console.warn("Persistence failed: multiple tabs open")
              } else if (err.code === "unimplemented") {
                console.warn("Persistence not available in this browser")
              }
            })
          }

          const storageInstance = getStorage(app)
          setStorage(storageInstance)

          const authInstance = getAuth(app)
          setAuth(authInstance)

          setIsInitialized(true)
        } catch (error) {
          console.error("Error initializing Firebase services:", error)
        }
      } catch (error) {
        console.error("Error initializing Firebase app:", error)
      }
    }
  }, [])

  const value = {
    app: firebaseApp,
    analytics,
    db,
    storage,
    auth,
    isInitialized,
    isOnline,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}


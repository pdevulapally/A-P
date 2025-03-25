"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import {
  getAnalytics,
  isSupported,
  Analytics
} from "firebase/analytics"
import {
  getFirestore,
  enableIndexedDbPersistence,
  Firestore
} from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { getAuth, Auth } from "firebase/auth"

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAObe4TGNbvy63mkaK1F75703CWaBugATY",
  authDomain: "arjun-and-preetham.firebaseapp.com",
  projectId: "arjun-and-preetham",
  storageBucket: "arjun-and-preetham.appspot.com",
  messagingSenderId: "234923795312",
  appId: "1:234923795312:web:922ccd131c6aa542d6a5b5",
  measurementId: "G-VPD056V2Z0",
}

// ✅ Initialize app and export it for direct use
const apps = getApps()
export const app: FirebaseApp = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]

// ✅ Context types
type FirebaseContextType = {
  app: FirebaseApp
  analytics: Analytics | null
  db: Firestore | null
  storage: FirebaseStorage | null
  auth: Auth | null
  isInitialized: boolean
  isOnline: boolean
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

interface FirebaseProviderProps {
  children: ReactNode
}

export default function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [db, setDb] = useState<Firestore | null>(null)
  const [storage, setStorage] = useState<FirebaseStorage | null>(null)
  const [auth, setAuth] = useState<Auth | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )

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
    if (typeof window !== "undefined") {
      try {
        isSupported()
          .then((supported) => {
            if (supported) {
              const analyticsInstance = getAnalytics(app)
              setAnalytics(analyticsInstance)
            }
          })
          .catch((err) => console.warn("Analytics not supported:", err))

        const firestoreInstance = getFirestore(app)
        setDb(firestoreInstance)

        enableIndexedDbPersistence(firestoreInstance).catch((err) => {
          if (err.code === "failed-precondition") {
            console.warn("Persistence failed: multiple tabs open")
          } else if (err.code === "unimplemented") {
            console.warn("Persistence not available in this browser")
          }
        })

        const storageInstance = getStorage(app)
        setStorage(storageInstance)

        const authInstance = getAuth(app)
        setAuth(authInstance)

        setIsInitialized(true)
      } catch (error) {
        console.error("Error initializing Firebase services:", error)
      }
    }
  }, [])

  const value: FirebaseContextType = {
    app,
    analytics,
    db,
    storage,
    auth,
    isInitialized,
    isOnline,
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

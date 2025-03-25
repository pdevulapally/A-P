"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        router.push("/admin/login")
        return
      }

      const token = await user.getIdTokenResult()
      if (!token.claims.admin) {
        auth.signOut()
        router.push("/admin/login")
        return
      }

      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
} 
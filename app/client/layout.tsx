"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { useClientAuth } from "@/hooks/use-client-auth"
import { Loader2 } from "lucide-react"
import { ClientAuthProvider } from "@/hooks/use-client-auth"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientAuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </ClientAuthProvider>
  )
}

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useClientAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !loading && !user) {
      router.push("/client/login")
    }
  }, [isMounted, loading, user, router])

  if (!isMounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user && pathname !== "/client/login" && pathname !== "/client/signup") {
    return null
  }

  if (pathname === "/client/login" || pathname === "/client/signup") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ClientHeader />
      <div className="flex flex-1">
        <ClientSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}


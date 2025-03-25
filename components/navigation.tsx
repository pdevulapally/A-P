"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Home, Info, Briefcase, FolderOpen, Mail, CreditCard, Mountain } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: Info },
  { name: "Services", path: "/services", icon: Briefcase },
  { name: "Portfolio", path: "/portfolio", icon: FolderOpen },
  { name: "Contact", path: "/contact", icon: Mail },
  { name: "Payment", path: "/payment", icon: CreditCard },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-4 z-50 w-full max-w-[95%] mx-auto">
      <div className="relative">
        {/* Glassmorphic background with tube effect */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[12px] rounded-full border border-border/40 shadow-lg" />
        
        <div className="relative px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline">Arjun & Preetham</span>
            <span className="font-bold text-xl sm:hidden">A&P</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all hover:text-primary rounded-full
                    ${pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
              <div className="pl-2">
                <ModeToggle />
              </div>
            </nav>
          )}

          {/* Mobile Navigation Toggle */}
          {isMobile && (
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                aria-label="Toggle Menu" 
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 relative"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-lg rounded-2xl border border-border/40 shadow-lg" />
            <nav className="relative py-4 px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center space-x-2 p-3 mb-1 rounded-xl transition-all
                      ${pathname === item.path 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted/50 text-muted-foreground"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


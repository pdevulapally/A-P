"use client"

import { useEffect, useState } from "react"

interface TypewriterEffectProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

export function TypewriterEffect({ text, className = "", speed = 50, delay = 0 }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Reset when text changes
    setDisplayText("")
    setCurrentIndex(0)
    setIsTyping(false)

    // Initial delay before typing starts
    timeout = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping && currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [currentIndex, isTyping, speed, text])

  return <span className={className}>{displayText}</span>
}


"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Spline from '@splinetool/react-spline'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { getHeroContent } from "@/lib/firebase"
import { ErrorBoundary } from "react-error-boundary"

export default function Hero() {
  const [heroContent, setHeroContent] = useState({
    title: "Building the Future of the Web",
    subtitle:
      "We create immersive, cutting-edge web experiences that blend creativity, technology, and business strategy.",
    primaryButtonText: "Start Your Project",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View Our Work",
    secondaryButtonLink: "/portfolio",
  })
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  const controls = useAnimation()
  const router = useRouter()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const content = await getHeroContent()
        if (content) {
          setHeroContent(content)
        }
      } catch (error) {
        console.error("Error fetching hero content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Failed to load 3D scene</p>
            </div>
          )}
        >
          <Spline 
            scene="https://prod.spline.design/99C1vKMlyjtgWIez/scene.splinecode"
            onError={(error) => console.error("Spline scene failed to load:", error)}
            className="w-full h-full"
          />
        </ErrorBoundary>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                hidden: { opacity: 0, y: 20 },
              }}
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                {heroContent.title}
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-xl">
                {heroContent.subtitle}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
                hidden: { opacity: 0, y: 20 },
              }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
              >
                <Link href={heroContent.primaryButtonLink}>
                  {heroContent.primaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={heroContent.secondaryButtonLink}>
                  {heroContent.secondaryButtonText}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

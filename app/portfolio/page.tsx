"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioItem from "@/components/portfolio-item"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Portfolio data
const portfolioItems = [
  {
    id: 1,
    title: "Quantum E-commerce Platform",
    category: "e-commerce",
    description: "A next-generation e-commerce platform with 3D product visualization and AR try-on features.",
    imageSrc: "/placeholder.svg?height=600&width=800",
    technologies: ["Next.js", "Three.js", "Stripe", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Nebula Analytics Dashboard",
    category: "business",
    description: "An interactive analytics dashboard with real-time data visualization and predictive insights.",
    imageSrc: "/placeholder.svg?height=600&width=800",
    technologies: ["React", "D3.js", "Firebase", "Material UI"],
  },
  {
    id: 3,
    title: "Pulse Social Network",
    category: "social",
    description: "A modern social platform with immersive 3D spaces for virtual meetups and collaboration.",
    imageSrc: "/placeholder.svg?height=600&width=800",
    technologies: ["Next.js", "Three.js", "Socket.io", "Framer Motion"],
  },
  {
    id: 4,
    title: "Horizon Travel Experience",
    category: "travel",
    description: "A travel planning platform with interactive 3D maps and virtual destination previews.",
    imageSrc: "/placeholder.svg?height=600&width=800",
    technologies: ["React", "MapboxGL", "Three.js", "Node.js"],
  },
  {
    id: 5,
    title: "Fusion Restaurant Platform",
    category: "food",
    description: "A restaurant management system with 3D menu visualization and virtual dining experiences.",
    imageSrc: "/placeholder.svg?height=600&width=800",
    technologies: ["Next.js", "Three.js", "Prisma", "PostgreSQL"],
  },
  {
    id: 6,
    title: "Eclipse Learning Management",
    category: "education",
    description: "An interactive learning platform with 3D models and immersive educational experiences.",
    imageSrc: "/placeholder.svg?height=600&width=800",
    technologies: ["React", "Three.js", "GraphQL", "AWS Amplify"],
  },
]

export default function PortfolioPage() {
  const [filter, setFilter] = useState("all")

  const filteredItems = filter === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === filter)

  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-6">
          Our Portfolio
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our latest projects showcasing our expertise in creating immersive, cutting-edge web experiences.
        </p>
      </motion.div>

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full max-w-4xl mx-auto">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="e-commerce" onClick={() => setFilter("e-commerce")}>
            E-commerce
          </TabsTrigger>
          <TabsTrigger value="business" onClick={() => setFilter("business")}>
            Business
          </TabsTrigger>
          <TabsTrigger value="social" onClick={() => setFilter("social")}>
            Social
          </TabsTrigger>
          <TabsTrigger value="travel" onClick={() => setFilter("travel")}>
            Travel
          </TabsTrigger>
          <TabsTrigger value="food" onClick={() => setFilter("food")}>
            Food
          </TabsTrigger>
          <TabsTrigger value="education" onClick={() => setFilter("education")}>
            Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
        <TabsContent value="e-commerce" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
        <TabsContent value="business" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
        <TabsContent value="social" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
        <TabsContent value="travel" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
        <TabsContent value="food" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
        <TabsContent value="education" className="mt-8">
          <PortfolioGrid items={filteredItems} />
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center p-8 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm border border-primary/20"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Build Your Next Project?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Let's collaborate to create a website that stands out from the competition and delivers exceptional results.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
        >
          <Link href="/contact">
            Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

function PortfolioGrid({ items }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={items.map((item) => item.id).join(",")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PortfolioItem
              title={item.title}
              description={item.description}
              imageSrc={item.imageSrc}
              technologies={item.technologies}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}


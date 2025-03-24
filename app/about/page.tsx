"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import TeamMember from "@/components/team-member"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-6">
          About Our Mission
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are on a mission to transform the digital landscape with cutting-edge web solutions that blend creativity,
          technology, and business strategy.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="text-muted-foreground">
            We envision a web where technology seamlessly enhances human experiences. Our goal is to create digital
            solutions that not only look stunning but also deliver exceptional performance and user experience.
          </p>
          <p className="text-muted-foreground">
            Founded by Arjun Ramdhan and Preetham Kaushik, our studio combines technical expertise with creative vision
            to build websites that stand out in today's crowded digital landscape.
          </p>
          <Button asChild>
            <Link href="/services">
              Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-[400px] rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-primary/20"
        >
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
              <mesh>
                <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
                <meshStandardMaterial color="#8B5CF6" emissive="#4C1D95" roughness={0.2} metalness={0.8} />
              </mesh>
            </Float>
            <OrbitControls enableZoom={false} />
            <Environment preset="city" />
          </Canvas>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-24"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Meet The Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TeamMember
            name="Arjun Ramdhan"
            role="Founder & Technical Lead"
            bio="With over 8 years of experience in web development, Arjun specializes in creating high-performance, scalable web applications using cutting-edge technologies."
            imageSrc="/placeholder.svg?height=400&width=400"
          />
          <TeamMember
            name="Preetham Kaushik"
            role="Founder & Creative Director"
            bio="Preetham brings his creative vision and UX expertise to every project, ensuring our websites not only function flawlessly but also deliver exceptional user experiences."
            imageSrc="/placeholder.svg?height=400&width=400"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20">
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-muted-foreground">We constantly push the boundaries of what's possible on the web.</p>
          </div>
          <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20">
            <h3 className="text-xl font-bold mb-3">Quality</h3>
            <p className="text-muted-foreground">
              We never compromise on the quality of our work or the user experience.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20">
            <h3 className="text-xl font-bold mb-3">Collaboration</h3>
            <p className="text-muted-foreground">We work closely with our clients to bring their vision to life.</p>
          </div>
          <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20">
            <h3 className="text-xl font-bold mb-3">Accessibility</h3>
            <p className="text-muted-foreground">
              We believe the web should be accessible to everyone, regardless of ability.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/contact">
            Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}


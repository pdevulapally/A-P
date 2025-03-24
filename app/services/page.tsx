"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ServiceCard from "@/components/service-card"

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-6">
          Our Services
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We offer a comprehensive range of web development services to help your business thrive in the digital world.
        </p>
      </motion.div>

      <div className="h-[400px] mb-16 rounded-xl overflow-hidden">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Float speed={4} rotationIntensity={1} floatIntensity={2}>
            <ServiceScene />
          </Float>
          <Environment preset="city" />
        </Canvas>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <ServiceCard
          title="Web Design"
          description="Custom, responsive designs that capture your brand's essence and provide exceptional user experiences across all devices."
          icon="Palette"
          features={["UI/UX Design", "Responsive Layouts", "Brand Integration", "Prototype Development"]}
        />
        <ServiceCard
          title="Web Development"
          description="Cutting-edge web applications built with modern technologies that deliver performance, scalability, and reliability."
          icon="Code"
          features={["Frontend Development", "Backend Systems", "API Integration", "E-commerce Solutions"]}
        />
        <ServiceCard
          title="Business Solutions"
          description="Strategic digital solutions that help your business grow, from marketing websites to complex enterprise applications."
          icon="BarChart"
          features={["Business Analysis", "Digital Strategy", "SEO Optimization", "Analytics Integration"]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20"
        >
          <h2 className="text-2xl font-bold mb-4">Custom Development</h2>
          <p className="text-muted-foreground mb-6">
            We specialize in building custom web applications tailored to your specific business needs. Our development
            process focuses on creating scalable, maintainable, and high-performance solutions.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Next.js & React Applications</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>3D Web Experiences with Three.js</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Headless CMS Integration</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Progressive Web Applications</span>
            </li>
          </ul>
          <Button asChild>
            <Link href="/contact">
              Discuss Your Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-8 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20"
        >
          <h2 className="text-2xl font-bold mb-4">Our Process</h2>
          <ol className="relative border-l border-primary/30">
            <ProcessStep
              number="01"
              title="Discovery"
              description="We start by understanding your business, goals, and requirements to create a tailored solution."
            />
            <ProcessStep
              number="02"
              title="Planning"
              description="We develop a comprehensive plan including architecture, design concepts, and project timeline."
            />
            <ProcessStep
              number="03"
              title="Development"
              description="Our team brings your project to life using cutting-edge technologies and best practices."
            />
            <ProcessStep
              number="04"
              title="Testing & Launch"
              description="Rigorous testing ensures your project is flawless before we help you launch it to the world."
            />
            <ProcessStep
              number="05"
              title="Support & Growth"
              description="We provide ongoing support and help you evolve your digital presence as your business grows."
              isLast={true}
            />
          </ol>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center p-8 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm border border-primary/20"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Digital Presence?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Let's collaborate to create a website that not only looks stunning but also drives results for your business.
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

function ServiceScene() {
  return (
    <group>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#4C1D95" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="#EC4899" emissive="#831843" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <torusGeometry args={[0.6, 0.2, 16, 32]} />
        <meshStandardMaterial color="#3B82F6" emissive="#1E40AF" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
}

interface ProcessStepProps {
  number: string
  title: string
  description: string
  isLast?: boolean
}

function ProcessStep({ number, title, description, isLast = false }: ProcessStepProps) {
  return (
    <li className="mb-6 ml-6">
      <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-primary text-primary-foreground">
        {number}
      </span>
      <h3 className="flex items-center text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {!isLast && <div className="h-6"></div>}
    </li>
  )
}


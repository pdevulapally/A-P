"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, OrbitControls, Text3D, Center } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { getHeroContent } from "@/lib/firebase"
import * as THREE from "three"
import { FontLoader, type Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
        // Just use the default content when there's an error
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
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <EnhancedHeroScene title={heroContent.title} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Environment preset="city" />
        </Canvas>
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
              <p className="mt-4 text-muted-foreground md:text-xl max-w-xl">{heroContent.subtitle}</p>
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
                <Link href={heroContent.secondaryButtonLink}>{heroContent.secondaryButtonText}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EnhancedHeroScene({ title }: { title: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const [mousePosition, setMousePosition] = useState([0, 0])
  
  // Split the title into words for 3D rendering
  const words = title.split(' ').slice(0, 3) // Limit to first 3 words for better visual display

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition([x * 0.1, y * 0.1])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1

      // Add subtle mouse-based rotation
      groupRef.current.rotation.x = mousePosition[1]
      groupRef.current.rotation.y += mousePosition[0]
    }
  })

  // Responsive sizing based on viewport
  const scale = Math.min(1, viewport.width / 5)

  return (
    <group ref={groupRef} scale={scale}>
      {/* 3D Text for title words */}
      {words.map((word, index) => (
        <Float 
          key={index} 
          speed={1.5} 
          rotationIntensity={0.2} 
          floatIntensity={0.5}
          position={[index * 4 - 4, -index * 1.5, 0]}
        >
          <Text3DWrapper 
            text={word} 
            color={index === 0 ? "#8B5CF6" : index === 1 ? "#EC4899" : "#3B82F6"} 
            emissive={index === 0 ? "#4C1D95" : index === 1 ? "#831843" : "#1E40AF"}
          />
        </Float>
      ))}

      {/* Floating geometric elements */}
      <Float speed={4} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-4, -1, -2]}>
          <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#4C1D95" roughness={0.2} metalness={0.8} wireframe={true} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.5}>
        <mesh position={[4, 1, -1]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#EC4899" emissive="#831843" roughness={0.2} metalness={0.8} wireframe={true} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.6} floatIntensity={0.7}>
        <mesh position={[0, -3, 1]}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#3B82F6" emissive="#1E40AF" roughness={0.2} metalness={0.8} wireframe={true} />
        </mesh>
      </Float>

      {/* Particle system */}
      <ParticleSystem />
    </group>
  )
}

function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 100
  const positions = new Float32Array(count * 3)

  // Create random positions for particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 15
    positions[i3 + 1] = (Math.random() - 0.5) * 15
    positions[i3 + 2] = (Math.random() - 0.5) * 15
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (particlesRef.current) {
      // Animate particles
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        particlesRef.current.geometry.attributes.position.array[i3 + 1] += Math.sin(time + i) * 0.01
        particlesRef.current.geometry.attributes.position.array[i3] += Math.cos(time + i) * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#8B5CF6" sizeAttenuation={true} transparent={true} opacity={0.6} />
    </points>
  )
}

// Text3D component with fallback
function Text3DWrapper({ text, color, emissive, position }: { text: string; color: string; emissive: string; position?: [number, number, number] }) {
  const [font, setFont] = useState<Font | null>(null)
  const [error, setError] = useState(false)
  const fontPath = '/fonts/Inter_Bold.json'
  
  useEffect(() => {
    const loader = new FontLoader()
    loader.load(
      fontPath,
      (loadedFont) => setFont(loadedFont),
      undefined,
      (err) => {
        console.error('Error loading font:', err)
        setError(true)
      }
    )
  }, [])
  
  if (error || !font) {
    return (
      <mesh position={position || [0, 0, 0]}>
        <boxGeometry args={[text.length * 0.5, 1, 0.2]} />
        <meshStandardMaterial color={color} emissive={emissive} />
      </mesh>
    )
  }
  
  return (
    <Center>
      <Text3D
        font={fontPath}
        size={0.8}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial color={color} emissive={emissive} />
      </Text3D>
    </Center>
  )
}

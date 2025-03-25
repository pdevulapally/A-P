"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getServiceBySlug } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import NotFound from "@/app/not-found"

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  process?: Array<{ title: string; description: string }>;
  benefits?: Array<{ title: string; description: string }>;
  faq?: Array<{ question: string; answer: string }>;
}

export default function ServiceDetails() {
  const { slug } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        if (typeof slug === 'string') {
          const data = await getServiceBySlug(slug)
          if (data && 'title' in data && 'description' in data && 'features' in data && 'icon' in data) {
            setService(data as Service)
          } else {
            setNotFound(true)
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error)
        toast({
          title: "Error",
          description: "Failed to load service details. Please try again.",
          variant: "destructive",
        })
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchService()
    }
  }, [slug, toast])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound) {
    return <NotFound />
  }

  if (!service) {
    return null
  }

  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/services" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground mt-4">{service.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">What We Offer</h2>
            <ul className="space-y-2">
              {service.features?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2 mt-2"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button asChild size="lg" className="mt-6">
            <Link href="/contact">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-[400px] rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-primary/20">
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                <ServiceScene icon={service.icon} />
              </Float>
              <OrbitControls enableZoom={false} />
              <Environment preset="city" />
            </Canvas>
          </div>
        </motion.div>
      </div>

      <div className="mt-24">
        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="process">Our Process</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="process" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.process?.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="benefits" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.benefits?.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <div className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="faq" className="mt-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {service.faq?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-primary/20"
                >
                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Let's collaborate to create a solution that meets your specific needs and helps your business thrive.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
          >
            <Link href="/contact">
              Contact Us <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/portfolio">View Our Work</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ServiceScene({ icon }: { icon: string }) {
  // Render different 3D objects based on the service icon
  switch (icon) {
    case "Palette":
      return (
        <mesh>
          <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
          <meshStandardMaterial color="#EC4899" emissive="#831843" roughness={0.2} metalness={0.8} />
        </mesh>
      )
    case "Code":
      return (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#4C1D95" roughness={0.2} metalness={0.8} />
        </mesh>
      )
    case "BarChart":
      return (
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#3B82F6" emissive="#1E40AF" roughness={0.2} metalness={0.8} />
        </mesh>
      )
    default:
      return (
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="#10B981" emissive="#065F46" roughness={0.2} metalness={0.8} />
        </mesh>
      )
  }
}


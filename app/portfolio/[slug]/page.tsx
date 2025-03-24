"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getProjectBySlug } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import NotFound from "@/app/not-found"

export default function ProjectDetails() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const data = await getProjectBySlug(slug)
        if (data) {
          setProject(data)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        })
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProject()
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

  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/portfolio" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative aspect-video overflow-hidden rounded-xl mb-6">
            {project.featuredImage ? (
              <Image
                src={project.featuredImage || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-[400px] rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-primary/20">
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
              </div>
            )}
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {project.gallery.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{project.category}</Badge>
              {project.status === "published" && <Badge variant="outline">Published</Badge>}
            </div>
            <h1 className="text-4xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground mt-2">{project.description}</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tech">Technologies</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="space-y-2">
                {project.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2 mt-2"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="tech" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Project Details</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Client</dt>
                <dd>{project.client || "Confidential"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Completed</dt>
                <dd>{project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "Ongoing"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Project Type</dt>
                <dd>{project.projectType || project.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Duration</dt>
                <dd>{project.duration || "N/A"}</dd>
              </div>
            </dl>
          </div>

          {project.liveUrl && (
            <Button asChild className="mt-6">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Visit Live Site <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </motion.div>
      </div>

      <div className="mt-24">
        <h2 className="text-3xl font-bold mb-8 text-center">More Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* This would be populated with related projects from Firebase */}
          {/* For now, we'll show placeholder content */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-muted/30 h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Clock, MessageSquare, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getClientProjects } from "@/lib/firebase"
import { useClientAuth } from "@/hooks/use-client-auth"
import { ProjectTimeline } from "@/components/client/project-timeline"
import { ProjectMessages } from "@/components/client/project-messages"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

export default function ClientDashboard() {
  const { user } = useClientAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await getClientProjects(user.uid)
        setProjects(data)
      } catch (error) {
        console.error("Error fetching client projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <TypewriterEffect text="Welcome to Your Client Dashboard" className="text-3xl md:text-4xl font-bold mb-6" />
          <p className="text-xl text-muted-foreground mb-8">
            You don't have any active projects yet. Please contact us to discuss your web development needs.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <TypewriterEffect text="Welcome to Your Client Dashboard" className="text-3xl md:text-4xl font-bold mb-2" />
        <p className="text-muted-foreground">Track the progress of your web development projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge
                  className={
                    project.status === "completed"
                      ? "bg-green-500"
                      : project.status === "in-progress"
                        ? "bg-blue-500"
                        : project.status === "planning"
                          ? "bg-amber-500"
                          : "bg-slate-500"
                  }
                >
                  {project.status === "in-progress"
                    ? "In Progress"
                    : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/client/projects/${project.id}`}>View Details</Link>
                  </Button>

                  {project.livePreviewUrl && (
                    <Button asChild variant="ghost" size="sm">
                      <a href={project.livePreviewUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" /> Preview
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length > 0 && (
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" /> Messages
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" /> Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <ProjectTimeline projectId={projects[0].id} />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ProjectMessages projectId={projects[0].id} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
                <CardDescription>Access all documents related to your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects[0].documents?.length > 0 ? (
                    projects[0].documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No documents available yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}


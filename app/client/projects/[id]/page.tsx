"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, Clock, MessageSquare, FileText, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getClientProject } from "@/lib/firebase"
import { useClientAuth } from "@/hooks/use-client-auth"
import { ProjectTimeline } from "@/components/client/project-timeline"
import { ProjectMessages } from "@/components/client/project-messages"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { ProjectStatusCard } from "@/components/client/project-status-card"
import { ProjectTeam } from "@/components/client/project-team"
import NotFound from "@/app/not-found"

export default function ProjectDetails() {
  const { id } = useParams()
  const { user } = useClientAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !id) return

      try {
        setLoading(true)
        const data = await getClientProject(id, user.uid)

        if (!data) {
          setNotFound(true)
          return
        }

        // Check if this project belongs to the current user
        if (data.clientId !== user.uid) {
          setUnauthorized(true)
          return
        }

        setProject(data)
      } catch (error) {
        console.error("Error fetching project details:", error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, user])

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

  if (unauthorized) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-muted-foreground mb-8">You don't have permission to view this project.</p>
        <Button asChild>
          <Link href="/client">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-4">
        <Link href="/client" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <TypewriterEffect text={project.title} className="text-3xl md:text-4xl font-bold mb-2" />
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <Badge
            className={`text-base py-1 px-3 ${
              project.status === "completed"
                ? "bg-green-500"
                : project.status === "in-progress"
                  ? "bg-blue-500"
                  : project.status === "planning"
                    ? "bg-amber-500"
                    : "bg-slate-500"
            }`}
          >
            {project.status === "in-progress"
              ? "In Progress"
              : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Current status and progress of your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-xs text-muted-foreground">Due Date</p>
                        <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Current Phase</h3>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{project.currentPhase}</p>
                      <p className="text-sm text-muted-foreground">{project.phaseDescription}</p>
                    </div>
                  </div>
                </div>

                {project.livePreviewUrl && (
                  <div className="pt-2">
                    <Button asChild>
                      <a href={project.livePreviewUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> View Live Preview
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <ProjectStatusCard project={project} />
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="timeline">
            <Clock className="h-4 w-4 mr-2" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" /> Messages
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" /> Documents
          </TabsTrigger>
          <TabsTrigger value="team">
            <FileText className="h-4 w-4 mr-2" /> Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline projectId={project.id} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <ProjectMessages projectId={project.id} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Access all documents related to your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.documents?.length > 0 ? (
                  project.documents.map((doc, index) => (
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

        <TabsContent value="team" className="mt-6">
          <ProjectTeam projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


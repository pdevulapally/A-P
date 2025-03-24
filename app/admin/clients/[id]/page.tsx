"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ArrowLeft, Plus, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getClientById, getClientProjects } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { ProjectDialog } from "@/components/admin/project-dialog"
import { ClientUpdateDialog } from "@/components/admin/client-update-dialog"
import NotFound from "@/app/not-found"

export default function ClientDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true)
        const clientData = await getClientById(id)

        if (!clientData) {
          setNotFound(true)
          return
        }

        setClient(clientData)

        // Fetch client's projects
        const projectsData = await getClientProjects(id)
        setProjects(projectsData)
      } catch (error) {
        console.error("Error fetching client data:", error)
        toast({
          title: "Error",
          description: "Failed to load client data. Please try again.",
          variant: "destructive",
        })
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClientData()
    }
  }, [id, toast])

  const handleAddProject = () => {
    setSelectedProject(null)
    setIsProjectDialogOpen(true)
  }

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setIsProjectDialogOpen(true)
  }

  const handleEditClient = () => {
    setIsClientDialogOpen(true)
  }

  const handleProjectDialogClose = (refreshData = false) => {
    setIsProjectDialogOpen(false)
    if (refreshData) {
      // Refresh projects data
      getClientProjects(id).then((data) => setProjects(data))
    }
  }

  const handleClientDialogClose = (refreshData = false) => {
    setIsClientDialogOpen(false)
    if (refreshData) {
      // Refresh client data
      getClientById(id).then((data) => setClient(data))
    }
  }

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/clients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
        </div>
        <Button onClick={handleEditClient}>
          <Edit className="mr-2 h-4 w-4" /> Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd>{client.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                <dd>{client.companyName || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd>{client.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Client Since</dt>
                <dd>{new Date(client.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                {projects.length} {projects.length === 1 ? "project" : "projects"} assigned to this client
              </CardDescription>
            </div>
            <Button onClick={handleAddProject}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No projects assigned to this client yet</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{project.progress}%</TableCell>
                        <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/projects/${project.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent interactions and updates for this client</CardDescription>
            </CardHeader>
            <CardContent>
              {client.activities && client.activities.length > 0 ? (
                <div className="space-y-4">
                  {client.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No recent activity</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Notes</CardTitle>
              <CardDescription>Internal notes about this client</CardDescription>
            </CardHeader>
            <CardContent>
              {client.notes && client.notes.length > 0 ? (
                <div className="space-y-4">
                  {client.notes.map((note, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                        <span>By: {note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No notes available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Payment history and billing details</CardDescription>
            </CardHeader>
            <CardContent>
              {client.payments && client.payments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.payments.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{payment.invoice}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                payment.status === "paid"
                                  ? "bg-green-500"
                                  : payment.status === "pending"
                                    ? "bg-amber-500"
                                    : payment.status === "overdue"
                                      ? "bg-red-500"
                                      : "bg-slate-500"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No billing information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProjectDialog
        open={isProjectDialogOpen}
        onClose={handleProjectDialogClose}
        project={selectedProject}
        clientId={id}
      />

      <ClientUpdateDialog open={isClientDialogOpen} onClose={handleClientDialogClose} client={client} />
    </div>
  )
}


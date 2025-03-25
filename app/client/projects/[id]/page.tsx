"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, Calendar, ExternalLink, Filter } from "lucide-react"
import Link from "next/link"
import { getClientProjects } from "@/lib/firebase"
import { useClientAuth } from "@/hooks/use-client-auth"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

export default function ClientProjectsPage() {
  const { user } = useClientAuth()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await getClientProjects(user.uid)
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error("Error fetching client projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...projects]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) => project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "progress":
          return b.progress - a.progress
        case "startDate":
          return new Date(a.startDate) - new Date(b.startDate)
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate)
        default:
          return 0
      }
    })

    setFilteredProjects(result)
  }, [projects, statusFilter, searchQuery, sortBy])

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
          <TypewriterEffect text="Your Projects" className="text-3xl md:text-4xl font-bold mb-6" />
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
        <TypewriterEffect text="Your Projects" className="text-3xl md:text-4xl font-bold mb-2" />
        <p className="text-muted-foreground">Manage and track all your web development projects</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No projects match your filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </div>
                  <Badge
                    className={
                      project.status === "completed"
                        ? "bg-green-500"
                        : project.status === "in-progress"
                          ? "bg-blue-500"
                          : project.status === "planning"
                            ? "bg-amber-500"
                            : project.status === "review"
                              ? "bg-purple-500"
                              : project.status === "on-hold"
                                ? "bg-red-500"
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
                    <Button asChild variant="default" size="sm">
                      <Link href={`/client/projects/${project.id}`}>View Details</Link>
                    </Button>

                    {project.livePreviewUrl && (
                      <Button asChild variant="outline" size="sm">
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
      )}
    </div>
  )
}


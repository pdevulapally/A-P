"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { getProjectTimeline } from "@/lib/firebase"

export function ProjectTimeline({ projectId }) {
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true)
        const data = await getProjectTimeline(projectId)
        setTimeline(data)
      } catch (error) {
        console.error("Error fetching project timeline:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Track the progress and milestones of your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No timeline events available yet</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Track the progress and milestones of your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l">
          {timeline.map((event, index) => (
            <div key={index} className="mb-8 relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary"></div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      event.type === "milestone"
                        ? "bg-purple-500"
                        : event.type === "update"
                          ? "bg-blue-500"
                          : event.type === "completion"
                            ? "bg-green-500"
                            : "bg-slate-500"
                    }
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


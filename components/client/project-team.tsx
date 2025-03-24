"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { getProjectTeam } from "@/lib/firebase"

export function ProjectTeam({ projectId }) {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true)
        const data = await getProjectTeam(projectId)
        setTeam(data)
      } catch (error) {
        console.error("Error fetching project team:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (team.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Team</CardTitle>
          <CardDescription>Meet the team working on your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No team members assigned yet</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Team</CardTitle>
        <CardDescription>Meet the team working on your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div key={index} className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar || "/placeholder.svg?height=48&width=48"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <div className="mt-2">
                  <Badge variant="outline">{member.department}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


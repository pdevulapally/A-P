"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  status: string;
  currentPhase: string;
  phaseDescription: string;
  milestones?: Array<{
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
  team?: Array<{
    role: string;
    name: string;
  }>;
}

interface ProjectStatusCardProps {
  project: Project | null;
}

export function ProjectStatusCard({ project }: ProjectStatusCardProps) {
  if (!project) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "planning":
        return {
          color: "bg-amber-500",
          description: "We're currently planning your project, defining requirements and creating a roadmap.",
        }
      case "in-progress":
        return {
          color: "bg-blue-500",
          description: "Your project is actively being developed according to the agreed specifications.",
        }
      case "review":
        return {
          color: "bg-purple-500",
          description: "Your project is in the review phase. We're testing and making final adjustments.",
        }
      case "completed":
        return {
          color: "bg-green-500",
          description: "Your project has been completed successfully and is ready for use.",
        }
      case "on-hold":
        return {
          color: "bg-red-500",
          description: "Your project is temporarily on hold. We'll resume work as soon as possible.",
        }
      default:
        return {
          color: "bg-slate-500",
          description: "Current status of your project.",
        }
    }
  }

  const statusInfo = getStatusInfo(project.status)

  const nextMilestone = project.milestones?.find((m) => !m.completed)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
            <h3 className="font-medium">
              {project.status === "in-progress"
                ? "In Progress"
                : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Current Phase</h3>
          <div className="p-3 bg-muted rounded-md">
            <p className="font-medium">{project.currentPhase}</p>
            <p className="text-sm text-muted-foreground">{project.phaseDescription}</p>
          </div>
        </div>

        {nextMilestone && (
          <div className="space-y-2">
            <h3 className="font-medium">Next Milestone</h3>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{nextMilestone.title}</p>
              <p className="text-sm text-muted-foreground">
                Due: {new Date(nextMilestone.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-medium">Team</h3>
          <div className="flex flex-wrap gap-2">
            {project.team?.map((member, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                {member.role}: {member.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


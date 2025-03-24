import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity({ activities = [] }) {
  // Default activities if none provided
  const defaultActivities = [
    {
      id: 1,
      type: "project_created",
      user: {
        name: "Arjun Ramdhan",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AR",
      },
      content: "Created a new project: Quantum E-commerce Platform",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: "inquiry_received",
      user: {
        name: "System",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SY",
      },
      content: "New inquiry received from John Doe",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      type: "service_updated",
      user: {
        name: "Preetham Kaushik",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "PK",
      },
      content: "Updated service: Web Development",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ]

  const displayActivities = activities.length > 0 ? activities : defaultActivities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <Avatar className="h-9 w-9 mr-4">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                <p className="text-sm text-muted-foreground">{activity.content}</p>
                <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


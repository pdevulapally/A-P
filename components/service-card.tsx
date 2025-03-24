import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  features: string[]
}

export default function ServiceCard({ title, description, icon, features }: ServiceCardProps) {
  const Icon = LucideIcons[icon]

  return (
    <Card className="h-full bg-background/60 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-primary mr-2 mt-2"></div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="link" className="p-0">
          <Link href="/contact" className="group">
            Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}


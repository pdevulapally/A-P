import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Github } from "lucide-react"
import Link from "next/link"

interface TeamMemberProps {
  name: string
  role: string
  bio: string
  imageSrc: string
}

export default function TeamMember({ name, role, bio, imageSrc }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden bg-background/60 backdrop-blur-sm border-primary/20">
      <div className="relative h-64 w-full overflow-hidden">
        <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{bio}</p>
        <div className="flex space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


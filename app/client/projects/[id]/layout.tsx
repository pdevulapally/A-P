import { getProjectIds } from "@/lib/firebase"

export async function generateStaticParams() {
  try {
    const projectIds = await getProjectIds()
    return projectIds.map((id: string) => ({
      id: id
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
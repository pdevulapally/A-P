import { getClientIds } from "@/lib/firebase"

export async function generateStaticParams() {
  try {
    const clientIds = await getClientIds()
    return clientIds.map((id) => ({
      id: id
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

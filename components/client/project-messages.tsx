"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send } from "lucide-react"
import { getProjectMessages, sendProjectMessage } from "@/lib/firebase"
import { useClientAuth } from "@/hooks/use-client-auth"
import { useToast } from "@/hooks/use-toast"

export function ProjectMessages({ projectId }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const { user } = useClientAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const data = await getProjectMessages(projectId)
        setMessages(data)
      } catch (error) {
        console.error("Error fetching project messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Set up real-time listener for new messages
    const unsubscribe = listenForMessages(projectId, (newMessages) => {
      setMessages(newMessages)
    })

    return () => unsubscribe()
  }, [projectId])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    setSending(true)
    try {
      await sendProjectMessage(projectId, {
        content: newMessage,
        senderId: user.uid,
        senderName: user.displayName || "Client",
        senderRole: "client",
        timestamp: new Date().toISOString(),
      })

      setNewMessage("")
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Project Messages</CardTitle>
        <CardDescription>Communicate with your project team</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.senderRole === "client" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] ${
                    message.senderRole === "client" ? "flex-row-reverse items-end" : "items-start"
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${message.senderRole === "client" ? "ml-2" : "mr-2"}`}>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={message.senderName} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.senderRole === "client" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${
                        message.senderRole === "client" ? "text-right" : ""
                      }`}
                    >
                      {message.senderName} •{" "}
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 resize-none"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

// Mock function for real-time listener
function listenForMessages(projectId, callback) {
  // In a real implementation, this would use Firebase's onSnapshot
  // For now, we'll just return a no-op function
  return () => {}
}


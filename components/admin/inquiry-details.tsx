"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { updateInquiryStatus } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function InquiryDetails({ open, onClose, inquiry }) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  if (!inquiry) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateInquiryStatus(inquiry.id, "responded", response)
      toast({
        title: "Success",
        description: "Response sent successfully",
      })
      onClose()
    } catch (error) {
      console.error("Error sending response:", error)
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>View and respond to the inquiry from {inquiry.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">From</p>
              <p>{inquiry.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{inquiry.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Subject</p>
            <p>{inquiry.subject}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Message</p>
            <div className="mt-1 p-4 rounded-md bg-muted">
              <p className="whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Received</p>
              <p>{new Date(inquiry.createdAt).toLocaleString()}</p>
            </div>
            <Badge
              variant={
                inquiry.status === "pending" ? "secondary" : inquiry.status === "responded" ? "default" : "outline"
              }
            >
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
            </Badge>
          </div>

          {inquiry.status === "responded" && inquiry.response && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Response</p>
              <div className="mt-1 p-4 rounded-md bg-muted">
                <p className="whitespace-pre-wrap">{inquiry.response}</p>
              </div>
            </div>
          )}

          {inquiry.status === "pending" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Response"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, MoreHorizontal, Search, Trash, Eye, CheckCircle, XCircle } from "lucide-react"
import { getAllInquiries, updateInquiryStatus, deleteInquiry } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { InquiryDetails } from "@/components/admin/inquiry-details"

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [inquiryToDelete, setInquiryToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const data = await getAllInquiries()
      setInquiries(data)
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      toast({
        title: "Error",
        description: "Failed to load inquiries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry)
    setIsDetailsOpen(true)
  }

  const handleStatusChange = async (inquiry, newStatus) => {
    try {
      await updateInquiryStatus(inquiry.id, newStatus)
      setInquiries(inquiries.map((i) => (i.id === inquiry.id ? { ...i, status: newStatus } : i)))
      toast({
        title: "Success",
        description: `Inquiry marked as ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating inquiry status:", error)
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (inquiry) => {
    setInquiryToDelete(inquiry)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteInquiry(inquiryToDelete.id)
      setInquiries(inquiries.filter((i) => i.id !== inquiryToDelete.id))
      toast({
        title: "Success",
        description: "Inquiry deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to delete inquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setInquiryToDelete(null)
    }
  }

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.subject}</TableCell>
                    <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inquiry.status === "pending"
                            ? "secondary"
                            : inquiry.status === "responded"
                              ? "default"
                              : "outline"
                        }
                      >
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(inquiry)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {inquiry.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry, "responded")}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark as Responded
                            </DropdownMenuItem>
                          )}
                          {inquiry.status === "responded" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry, "pending")}>
                              <XCircle className="mr-2 h-4 w-4" /> Mark as Pending
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(inquiry)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <InquiryDetails open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} inquiry={selectedInquiry} />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the inquiry
              {inquiryToDelete && ` from ${inquiryToDelete.name}`} and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


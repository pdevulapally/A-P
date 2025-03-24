"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, X } from "lucide-react"
import { addProject, updateProject } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export function ProjectDialog({ open, onClose, project }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "e-commerce",
    status: "draft",
    client: "",
    completionDate: "",
    projectType: "",
    duration: "",
    liveUrl: "",
    features: [],
    technologies: [],
    featuredImage: "",
    gallery: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  const [newTechnology, setNewTechnology] = useState("")
  const [newGalleryImage, setNewGalleryImage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split("T")[0] : "",
      })
    } else {
      resetForm()
    }
  }, [project])

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      content: "",
      category: "e-commerce",
      status: "draft",
      client: "",
      completionDate: "",
      projectType: "",
      duration: "",
      liveUrl: "",
      features: [],
      technologies: [],
      featuredImage: "",
      gallery: [],
    })
    setNewFeature("")
    setNewTechnology("")
    setNewGalleryImage("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Auto-generate slug from title
    if (name === "title") {
      setFormData({
        ...formData,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      })
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (name, checked) => {
    setFormData({ ...formData, [name]: checked ? "published" : "draft" })
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData({ ...formData, features: updatedFeatures })
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), newTechnology.trim()],
      })
      setNewTechnology("")
    }
  }

  const removeTechnology = (index) => {
    const updatedTechnologies = [...formData.technologies]
    updatedTechnologies.splice(index, 1)
    setFormData({ ...formData, technologies: updatedTechnologies })
  }

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData({
        ...formData,
        gallery: [...(formData.gallery || []), newGalleryImage.trim()],
      })
      setNewGalleryImage("")
    }
  }

  const removeGalleryImage = (index) => {
    const updatedGallery = [...formData.gallery]
    updatedGallery.splice(index, 1)
    setFormData({ ...formData, gallery: updatedGallery })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (project) {
        await updateProject(project.id, formData)
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      } else {
        await addProject(formData)
        toast({
          title: "Success",
          description: "Project created successfully",
        })
      }
      onClose(true)
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Update the project details below."
              : "Fill in the project details below to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="min-h-[150px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e-commerce">E-commerce</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="status"
                  checked={formData.status === "published"}
                  onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                />
                <Label htmlFor="status" className="cursor-pointer">
                  {formData.status === "published" ? "Published" : "Draft"}
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input id="client" name="client" value={formData.client} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                id="completionDate"
                name="completionDate"
                type="date"
                value={formData.completionDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input
              id="liveUrl"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={newGalleryImage}
                onChange={(e) => setNewGalleryImage(e.target.value)}
                placeholder="Enter image URL"
              />
              <Button type="button" onClick={addGalleryImage} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.gallery?.map((image, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span className="text-sm truncate max-w-[200px]">{image}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex items-center space-x-2">
              <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Enter a feature" />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features?.map((feature, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span className="text-sm">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Enter a technology"
              />
              <Button type="button" onClick={addTechnology} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies?.map((tech, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span className="text-sm">{tech}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeTechnology(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{project ? "Update Project" : "Create Project"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


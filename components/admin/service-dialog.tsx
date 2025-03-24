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
import { Loader2, Plus, X } from "lucide-react"
import { addService, updateService } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export function ServiceDialog({ open, onClose, service }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "Code",
    features: [],
    process: [],
    benefits: [],
    faq: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  const [newProcessStep, setNewProcessStep] = useState({ title: "", description: "" })
  const [newBenefit, setNewBenefit] = useState({ title: "", description: "" })
  const [newFaqItem, setNewFaqItem] = useState({ question: "", answer: "" })
  const { toast } = useToast()

  useEffect(() => {
    if (service) {
      setFormData(service)
    } else {
      resetForm()
    }
  }, [service])

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      icon: "Code",
      features: [],
      process: [],
      benefits: [],
      faq: [],
    })
    setNewFeature("")
    setNewProcessStep({ title: "", description: "" })
    setNewBenefit({ title: "", description: "" })
    setNewFaqItem({ question: "", answer: "" })
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

  const addProcessStep = () => {
    if (newProcessStep.title.trim() && newProcessStep.description.trim()) {
      setFormData({
        ...formData,
        process: [...(formData.process || []), { ...newProcessStep }],
      })
      setNewProcessStep({ title: "", description: "" })
    }
  }

  const removeProcessStep = (index) => {
    const updatedProcess = [...formData.process]
    updatedProcess.splice(index, 1)
    setFormData({ ...formData, process: updatedProcess })
  }

  const addBenefit = () => {
    if (newBenefit.title.trim() && newBenefit.description.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), { ...newBenefit }],
      })
      setNewBenefit({ title: "", description: "" })
    }
  }

  const removeBenefit = (index) => {
    const updatedBenefits = [...formData.benefits]
    updatedBenefits.splice(index, 1)
    setFormData({ ...formData, benefits: updatedBenefits })
  }

  const addFaqItem = () => {
    if (newFaqItem.question.trim() && newFaqItem.answer.trim()) {
      setFormData({
        ...formData,
        faq: [...(formData.faq || []), { ...newFaqItem }],
      })
      setNewFaqItem({ question: "", answer: "" })
    }
  }

  const removeFaqItem = (index) => {
    const updatedFaq = [...formData.faq]
    updatedFaq.splice(index, 1)
    setFormData({ ...formData, faq: updatedFaq })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (service) {
        await updateService(service.id, formData)
        toast({
          title: "Success",
          description: "Service updated successfully",
        })
      } else {
        await addService(formData)
        toast({
          title: "Success",
          description: "Service created successfully",
        })
      }
      onClose(true)
    } catch (error) {
      console.error("Error saving service:", error)
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
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
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service
              ? "Update the service details below."
              : "Fill in the service details below to create a new service."}
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
            <Label htmlFor="icon">Icon</Label>
            <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Code">Code</SelectItem>
                <SelectItem value="Palette">Palette</SelectItem>
                <SelectItem value="BarChart">BarChart</SelectItem>
                <SelectItem value="Globe">Globe</SelectItem>
                <SelectItem value="ShoppingCart">ShoppingCart</SelectItem>
                <SelectItem value="Smartphone">Smartphone</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="space-y-4">
            <Label>Process Steps</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={newProcessStep.title}
                onChange={(e) => setNewProcessStep({ ...newProcessStep, title: e.target.value })}
                placeholder="Step title"
              />
              <Input
                value={newProcessStep.description}
                onChange={(e) => setNewProcessStep({ ...newProcessStep, description: e.target.value })}
                placeholder="Step description"
              />
            </div>
            <Button type="button" onClick={addProcessStep} size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Process Step
            </Button>
            <div className="space-y-2 mt-2">
              {formData.process?.map((step, index) => (
                <div key={index} className="flex items-start bg-muted rounded-md p-3">
                  <div className="flex-1">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeProcessStep(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Benefits</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={newBenefit.title}
                onChange={(e) => setNewBenefit({ ...newBenefit, title: e.target.value })}
                placeholder="Benefit title"
              />
              <Input
                value={newBenefit.description}
                onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                placeholder="Benefit description"
              />
            </div>
            <Button type="button" onClick={addBenefit} size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Benefit
            </Button>
            <div className="space-y-2 mt-2">
              {formData.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-start bg-muted rounded-md p-3">
                  <div className="flex-1">
                    <p className="font-medium">{benefit.title}</p>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeBenefit(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>FAQ Items</Label>
            <div className="grid grid-cols-1 gap-4">
              <Input
                value={newFaqItem.question}
                onChange={(e) => setNewFaqItem({ ...newFaqItem, question: e.target.value })}
                placeholder="Question"
              />
              <Textarea
                value={newFaqItem.answer}
                onChange={(e) => setNewFaqItem({ ...newFaqItem, answer: e.target.value })}
                placeholder="Answer"
              />
            </div>
            <Button type="button" onClick={addFaqItem} size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add FAQ Item
            </Button>
            <div className="space-y-2 mt-2">
              {formData.faq?.map((item, index) => (
                <div key={index} className="flex items-start bg-muted rounded-md p-3">
                  <div className="flex-1">
                    <p className="font-medium">{item.question}</p>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeFaqItem(index)}
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
                <>{service ? "Update Service" : "Create Service"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


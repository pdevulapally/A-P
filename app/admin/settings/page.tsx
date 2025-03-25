"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { SiteSettings } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadSettings = async () => {
      const settingsDoc = await getDoc(doc(db, "settings", "site"))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as SiteSettings)
      } else {
        // Initialize with default settings if none exist
        const defaultSettings: SiteSettings = {
          general: {
            siteName: "Arjun & Preetham | Web Development Studio",
            siteDescription: "Modern, futuristic web development solutions",
            contactEmail: "hello@arjunandpreetham.com",
            contactPhone: "+1 (555) 123-4567",
            social: {
              facebook: "https://facebook.com/arjunandpreetham",
              twitter: "https://twitter.com/arjunandpreetham",
              instagram: "https://instagram.com/arjunandpreetham",
              linkedin: "https://linkedin.com/company/arjunandpreetham"
            }
          },
          appearance: {
            darkMode: true,
            animations: true,
            primaryColor: "#8B5CF6",
            secondaryColor: "#EC4899"
          },
          notifications: {
            emailNotifications: true,
            newInquiries: true,
            projectUpdates: true,
            clientMessages: true
          }
        }
        await setDoc(doc(db, "settings", "site"), defaultSettings)
        setSettings(defaultSettings)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Get all form values
      const formData = new FormData(e.target as HTMLFormElement)
      const updatedSettings: SiteSettings = {
        general: {
          siteName: formData.get("siteName") as string,
          siteDescription: formData.get("siteDescription") as string,
          contactEmail: formData.get("contactEmail") as string,
          contactPhone: formData.get("contactPhone") as string,
          social: {
            facebook: formData.get("facebook") as string,
            twitter: formData.get("twitter") as string,
            instagram: formData.get("instagram") as string,
            linkedin: formData.get("linkedin") as string
          }
        },
        appearance: {
          darkMode: formData.get("darkMode") === "on",
          animations: formData.get("animations") === "on",
          primaryColor: formData.get("primaryColor") as string,
          secondaryColor: formData.get("secondaryColor") as string
        },
        notifications: {
          emailNotifications: formData.get("emailNotifications") === "on",
          newInquiries: formData.get("newInquiries") === "on",
          projectUpdates: formData.get("projectUpdates") === "on",
          clientMessages: formData.get("clientMessages") === "on"
        }
      }

      // Save to Firestore
      await setDoc(doc(db, "settings", "site"), updatedSettings)
      setSettings(updatedSettings)

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (!settings) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your website's general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  name="siteName"
                  defaultValue={settings.general.siteName} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  defaultValue={settings.general.siteDescription}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail"
                  type="email"
                  defaultValue={settings.general.contactEmail} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone" 
                  name="contactPhone"
                  defaultValue={settings.general.contactPhone} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Manage your social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input 
                  id="facebook" 
                  name="facebook"
                  defaultValue={settings.general.social.facebook} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input 
                  id="twitter" 
                  name="twitter"
                  defaultValue={settings.general.social.twitter} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram" 
                  name="instagram"
                  defaultValue={settings.general.social.instagram} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin" 
                  name="linkedin"
                  defaultValue={settings.general.social.linkedin} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
                </div>
                <Switch id="darkMode" name="darkMode" defaultChecked={settings.appearance.darkMode} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable animations throughout the site</p>
                </div>
                <Switch id="animations" name="animations" defaultChecked={settings.appearance.animations} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="primaryColor" 
                    name="primaryColor"
                    type="color"
                    defaultValue={settings.appearance.primaryColor} 
                  />
                  <div className="h-10 w-10 rounded-md bg-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="secondaryColor" 
                    name="secondaryColor"
                    type="color"
                    defaultValue={settings.appearance.secondaryColor} 
                  />
                  <div className="h-10 w-10 rounded-md bg-[#EC4899]" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch id="emailNotifications" name="emailNotifications" defaultChecked={settings.notifications.emailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newInquiries">New Inquiries</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a new inquiry is received</p>
                </div>
                <Switch id="newInquiries" name="newInquiries" defaultChecked={settings.notifications.newInquiries} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="projectUpdates">Project Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about project status changes</p>
                </div>
                <Switch id="projectUpdates" name="projectUpdates" defaultChecked={settings.notifications.projectUpdates} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="clientMessages">Client Messages</Label>
                  <p className="text-sm text-muted-foreground">Get notified when clients send messages</p>
                </div>
                <Switch id="clientMessages" name="clientMessages" defaultChecked={settings.notifications.clientMessages} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}


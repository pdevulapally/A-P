import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
  Timestamp,
  enableNetwork,
  disableNetwork,
  setDoc,
} from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { getApps, initializeApp } from "firebase/app"
import { getAuth, Auth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { TeamMember } from "@/lib/types"

// Add this function at the top of the file
function handleFirestoreError(error: any, fallbackValue: any = null) {
  console.error("Firestore operation error:", error)

  // Check for specific error types
  if (error.code === "permission-denied") {
    console.warn("Permission denied. Check your Firestore rules.")
  } else if (error.code === "unavailable") {
    console.warn("Firestore service is currently unavailable. Retry later.")
  } else if (error.code === "unauthenticated") {
    console.warn("Authentication required for this operation.")
  }

  return fallbackValue
}

// Initialize Firebase only if it hasn't been initialized
let app = getApps().length === 0 
  ? initializeApp({
      apiKey: "AIzaSyAObe4TGNbvy63mkaK1F75703CWaBugATY",
      authDomain: "arjun-and-preetham.firebaseapp.com",
      projectId: "arjun-and-preetham",
      storageBucket: "arjun-and-preetham.firebasestorage.app",
      messagingSenderId: "234923795312",
      appId: "1:234923795312:web:922ccd131c6aa542d6a5b5",
      measurementId: "G-VPD056V2Z0",
    })
  : getApps()[0]

export const db = getFirestore(app)
export const auth = getAuth(app)

let isInitialized = false

// Function to enable/disable network for testing
export async function toggleFirebaseNetwork(enable = true) {
  if (!db) return false

  try {
    if (enable) {
      await enableNetwork(db)
    } else {
      await disableNetwork(db)
    }
    return true
  } catch (error) {
    console.error(`Error ${enable ? "enabling" : "disabling"} network:`, error)
    return false
  }
}

// Helper function to check if we can access Firestore
export function isFirebaseAvailable() {
  return isInitialized && db && typeof window !== "undefined" && navigator.onLine
}

// Contact Form
export async function submitContactForm(formData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      ...formData,
      status: "pending",
      createdAt: serverTimestamp(),
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    throw error
  }
}

// Payment Processing
export async function processPayment(paymentData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = await addDoc(collection(db, "payments"), {
      ...paymentData,
      status: "completed", // In a real app, this would be set after payment processing
      createdAt: serverTimestamp(),
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error processing payment:", error)
    throw error
  }
}

// Projects
export async function getAllProjects() {
  if (!db) return handleFirestoreError(new Error("Firestore not initialized"), [])

  try {
    const projectsRef = collection(db, "projects")
    const q = query(projectsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    return handleFirestoreError(error, [])
  }
}

export async function getProjectBySlug(slug: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const projectsRef = collection(db, "projects")
    const q = query(projectsRef, where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      completionDate: doc.data().completionDate?.toDate().toISOString() || null,
    }
  } catch (error) {
    console.error("Error getting project by slug:", error)
    throw error
  }
}

export async function addProject(projectData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    // Convert date strings to Firestore timestamps
    const dataToSave = {
      ...projectData,
      createdAt: serverTimestamp(),
      completionDate: projectData.completionDate ? Timestamp.fromDate(new Date(projectData.completionDate)) : null,
    }

    const docRef = await addDoc(collection(db, "projects"), dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

export async function updateProject(id: string, projectData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    // Convert date strings to Firestore timestamps
    const dataToSave = {
      ...projectData,
      updatedAt: serverTimestamp(),
      completionDate: projectData.completionDate ? Timestamp.fromDate(new Date(projectData.completionDate)) : null,
    }

    await updateDoc(doc(db, "projects", id), dataToSave)
    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export async function deleteProject(id: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await deleteDoc(doc(db, "projects", id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Services
export async function getAllServices() {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const servicesRef = collection(db, "services")
    const serviceQuery = query(servicesRef, orderBy("title"))
    const serviceQuerySnapshot = await getDocs(serviceQuery)

    return serviceQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting services:", error)
    throw error
  }
}

export async function getServiceBySlug(slug: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const servicesRef = collection(db, "services")
    const q = query(servicesRef, where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    }
  } catch (error) {
    console.error("Error getting service by slug:", error)
    throw error
  }
}

export async function addService(serviceData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = await addDoc(collection(db, "services"), {
      ...serviceData,
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding service:", error)
    throw error
  }
}

export async function updateService(id: string, serviceData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "services", id), {
      ...serviceData,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating service:", error)
    throw error
  }
}

export async function deleteService(id: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await deleteDoc(doc(db, "services", id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    throw error
  }
}

// Inquiries
export async function getAllInquiries() {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const inquiriesRef = collection(db, "inquiries")
    const q = query(inquiriesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
      subject: doc.data().subject || "",
      status: doc.data().status || "pending",
      message: doc.data().message || "",
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error getting inquiries:", error)
    throw error
  }
}

export async function updateInquiryStatus(id: string, status: string, response: any = null) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const updateData: { status: any; updatedAt: any; response?: any } = {
      status,
      updatedAt: serverTimestamp(),
    }

    if (response) {
      updateData.response = response
    }

    await updateDoc(doc(db, "inquiries", id), updateData)
    return { success: true }
  } catch (error) {
    console.error("Error updating inquiry status:", error)
    throw error
  }
}

export async function deleteInquiry(id: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await deleteDoc(doc(db, "inquiries", id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting inquiry:", error)
    throw error
  }
}

// Dashboard Stats
export async function getDashboardStats() {
  if (!db) throw new Error("Firestore not initialized")

  try {
    // Get projects count
    const projectsRef = collection(db, "projects")
    const projectsSnapshot = await getDocs(projectsRef)
    const totalProjects = projectsSnapshot.size

    // Get active clients (unique clients from projects)
    const clients = new Set()
    projectsSnapshot.docs.forEach((doc) => {
      const client = doc.data().client
      if (client) clients.add(client)
    })
    const activeClients = clients.size

    // Get pending inquiries
    const inquiriesRef = collection(db, "inquiries")
    const pendingQuery = query(inquiriesRef, where("status", "==", "pending"))
    const pendingSnapshot = await getDocs(pendingQuery)
    const pendingInquiries = pendingSnapshot.size

    // Get payments/revenue
    const paymentsRef = collection(db, "payments")
    const paymentsSnapshot = await getDocs(paymentsRef)
    let revenue = 0
    paymentsSnapshot.docs.forEach((doc) => {
      revenue += doc.data().amount || 0
    })

    // Mock data for charts
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    const revenueData = months.map((_, index) => {
      // Generate some realistic looking data
      const base = 5000 + Math.random() * 10000
      // Make current month and recent months have higher values
      const recency = Math.max(0, 12 - Math.abs(currentMonth - index)) / 12
      return Math.round(base * (1 + recency))
    })

    const projectsData = months.map((_, index) => {
      // Generate some realistic looking data
      const base = 1 + Math.random() * 3
      // Make current month and recent months have higher values
      const recency = Math.max(0, 12 - Math.abs(currentMonth - index)) / 12
      return Math.round(base * (1 + recency))
    })

    // Recent activities (mock data)
    const recentActivities = [
      {
        id: 1,
        type: "project_created",
        user: {
          name: "Arjun Ramdhan",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "AR",
        },
        content: "Created a new project: Quantum E-commerce Platform",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: "inquiry_received",
        user: {
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "SY",
        },
        content: "New inquiry received from John Doe",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        type: "service_updated",
        user: {
          name: "Preetham Kaushik",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "PK",
        },
        content: "Updated service: Web Development",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    return {
      totalProjects,
      newProjects: Math.round(totalProjects * 0.2), // Assume 20% are new
      activeClients,
      newClients: Math.round(activeClients * 0.15), // Assume 15% are new
      revenue,
      revenueIncrease: 12, // Percentage increase
      pendingInquiries,
      inquiryIncrease: 8, // Percentage increase
      overviewData: {
        revenue: {
          labels: months,
          datasets: [
            {
              label: "Revenue",
              data: revenueData,
              backgroundColor: "rgba(139, 92, 246, 0.5)",
              borderColor: "rgb(139, 92, 246)",
              borderWidth: 2,
            },
          ],
        },
        projects: {
          labels: months,
          datasets: [
            {
              label: "Projects",
              data: projectsData,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgb(59, 130, 246)",
              borderWidth: 2,
            },
          ],
        },
      },
      recentActivities,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    throw error
  }
}

// Hero Content
export async function getHeroContent() {
  // Default content to return if Firebase is offline or there's an error
  const defaultContent = {
    title: "Building the Future of the Web",
    subtitle:
      "We create immersive, cutting-edge web experiences that blend creativity, technology, and business strategy.",
    primaryButtonText: "Start Your Project",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View Our Work",
    secondaryButtonLink: "/portfolio",
  }

  // If Firestore isn't initialized, return default content instead of throwing an error
  if (!db) {
    console.warn("Firestore not initialized, using default hero content")
    return defaultContent
  }

  try {
    const contentRef = doc(db, "content", "hero")
    const docSnap = await getDoc(contentRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      // Return default content if not found
      return defaultContent
    }
  } catch (error) {
    return handleFirestoreError(error, defaultContent)
  }
}

// Client Authentication and Management
export async function createClientProfile(uid: string, clientData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await setDoc(doc(db, "clients", uid), {
      ...clientData,
      createdAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error creating client profile:", error)
    throw error
  }
}

export async function addClient(clientData: any) {
  if (!db) throw new Error("Firestore not initialized")
  
  try {
    // Add the client to the clients collection
    const docRef = await addDoc(collection(db, "clients"), {
      ...clientData,
      createdAt: serverTimestamp(),
    })
  
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding client:", error)
    throw error
  }
}

export async function getAllClients() {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const clientsRef = collection(db, "clients")
    const q = query(clientsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const clients = []

    for (const doc of querySnapshot.docs) {
      const clientData: any = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
        projectCount: 0,
      }

      // Get project count for each client
      const projectsRef = collection(db, "projects")
      const projectQuery = query(projectsRef, where("clientId", "==", doc.id))
      const projectSnapshot = await getDocs(projectQuery)

      clientData.projectCount = projectSnapshot.size

      clients.push(clientData)
    }

    return clients
  } catch (error) {
    console.error("Error getting clients:", error)
    throw error
  }
}

export async function getClientById(id: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = doc(db, "clients", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting client:", error)
    throw error
  }
}

export async function updateClient(id: string, clientData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "clients", id), {
      ...clientData,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating client:", error)
    throw error
  }
}

export async function deleteClient(id: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await deleteDoc(doc(db, "clients", id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting client:", error)
    throw error
  }
}

export async function addClientNote(clientId: string, noteData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const clientRef = doc(db, "clients", clientId)
    const clientSnap = await getDoc(clientRef)

    if (!clientSnap.exists()) {
      throw new Error("Client not found")
    }

    const notes = clientSnap.data().notes || []

    await updateDoc(clientRef, {
      notes: [...notes, noteData],
      updatedAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error adding client note:", error)
    throw error
  }
}

// Project Management for Clients
export async function getClientProjects(clientId: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const projectsRef = collection(db, "projects")
    const q = query(projectsRef, where("clientId", "==", clientId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate().toISOString() || null,
      dueDate: doc.data().dueDate?.toDate().toISOString() || null,
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error getting client projects:", error)
    throw error
  }
}

export async function getClientProject(projectId: string, clientId: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = doc(db, "projects", projectId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data() as any;
    const projectData = {
      id: docSnap.id,
      ...data,
      startDate: data.startDate?.toDate().toISOString() || null,
      dueDate: data.dueDate?.toDate().toISOString() || null,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    }

    // Verify this project belongs to the client
    if (projectData.clientId !== clientId) {
      return null
    }

    return projectData
  } catch (error) {
    console.error("Error getting project:", error)
    throw error
  }
}

export async function getProjectTimeline(projectId: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const timelineRef = collection(db, "projects", projectId, "timeline")
    const q = query(timelineRef, orderBy("date", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error getting project timeline:", error)
    throw error
  }
}

export async function getProjectMessages(projectId: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const messagesRef = collection(db, "projects", projectId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error getting project messages:", error)
    throw error
  }
}

export async function sendProjectMessage(projectId: string, messageData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const messagesRef = collection(db, "projects", projectId, "messages")
    await addDoc(messagesRef, {
      ...messageData,
      timestamp: serverTimestamp(),
    })

    // Also update the project's lastActivity field
    await updateDoc(doc(db, "projects", projectId), {
      lastActivity: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending project message:", error)
    throw error
  }
}

export async function getProjectTeam(projectId: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const projectRef = doc(db, "projects", projectId)
    const projectSnap = await getDoc(projectRef)

    if (!projectSnap.exists()) {
      return []
    }

    return projectSnap.data().team || []
  } catch (error) {
    console.error("Error getting project team:", error)
    throw error
  }
}

// Update project status (for admin)
export async function updateProjectStatus(projectId: string, statusData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const projectRef = doc(db, "projects", projectId)

    // Update the project status
    await updateDoc(projectRef, {
      status: statusData.status,
      progress: statusData.progress,
      currentPhase: statusData.currentPhase,
      phaseDescription: statusData.phaseDescription,
      updatedAt: serverTimestamp(),
    })

    // Add a timeline entry
    const timelineRef = collection(db, "projects", projectId, "timeline")
    await addDoc(timelineRef, {
      title: `Status updated to ${statusData.status}`,
      description: statusData.phaseDescription,
      type: "update",
      date: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating project status:", error)
    throw error
  }
}

export async function getClientIds() {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const querySnapshot = await getDocs(collection(db, "clients"))
    return querySnapshot.docs.map(doc => doc.id)
  } catch (error) {
    console.error("Error getting client IDs:", error)
    return []
  }
}

interface ProjectWithId {
  id: string;
}

export async function getProjectIds() {
  const projects = await getAllProjects()
  return projects.map((project: ProjectWithId) => project.id)
}

export async function adminLogin(email: string, password: string) {
  if (!auth) throw new Error("Auth not initialized")
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const token = await userCredential.user.getIdTokenResult()
    
    if (!token.claims.admin) {
      await auth.signOut()
      throw new Error("Not authorized as admin")
    }
    
    return userCredential
  } catch (error) {
    console.error("Admin login error:", error)
    throw error
  }
}

// Settings Management
export async function getSettings() {
  if (!db) return handleFirestoreError(new Error("Firestore not initialized"))

  try {
    const settingsDoc = await getDoc(doc(db, "settings", "site"))
    return settingsDoc.exists() ? settingsDoc.data() : null
  } catch (error) {
    return handleFirestoreError(error)
  }
}

export async function updateSettings(settings: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await setDoc(doc(db, "settings", "site"), settings)
    return { success: true }
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
}

export { signOut }

// Team Members
export async function addTeamMember(memberData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = await addDoc(collection(db, "team"), {
      ...memberData,
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding team member:", error)
    throw error
  }
}

export async function updateTeamMember(id: string, memberData: any) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "team", id), {
      ...memberData,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating team member:", error)
    throw error
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const teamRef = collection(db, "team")
    const q = query(teamRef, orderBy("name"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      role: doc.data().role,
      department: doc.data().department,
      email: doc.data().email,
    }))
  } catch (error) {
    console.error("Error getting team members:", error)
    throw error
  }
}

export async function deleteTeamMember(id: string) {
  if (!db) throw new Error("Firestore not initialized")

  try {
    await deleteDoc(doc(db, "team", id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting team member:", error)
    throw error
  }
}


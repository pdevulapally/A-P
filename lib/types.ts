export interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
  appearance: {
    darkMode: boolean;
    animations: boolean;
    primaryColor: string;
    secondaryColor: string;
  };
  notifications: {
    emailNotifications: boolean;
    newInquiries: boolean;
    projectUpdates: boolean;
    clientMessages: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
} 
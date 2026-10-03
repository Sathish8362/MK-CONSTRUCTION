export type ProjectType = 
  | 'Residential' 
  | 'Commercial' 
  | 'Renovation' 
  | 'Interiors'
  | 'Turnkey Construction';

export type EnquiryStatus = 'New' | 'Contacted' | 'Quote sent' | 'Won' | 'Lost';

export interface ProjectPhoto {
  id: string;
  project_id: string;
  storage_path: string;
  public_url: string;
  caption?: string;
  is_cover: boolean;
  photo_tag: 'standard' | 'before' | 'after';
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  project_type: ProjectType | string;
  area_sqft: number;
  duration: string;
  location: string;
  budget_range?: string;
  description: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
  photos?: ProjectPhoto[];
}

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  location: string;
  project_type: string;
  budget: string;
  message?: string;
  consent: boolean;
  status: EnquiryStatus;
  owner_notes?: string;
  ip_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  icon_name: string;
  short_desc: string;
  full_desc: string;
  features: string[];
  display_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role?: string;
  location: string;
  rating: number;
  comment: string;
  project_title?: string;
  photo_url?: string;
  display_order: number;
  is_featured: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_published: boolean;
}

export interface SiteSettings {
  id?: string;
  company_name: string;
  location: string;
  established_year: number;
  owner_mobile: string;
  owner_email: string;
  address: string;
  working_hours: string;
  hero_title: string;
  hero_subtitle: string;
  stats_projects_count: string;
  stats_years_experience: string;
  stats_happy_clients: string;
  stats_warranty_years: string;
  whatsapp_enquiry_number: string;
  notification_channels: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
  };
  license_number: string;
  insurance_status: string;
  safety_standard: string;
  updated_at?: string;
}

export interface NotificationLog {
  id: string;
  enquiry_id?: string;
  channel: 'whatsapp' | 'sms' | 'email';
  recipient: string;
  status: 'success' | 'failed';
  error_message?: string;
  payload?: any;
  created_at: string;
}

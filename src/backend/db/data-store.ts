import fs from 'fs';
import path from 'path';
import { Project, ServiceItem, Testimonial, FAQItem, SiteSettings, Enquiry, ProjectPhoto } from '@/types';
import { initialProjects, initialServices, initialTestimonials, initialFAQs, initialSiteSettings, initialEnquiries } from './mock-data';
import { isSupabaseConfigured, createAdminClient } from '../supabase/admin';

const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface AppStore {
  projects: Project[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  settings: SiteSettings;
  enquiries: Enquiry[];
}

function loadStoreFromDisk(): AppStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        projects: Array.isArray(parsed.projects) ? parsed.projects : [...initialProjects],
        services: Array.isArray(parsed.services) ? parsed.services : [...initialServices],
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [...initialTestimonials],
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [...initialFAQs],
        settings: { ...initialSiteSettings, ...(parsed.settings || {}) },
        enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [...initialEnquiries],
      };
    }
  } catch (err) {
    console.warn("Could not parse store from disk, falling back to initial data:", err);
  }

  const initialStore: AppStore = {
    projects: [...initialProjects],
    services: [...initialServices],
    testimonials: [...initialTestimonials],
    faqs: [...initialFAQs],
    settings: { ...initialSiteSettings },
    enquiries: [...initialEnquiries],
  };

  saveStoreToDisk(initialStore);
  return initialStore;
}

function saveStoreToDisk(store: AppStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write store to disk:", err);
  }
}

function getStore(): AppStore {
  // Always load from disk or cache on globalThis
  const g = globalThis as unknown as { __MK_STORE__?: AppStore };
  
  // Re-read from disk if store file exists to ensure cross-process consistency
  try {
    if (fs.existsSync(STORE_FILE)) {
      const diskStore = loadStoreFromDisk();
      g.__MK_STORE__ = diskStore;
      return diskStore;
    }
  } catch (e) {
    // ignore
  }

  if (!g.__MK_STORE__) {
    g.__MK_STORE__ = loadStoreFromDisk();
  }
  return g.__MK_STORE__;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) {
        return {
          ...store.settings,
          ...data,
        };
      }
    } catch (e) {
      console.warn("Supabase fetch failed for site_settings, using fallback:", e);
    }
  }
  return store.settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = getStore();
  store.settings = { ...store.settings, ...settings, updated_at: new Date().toISOString() };
  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('site_settings').upsert({ id: 'main', ...store.settings });
    } catch (e) {
      console.warn("Supabase update failed for site_settings:", e);
    }
  }
  return store.settings;
}

export async function getProjects(includeUnpublished = false): Promise<Project[]> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      let query = supabase.from('projects').select('*, photos:project_photos(*)').order('display_order', { ascending: true });
      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as Project[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed for projects, using fallback:", e);
    }
  }
  return includeUnpublished ? store.projects : store.projects.filter(p => p.is_published);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*, photos:project_photos(*)')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Project;
      }
    } catch (e) {
      console.warn("Supabase fetch failed for project by slug, using fallback:", e);
    }
  }
  return store.projects.find(p => p.slug === slug) || null;
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const store = getStore();
  const isNew = !project.id;
  const id = isNew ? `proj-${Date.now()}` : project.id!;
  const newProject: Project = {
    id,
    title: project.title || "Untitled Project",
    slug: project.slug || (project.title ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `proj-${Date.now()}`),
    project_type: project.project_type || "Residential",
    area_sqft: Number(project.area_sqft) || 2000,
    duration: project.duration || "6 Months",
    location: project.location || "Thirubuvanam, Tamil Nadu",
    budget_range: project.budget_range || "Contact for Quote",
    description: project.description || "",
    is_featured: project.is_featured ?? true,
    is_published: project.is_published ?? true,
    display_order: project.display_order ?? (store.projects.length + 1),
    created_at: project.created_at || new Date().toISOString(),
    photos: project.photos || [],
  };

  if (isNew) {
    store.projects.unshift(newProject);
  } else {
    store.projects = store.projects.map(p => p.id === id ? newProject : p);
  }

  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { photos, ...projectData } = newProject;
      await supabase.from('projects').upsert(projectData);
    } catch (e) {
      console.warn("Supabase upsert failed for project:", e);
    }
  }

  return newProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = getStore();
  store.projects = store.projects.filter(p => p.id !== id);
  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase delete failed for project:", e);
    }
  }
  return true;
}

export async function getServices(): Promise<ServiceItem[]> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
      if (!error && data) return data as ServiceItem[];
    } catch (e) {
      console.warn("Supabase fetch failed for services:", e);
    }
  }
  return store.services;
}

export async function updateServices(services: ServiceItem[]): Promise<ServiceItem[]> {
  const store = getStore();
  store.services = [...services];
  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('services').upsert(services);
    } catch (e) {
      console.warn("Supabase upsert failed for services:", e);
    }
  }
  return store.services;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('testimonials').select('*').order('display_order', { ascending: true });
      if (!error && data) return data as Testimonial[];
    } catch (e) {
      console.warn("Supabase fetch failed for testimonials:", e);
    }
  }
  return store.testimonials;
}

export async function updateTestimonials(testimonials: Testimonial[]): Promise<Testimonial[]> {
  const store = getStore();
  store.testimonials = [...testimonials];
  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('testimonials').upsert(testimonials);
    } catch (e) {
      console.warn("Supabase upsert failed for testimonials:", e);
    }
  }
  return store.testimonials;
}

export async function getFAQs(): Promise<FAQItem[]> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
      if (!error && data) return data as FAQItem[];
    } catch (e) {
      console.warn("Supabase fetch failed for faqs:", e);
    }
  }
  return store.faqs;
}

export async function updateFAQs(faqs: FAQItem[]): Promise<FAQItem[]> {
  const store = getStore();
  store.faqs = [...faqs];
  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('faqs').upsert(faqs);
    } catch (e) {
      console.warn("Supabase upsert failed for faqs:", e);
    }
  }
  return store.faqs;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const store = getStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Enquiry[];
    } catch (e) {
      console.warn("Supabase fetch failed for enquiries:", e);
    }
  }
  return store.enquiries;
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>): Promise<Enquiry> {
  const store = getStore();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.enquiries.unshift(newEnquiry);
  saveStoreToDisk(store);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('enquiries').insert([newEnquiry]).select().single();
      if (!error && data) {
        return data as Enquiry;
      }
    } catch (e) {
      console.warn("Supabase insert failed for enquiry, retained in persistent store:", e);
    }
  }

  return newEnquiry;
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status'], owner_notes?: string): Promise<Enquiry | null> {
  const store = getStore();
  let updated: Enquiry | null = null;
  store.enquiries = store.enquiries.map(enq => {
    if (enq.id === id) {
      updated = {
        ...enq,
        status,
        ...(owner_notes !== undefined ? { owner_notes } : {}),
        updated_at: new Date().toISOString(),
      };
      return updated;
    }
    return enq;
  });

  if (updated) {
    saveStoreToDisk(store);
  }

  if (isSupabaseConfigured() && updated) {
    try {
      const supabase = createAdminClient();
      await supabase.from('enquiries').update({
        status,
        ...(owner_notes !== undefined ? { owner_notes } : {}),
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    } catch (e) {
      console.warn("Supabase update enquiry status failed:", e);
    }
  }

  return updated;
}

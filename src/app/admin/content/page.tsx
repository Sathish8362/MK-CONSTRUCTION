import React from 'react';
import { 
  getSiteSettings, 
  getServices, 
  getTestimonials, 
  getFAQs, 
  getEnquiries 
} from '@/lib/data-store';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditorClient } from './ContentEditorClient';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const [settings, services, testimonials, faqs, enquiries] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getTestimonials(),
    getFAQs(),
    getEnquiries(),
  ]);

  const newCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <AdminLayout newEnquiriesCount={newCount}>
      <ContentEditorClient
        initialSettings={settings}
        initialServices={services}
        initialTestimonials={testimonials}
        initialFaqs={faqs}
      />
    </AdminLayout>
  );
}

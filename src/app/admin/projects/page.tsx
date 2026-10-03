import React from 'react';
import { getProjects, getEnquiries } from '@/lib/data-store';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProjectsManagerClient } from './ProjectsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const [projects, enquiries] = await Promise.all([
    getProjects(true), // include unpublished
    getEnquiries(),
  ]);

  const newCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <AdminLayout newEnquiriesCount={newCount}>
      <ProjectsManagerClient initialProjects={projects} />
    </AdminLayout>
  );
}

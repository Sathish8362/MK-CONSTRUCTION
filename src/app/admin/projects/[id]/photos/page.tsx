import React from 'react';
import { notFound } from 'next/navigation';
import { getProjects, getEnquiries } from '@/lib/data-store';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PhotoUploadClient } from './PhotoUploadClient';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProjectPhotosPage({ params }: Props) {
  const { id } = await params;
  const [projects, enquiries] = await Promise.all([
    getProjects(true),
    getEnquiries(),
  ]);

  const project = projects.find(p => p.id === id);
  if (!project) {
    notFound();
  }

  const newCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <AdminLayout newEnquiriesCount={newCount}>
      <PhotoUploadClient project={project} />
    </AdminLayout>
  );
}

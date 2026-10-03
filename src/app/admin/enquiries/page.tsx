import React from 'react';
import { getEnquiries } from '@/lib/data-store';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EnquiriesManagerClient } from './EnquiriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function EnquiriesManagerPage() {
  const enquiries = await getEnquiries();
  const newCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <AdminLayout newEnquiriesCount={newCount}>
      <EnquiriesManagerClient initialEnquiries={enquiries} />
    </AdminLayout>
  );
}

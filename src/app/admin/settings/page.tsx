import React from 'react';
import { getSiteSettings, getEnquiries } from '@/lib/data-store';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const [settings, enquiries] = await Promise.all([
    getSiteSettings(),
    getEnquiries(),
  ]);

  const newCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <AdminLayout newEnquiriesCount={newCount}>
      <SettingsClient initialSettings={settings} />
    </AdminLayout>
  );
}

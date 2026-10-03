import React from 'react';
import Link from 'next/link';
import { getEnquiries, getProjects, getSiteSettings } from '@/lib/data-store';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  MessageSquare, 
  FolderKanban, 
  Image as ImageIcon, 
  TrendingUp, 
  Phone, 
  ArrowRight, 
  PlusCircle, 
  AlertCircle 
} from 'lucide-react';
import { DashboardEnquiriesTable } from './DashboardEnquiriesTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [enquiries, projects, settings] = await Promise.all([
    getEnquiries(),
    getProjects(true),
    getSiteSettings(),
  ]);

  const newEnquiries = enquiries.filter(e => e.status === 'New');
  const totalPhotosCount = projects.reduce((acc, p) => acc + (p.photos?.length || 0), 0);

  const stats = [
    {
      title: 'New Enquiries',
      value: newEnquiries.length,
      subtext: `${enquiries.length} total received`,
      icon: MessageSquare,
      alert: newEnquiries.length > 0,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Portfolio Projects',
      value: projects.length,
      subtext: `${projects.filter(p => p.is_published).length} published online`,
      icon: FolderKanban,
      alert: false,
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Photos Uploaded',
      value: totalPhotosCount,
      subtext: 'Auto-compressed WebP',
      icon: ImageIcon,
      alert: false,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      title: 'Conversion Rate',
      value: `${Math.round((enquiries.filter(e => e.status === 'Won').length / (enquiries.length || 1)) * 100)}%`,
      subtext: `${enquiries.filter(e => e.status === 'Won').length} projects won`,
      icon: TrendingUp,
      alert: false,
      color: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <AdminLayout newEnquiriesCount={newEnquiries.length}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Owner Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            MK Construction • Thirubuvanam, Tamil Nadu | Welcome, Sathish
          </p>
        </div>

        {/* Quick Actions Button Group */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors min-tap-target shadow-md shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Project</span>
          </Link>

          <Link
            href="/admin/enquiries"
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors min-tap-target shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Manage All Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Owner Notification Alert Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Phone className="w-5 h-5 text-amber-700" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">
              Direct Notification Dispatch Active
            </span>
            <span className="text-slate-600">
              New customer quotes are routed directly to WhatsApp <strong className="text-amber-800">{settings.owner_mobile}</strong> and email <strong className="text-amber-800">{settings.owner_email}</strong>.
            </span>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="text-xs font-bold text-amber-800 hover:underline uppercase tracking-wider shrink-0"
        >
          Change Numbers &rarr;
        </Link>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-6 rounded-2xl bg-white border ${
                item.alert ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              } flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.title}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-950 tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.subtext}
                </div>
              </div>

              {item.alert && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Requires Attention</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight">
              Recent Customer Quote Requests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tap to call, chat on WhatsApp, or update lead status
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <DashboardEnquiriesTable initialEnquiries={enquiries.slice(0, 5)} />
      </div>

    </AdminLayout>
  );
}

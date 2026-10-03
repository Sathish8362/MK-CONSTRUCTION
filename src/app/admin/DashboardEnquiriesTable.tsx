'use client';

import React, { useState, useEffect } from 'react';
import { Enquiry, EnquiryStatus } from '@/types';
import { Phone, MessageSquare, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  initialEnquiries: Enquiry[];
}

export function DashboardEnquiriesTable({ initialEnquiries }: Props) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const statuses: EnquiryStatus[] = ['New', 'Contacted', 'Quote sent', 'Won', 'Lost'];

  const fetchLatestEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.enquiries)) {
          setEnquiries(data.enquiries.slice(0, 5));
          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (e) {
      // silent
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchLatestEnquiries();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  useEffect(() => {
    // Live polling every 4 seconds so any new quote shows immediately
    const timer = setInterval(fetchLatestEnquiries, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Contacted':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Quote sent':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Won':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Lost':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-3">
      {/* Live sync indicator & manual refresh */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-800">Live Quote Sync Active</span>
          <span className="hidden sm:inline text-slate-400">• Checked: {lastRefreshed}</span>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all shadow-2xs min-tap-target cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Checking...' : 'Refresh'}</span>
        </button>
      </div>

      {enquiries.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          No customer enquiries received yet. As soon as a client submits a quote on the public website, it will show up here automatically!
        </div>
      ) : (
        <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
            <th className="pb-3 pr-4">Client Name</th>
            <th className="pb-3 px-4">Contact Actions</th>
            <th className="pb-3 px-4">Project & Location</th>
            <th className="pb-3 px-4">Budget</th>
            <th className="pb-3 px-4">Status Lead</th>
            <th className="pb-3 pl-4">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {enquiries.map((enq) => (
            <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
              
              {/* Name */}
              <td className="py-4 pr-4">
                <span className="font-bold text-slate-900 text-sm block">{enq.name}</span>
                <span className="text-[11px] text-slate-400">ID: {enq.id}</span>
              </td>

              {/* Direct Tap Actions */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:+91${enq.mobile}`}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-slate-950 border border-amber-300 transition-colors min-tap-target flex items-center justify-center shadow-xs"
                    title={`Call +91 ${enq.mobile}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/91${enq.mobile}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20MK%20Construction%20regarding%20your%20quote%20request.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 transition-colors min-tap-target flex items-center justify-center shadow-xs"
                    title="Open WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <span className="font-mono text-slate-700 font-semibold ml-1">+91 {enq.mobile}</span>
                </div>
              </td>

              {/* Project & Location */}
              <td className="py-4 px-4">
                <span className="font-semibold text-slate-900 block">{enq.project_type}</span>
                <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{enq.location}</span>
                </span>
              </td>

              {/* Budget */}
              <td className="py-4 px-4 font-bold text-amber-800">
                {enq.budget}
              </td>

              {/* Status Lead Dropdown */}
              <td className="py-4 px-4">
                <select
                  value={enq.status}
                  disabled={updatingId === enq.id}
                  onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${getStatusBadge(enq.status)}`}
                >
                  {statuses.map(st => (
                    <option key={st} value={st} className="bg-white text-slate-900">
                      {st}
                    </option>
                  ))}
                </select>
              </td>

              {/* Time */}
              <td className="py-4 pl-4 text-slate-500 whitespace-nowrap">
                {new Date(enq.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )}
    </div>
  );
}

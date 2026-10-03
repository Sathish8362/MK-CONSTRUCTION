'use client';

import React, { useState, useEffect } from 'react';
import { Enquiry, EnquiryStatus } from '@/types';
import { 
  Search, 
  Download, 
  Phone, 
  MessageSquare, 
  FileText, 
  MapPin, 
  Clock, 
  Filter, 
  X, 
  Save, 
  Eye, 
  AlertCircle,
  Building,
  Check,
  RefreshCw
} from 'lucide-react';

interface Props {
  initialEnquiries: Enquiry[];
}

export function EnquiriesManagerClient({ initialEnquiries }: Props) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.enquiries)) {
          setEnquiries(data.enquiries);
          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (e) {
      // silent
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchEnquiries();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  useEffect(() => {
    // Poll every 4 seconds to catch new incoming quote requests immediately
    const timer = setInterval(fetchEnquiries, 4000);
    return () => clearInterval(timer);
  }, []);

  const statuses: ('All' | EnquiryStatus)[] = ['All', 'New', 'Contacted', 'Quote sent', 'Won', 'Lost'];

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      e.name.toLowerCase().includes(query) ||
      e.mobile.includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.project_type.toLowerCase().includes(query) ||
      (e.message && e.message.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
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
      console.error("Failed to update enquiry status:", e);
    }
  };

  const handleOpenNotes = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setEditingNotes(enquiry.owner_notes || '');
    setNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEnquiry.id,
          status: selectedEnquiry.status,
          owner_notes: editingNotes,
        }),
      });

      if (res.ok) {
        setEnquiries(prev => prev.map(e => 
          e.id === selectedEnquiry.id ? { ...e, owner_notes: editingNotes } : e
        ));
        setNotesModalOpen(false);
      }
    } catch (e) {
      console.error("Failed to save notes:", e);
    } finally {
      setSavingNotes(false);
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
    <div>
      {/* Header and CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Customer Enquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review quote requests, follow up via WhatsApp, set lead statuses, and add private site notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors min-tap-target shrink-0 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Leads'}</span>
          </button>

          <a
            href="/api/admin/enquiries?format=csv"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors min-tap-target shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, mobile, location, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {statuses.map((st) => {
            const count = st === 'All' ? enquiries.length : enquiries.filter(e => e.status === st).length;
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors min-tap-target ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries Cards & Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs">
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No customer enquiries match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="pb-3 pr-4">Customer Details</th>
                  <th className="pb-3 px-4">Instant Connect</th>
                  <th className="pb-3 px-4">Project & Location</th>
                  <th className="pb-3 px-4">Rough Budget</th>
                  <th className="pb-3 px-4">Lead Status</th>
                  <th className="pb-3 px-4">Private Notes</th>
                  <th className="pb-3 pl-4">Received Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Customer Name & Notes Preview */}
                    <td className="py-4 pr-4">
                      <div className="font-bold text-slate-900 text-sm">{enq.name}</div>
                      {enq.message && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic max-w-xs">
                          &ldquo;{enq.message}&rdquo;
                        </p>
                      )}
                    </td>

                    {/* Instant Connect: WhatsApp & Call */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:+91${enq.mobile}`}
                          className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 transition-colors min-tap-target flex items-center justify-center"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <a
                          href={`https://wa.me/91${enq.mobile}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20Sathish%20from%20MK%20Construction%20regarding%20your%20quote%20enquiry%20for%20${encodeURIComponent(enq.project_type)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-colors min-tap-target flex items-center justify-center"
                          title="Open in WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        <span className="font-mono text-slate-700 ml-1 font-semibold">+91 {enq.mobile}</span>
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

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${getStatusBadge(enq.status)}`}
                      >
                        {(['New', 'Contacted', 'Quote sent', 'Won', 'Lost'] as EnquiryStatus[]).map(st => (
                          <option key={st} value={st} className="bg-white text-slate-900">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Private Notes Trigger */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleOpenNotes(enq)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>{enq.owner_notes ? 'View/Edit Note' : '+ Add Note'}</span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-4 pl-4 text-slate-500 whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRIVATE NOTES & DETAILS MODAL */}
      {notesModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Owner Private Notes & Lead Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: {selectedEnquiry.name} (+91 {selectedEnquiry.mobile})
                </p>
              </div>

              <button
                onClick={() => setNotesModalOpen(false)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 min-tap-target flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Provided Information summary */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Project Type:</span>
                <span className="text-slate-900 font-bold">{selectedEnquiry.project_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-900 font-bold">{selectedEnquiry.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Budget:</span>
                <span className="text-amber-800 font-bold">{selectedEnquiry.budget}</span>
              </div>
              {selectedEnquiry.message && (
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <span className="text-slate-500 block mb-1">Message from Customer:</span>
                  <p className="text-slate-700 italic">&ldquo;{selectedEnquiry.message}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Notes Textarea */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Private Owner Notes (Not visible to customer)
              </label>
              <textarea
                rows={4}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="e.g. Visited plot in Thirubuvanam on Saturday. Quoted ₹42 Lakhs for G+1 duplex. Follow-up scheduled for next Tuesday."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setNotesModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider min-tap-target cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 min-tap-target cursor-pointer"
              >
                {savingNotes ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { SiteSettings, ServiceItem, Testimonial, FAQItem } from '@/types';
import {
  Save,
  Sparkles,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface Props {
  initialSettings: SiteSettings;
  initialServices: ServiceItem[];
  initialTestimonials: Testimonial[];
  initialFaqs: FAQItem[];
}

export function ContentEditorClient({
  initialSettings,
  initialServices,
  initialTestimonials,
  initialFaqs,
}: Props) {
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'testimonials' | 'faqs'>('hero');
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setSaveError(msg);
      setTimeout(() => setSaveError(null), 4000);
    } else {
      setSaveSuccess(msg);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleSave = async (type: 'settings' | 'services' | 'testimonials' | 'faqs', data: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save changes');
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
    } catch (err: any) {
      showNotification(err.message || 'Error saving changes', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Live Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Edit text, headlines, services, testimonials, and FAQs instantly without touching code.
          </p>
        </div>

        {/* Status Toast */}
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{saveSuccess}</span>
          </div>
        )}
        {saveError && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{saveError}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-tap-target cursor-pointer ${activeTab === 'hero'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero & Key Facts</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-tap-target cursor-pointer ${activeTab === 'services'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Services ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-tap-target cursor-pointer ${activeTab === 'testimonials'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
        >
          <Star className="w-4 h-4" />
          <span>Testimonials ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-tap-target cursor-pointer ${activeTab === 'faqs'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQs ({faqs.length})</span>
        </button>
      </div>

      {/* TAB 1: HERO & BRAND */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Hero & Key Details</h2>
              <p className="text-xs text-slate-500">Headlines, stats strip, and company metrics</p>
            </div>
            <button
              onClick={() => handleSave('settings', settings)}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider min-tap-target cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Hero Headline
              </label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Hero Description
              </label>
              <textarea
                rows={3}
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Established Year
              </label>
              <input
                type="number"
                value={settings.established_year}
                onChange={(e) => setSettings({ ...settings, established_year: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Completed Projects Count Display
              </label>
              <input
                type="text"
                value={settings.stats_projects_count}
                onChange={(e) => setSettings({ ...settings, stats_projects_count: e.target.value })}
                placeholder="250+"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Happy Clients Metric
              </label>
              <input
                type="text"
                value={settings.stats_happy_clients}
                onChange={(e) => setSettings({ ...settings, stats_happy_clients: e.target.value })}
                placeholder="500+"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Structural Warranty Metric
              </label>
              <input
                type="text"
                value={settings.stats_warranty_years}
                onChange={(e) => setSettings({ ...settings, stats_warranty_years: e.target.value })}
                placeholder="10 Years"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Class License Number
              </label>
              <input
                type="text"
                value={settings.license_number}
                onChange={(e) => setSettings({ ...settings, license_number: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Safety Quality Standard
              </label>
              <input
                type="text"
                value={settings.safety_standard}
                onChange={(e) => setSettings({ ...settings, safety_standard: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES */}
      {activeTab === 'services' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Services Offered</h2>
              <p className="text-xs text-slate-500">Manage titles, short summaries, and descriptions</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newService: ServiceItem = {
                    id: `srv-${Date.now()}`,
                    title: 'New Service',
                    slug: `new-service-${Date.now()}`,
                    icon_name: 'Hammer',
                    short_desc: 'Overview of the newly added service...',
                    full_desc: 'Comprehensive engineering details regarding this service...',
                    features: ['Quality execution', 'IS-Grade materials', 'Dedicated supervisor'],
                    display_order: services.length + 1,
                    is_active: true,
                  };
                  setServices([...services, newService]);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold min-tap-target cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
              <button
                onClick={() => handleSave('services', services)}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider min-tap-target cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Services'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {services.map((srv, idx) => (
              <div key={srv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Service #{idx + 1}
                  </span>
                  <button
                    onClick={() => setServices(services.filter((s) => s.id !== srv.id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 min-tap-target cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Title</label>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => {
                        const copy = [...services];
                        copy[idx].title = e.target.value;
                        setServices(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={srv.short_desc}
                      onChange={(e) => {
                        const copy = [...services];
                        copy[idx].short_desc = e.target.value;
                        setServices(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Description</label>
                    <textarea
                      rows={2}
                      value={srv.full_desc}
                      onChange={(e) => {
                        const copy = [...services];
                        copy[idx].full_desc = e.target.value;
                        setServices(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Client Reviews & Testimonials</h2>
              <p className="text-xs text-slate-500">Authentic quotes from homeowners and commercial owners</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newTest: Testimonial = {
                    id: `test-${Date.now()}`,
                    client_name: 'Client Name',
                    client_role: 'Homeowner',
                    location: 'Thirubuvanam, Tamil Nadu',
                    project_title: 'Residential Villa',
                    comment: 'MK Construction did a fantastic job delivering our home on time with high build quality.',
                    rating: 5,
                    display_order: testimonials.length + 1,
                    is_featured: true,
                  };
                  setTestimonials([...testimonials, newTest]);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold min-tap-target cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
              <button
                onClick={() => handleSave('testimonials', testimonials)}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider min-tap-target cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Reviews'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {testimonials.map((test, idx) => (
              <div key={test.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Review #{idx + 1}
                  </span>
                  <button
                    onClick={() => setTestimonials(testimonials.filter((t) => t.id !== test.id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 min-tap-target cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={test.client_name}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[idx].client_name = e.target.value;
                        setTestimonials(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Role / Tagline</label>
                    <input
                      type="text"
                      value={test.client_role || ''}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[idx].client_role = e.target.value;
                        setTestimonials(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={test.location}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[idx].location = e.target.value;
                        setTestimonials(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Review Quote</label>
                    <textarea
                      rows={2}
                      value={test.comment}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[idx].comment = e.target.value;
                        setTestimonials(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">Provide transparent answers to common customer questions</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newFaq: FAQItem = {
                    id: `faq-${Date.now()}`,
                    question: 'New question?',
                    answer: 'Detailed answer explaining our process and terms...',
                    category: 'General',
                    display_order: faqs.length + 1,
                    is_published: true,
                  };
                  setFaqs([...faqs, newFaq]);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold min-tap-target cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
              <button
                onClick={() => handleSave('faqs', faqs)}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider min-tap-target cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save FAQs'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    FAQ #{idx + 1}
                  </span>
                  <button
                    onClick={() => setFaqs(faqs.filter((f) => f.id !== faq.id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 min-tap-target cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[idx].question = e.target.value;
                      setFaqs(copy);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Answer</label>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[idx].answer = e.target.value;
                      setFaqs(copy);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, Phone, Clock, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { SiteSettings } from '@/types';

interface QuoteFormProps {
  settings: SiteSettings;
  preselectedService?: string;
}

export function QuoteForm({ settings, preselectedService }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    project_type: preselectedService || 'Residential',
    budget: '₹35 - ₹75 Lakhs',
    message: '',
    consent: true,
    _honeypot: '', // honeypot spam protection
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const budgetOptions = [
    '< ₹15 Lakhs (Minor Renovation / Interiors)',
    '₹15 - ₹35 Lakhs (Compact Villa / Major Reno)',
    '₹35 - ₹75 Lakhs (Standard 3-BHK Villa / Floors)',
    '₹75 Lakhs - ₹1.5 Cr (Luxury Villa / Commercial)',
    '> ₹1.5 Cr (Grand Commercial / Multi-Storey)',
  ];

  const projectTypeOptions = [
    'Residential (New Home / Villa)',
    'Commercial (Retail Complex / Office)',
    'Renovation & Structural Retrofitting',
    'Interiors & Modular Crafting',
    'Turnkey Construction & Architecture',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side quick check
    let cleanMobile = formData.mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.startsWith('91') && cleanMobile.length === 12) {
      cleanMobile = cleanMobile.slice(2);
    } else if (cleanMobile.startsWith('0') && cleanMobile.length === 11) {
      cleanMobile = cleanMobile.slice(1);
    }
    const indianMobileRegex = /^[6-9]\d{9}$/;

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!indianMobileRegex.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g. 9150786656).");
      return;
    }

    if (!formData.location.trim()) {
      setErrorMsg("Please provide your project location or town.");
      return;
    }

    if (!formData.consent) {
      setErrorMsg("Please agree to the consent checkbox so our engineer can contact you.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mobile: cleanMobile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote enquiry.");
      }

      setSubmitted(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#D97706', '#FFFFFF', '#3B82F6'],
        });
      } catch (cErr) {
        // ignore confetti errors in unsupported environments
      }

    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try calling us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote" className="py-24 bg-blueprint-pattern relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & Guarantees */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
              Free Technical Consultation
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-6">
              GET A FREE, ITEMISED ESTIMATE FOR YOUR DREAM PROJECT
            </h2>

            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Tell us about your plot or property in Thirubuvanam, Kumbakonam, or neighboring districts. Our licensed chief civil engineer will evaluate your requirements and provide a detailed BOQ.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>We guarantee a personal callback within <strong>one working day</strong>.</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Zero obligations. Complete privacy under India&apos;s DPDP Act.</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Direct notification dispatched to owner Sathish (+91 {settings.owner_mobile.replace(/[^0-9]/g, '').slice(-10)}).</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Need an immediate conversation?
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${settings.owner_mobile}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {settings.owner_mobile}</span>
                </a>
                <a
                  href={`https://wa.me/${settings.owner_mobile.replace(/[^0-9]/g, '')}?text=Hi%20MK%20Construction,%20I%20am%20interested%20in%20a%20construction%20quote.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quote Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
              
              {/* Corner decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />

              {submitted ? (
                /* SUCCESS CONFIRMATION STATE */
                <div className="py-12 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                    Enquiry Received Successfully!
                  </h3>

                  <div className="inline-block px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 font-bold text-sm mb-6">
                    &ldquo;Thanks, we will call you within one working day&rdquo;
                  </div>

                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Our lead structural engineer has received your enquiry details. We will reach out on <strong className="text-slate-900">+91 {formData.mobile}</strong> to schedule a site review.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/${settings.owner_mobile.replace(/[^0-9]/g, '')}?text=Hi%20MK%20Construction,%20I%20just%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(formData.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-tap-target shadow-md shadow-emerald-600/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Owner on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          mobile: '',
                          location: '',
                          project_type: 'Residential',
                          budget: '₹35 - ₹75 Lakhs',
                          message: '',
                          consent: true,
                          _honeypot: '',
                        });
                      }}
                      className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider min-tap-target"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* QUOTE FORM INPUTS */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4 mb-4">
                    <h3 className="text-2xl font-black text-slate-900">
                      Request a Free Quote
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out this quick form. No commitment required.
                    </p>
                  </div>

                  {/* Honeypot anti-spam field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="_honeypot"
                      value={formData._honeypot}
                      onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. S. Rajan"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Mobile Number with India Flag / +91 */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-slate-600 select-none">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.mobile}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.startsWith('91') && val.length > 10) val = val.slice(2);
                            else if (val.startsWith('0') && val.length > 10) val = val.slice(1);
                            setFormData({ ...formData, mobile: val.slice(0, 10) });
                          }}
                          placeholder="9150786656"
                          className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Location */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Project Site Town / Area <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Thirubuvanam / Kumbakonam"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Project Type
                      </label>
                      <select
                        value={formData.project_type}
                        onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm outline-none transition-all cursor-pointer"
                      >
                        {projectTypeOptions.map((opt) => (
                          <option key={opt} value={opt.split(' ')[0]}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget Dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Approximate Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm outline-none transition-all cursor-pointer"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message / Requirements */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Project Notes or Questions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Plot size 2400 sq.ft, interested in G+1 modern villa with Vastu compliance..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="quote-consent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="quote-consent" className="text-xs text-slate-600 cursor-pointer">
                      I agree to receive a direct callback or WhatsApp message from MK Construction regarding my estimate. My details will never be shared (DPDP Act compliant).
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 min-tap-target cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit & Get Free Quote</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
